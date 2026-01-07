"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthenticated } from "../hooks/useAuthanticated";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { setBucketInfo, setFileName, setFileUrl } from "../hooks/State";


export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthenticated();

  const bucketInfodispatch = useDispatch();
  const fileurldispatch = useDispatch();
  const filenamedispatch = useDispatch();
  

  const handleUpload = useCallback(
    async (file: File) => {
      if (!isAuthenticated) {
        router.push("/auth");
        return;
      }
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const raw = (event.loaded / event.total) * 100;
          const safe = Math.min(100, Math.max(0, raw));
          setUploadProgress(safe);
        } else {
          setUploadProgress(0);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          bucketInfodispatch(setBucketInfo(response.fileName));
          const fileUrl = response.url;
          fileurldispatch(setFileUrl(fileUrl))
          filenamedispatch(setFileName(response.fileName))
          setTimeout(() => {
            router.push(`/processing`);
          }, 500);
        } else {
          alert("Upload failed. Please try again.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        alert("Upload failed. Please try again.");
      };

      xhr.send(formData);
    },
    [isAuthenticated, router , setBucketInfo]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md w-full shadow-lg border-primary/20 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-background dark:via-blue-950/10 dark:to-background">
          <CardContent className="py-10 text-center flex flex-col items-center">
            <p className="text-xl font-semibold mb-4">Sign In Required</p>
            <p className="text-muted-foreground mb-6">
              You must be signed in to upload documents.
            </p>
            <Button asChild className="w-full max-w-xs">
              <Link href="/auth">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 dark:from-blue-950/20 dark:via-background dark:to-blue-950/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Upload Your Legal Document
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your legal document in PDF, DOCX, or image format. Our AI
              will analyze and simplify it for you in multiple languages.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Drag and drop your file here, or click to browse. Maximum file
                  size: 100MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }
                    ${isUploading ? "pointer-events-none" : ""}
                  `}
                >
                  <input {...getInputProps()} />

                  {!isUploading && !uploadedFile && (
                    <div>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {isDragActive
                          ? "Drop your file here"
                          : "Upload your document"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Support for PDF, DOCX, DOC, JPEG, PNG files
                      </p>
                      <Button variant="outline">Browse Files</Button>
                    </div>
                  )}

                  {uploadedFile && !isUploading && (
                    <div>
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">File Ready</h3>
                      <p className="text-muted-foreground">
                        {uploadedFile.name} (
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-4">
                      <div className="h-12 w-12 mx-auto mb-4 animate-pulse">
                        <Upload className="h-full w-full text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Uploading...</h3>
                      <div className="max-w-md mx-auto">
                        <Progress
                          value={Math.min(
                            100,
                            Math.max(
                              0,
                              Number.isFinite(uploadProgress)
                                ? uploadProgress
                                : 0
                            )
                          )}
                          max={100}
                          className="mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          {uploadProgress.toFixed(0)}% uploaded
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Supported Formats</h3>
                <p className="text-sm text-muted-foreground">
                  PDF, DOCX, DOC files up to 10MB
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Image Documents</h3>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG images with OCR processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption and secure processing
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}