import { useState, useEffect } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Clock,
  Lightbulb,
  CheckCircle2,
  X,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "coding";
  options?: string[];
  correctAnswer?: number | string;
  explanation: string;
  hint?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  relatedQuestions?: string[];
}

interface QuestionPageProps {
  question: Question;
  onNext?: () => void;
  onPrevious?: () => void;
  showTimer?: boolean;
  timerDuration?: number; // in seconds
}

export default function QuestionPage({
  question,
  onNext,
  onPrevious,
  showTimer = false,
  timerDuration = 300,
}: QuestionPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isAnswered, setIsAnswered] = useState(false);

  // Timer effect
  useEffect(() => {
    if (showTimer && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTimer, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Timer and Difficulty */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={getDifficultyColor(question.difficulty)}
            >
              {question.difficulty}
            </Badge>
            {showTimer && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {onPrevious && (
              <Button variant="outline" size="sm" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            {onNext && (
              <Button variant="outline" size="sm" onClick={onNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{question.question}</p>
          </CardContent>
        </Card>

        {/* Options / Code Editor */}
        {question.type === "multiple-choice" && question.options ? (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect =
                  isAnswered && index === question.correctAnswer;
                const isWrong =
                  isAnswered && isSelected && index !== question.correctAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : isWrong
                          ? "border-red-500 bg-red-500/10"
                          : "border-blue-500 bg-blue-500/10"
                        : "border-border hover:border-blue-500/50"
                    } ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? isCorrect
                              ? "border-green-500 bg-green-500"
                              : isWrong
                              ? "border-red-500 bg-red-500"
                              : "border-blue-500 bg-blue-500"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected &&
                          (isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          ) : isWrong ? (
                            <X className="h-4 w-4 text-white" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          ))}
                      </div>
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="flex-1">{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50 min-h-[300px]">
                <textarea
                  className="w-full h-full bg-transparent font-mono text-sm outline-none resize-none"
                  placeholder="Write your code here..."
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {!isAnswered && (
          <div className="flex gap-3">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="lg"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            {question.type === "multiple-choice" && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                size="lg"
                className="flex-1"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {/* Hint */}
        {showHint && question.hint && (
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Lightbulb className="h-5 w-5" />
                Hint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{question.hint}</p>
            </CardContent>
          </Card>
        )}

        {/* Solution */}
        {isAnswered && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowSolution(!showSolution)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>

            {showSolution && (
              <Card className="bg-green-500/5 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    Solution & Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Related Questions */}
        {question.relatedQuestions && question.relatedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.relatedQuestions.map((related, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                  >
                    <span className="text-sm">{related}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

