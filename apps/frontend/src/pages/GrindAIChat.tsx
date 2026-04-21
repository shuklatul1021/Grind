import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Input } from "@repo/ui/input";
import { ScrollArea } from "@repo/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/alert-dialog";
import { useTheme } from "../contexts/ThemeContext";
import {
  Send,
  Plus,
  MessageSquare,
  User,
  Trash2,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import type { RootState } from "../state/ReduxStateProvider";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";
import { BACKENDURL } from "../utils/urls";
import type { ChatSession, Message } from "../types/problem";
import {
  setUserCreditDetails,
  setUserPrompt,
} from "../state/ReduxStateProvider";
import MainSideNav from "../components/MainSideNav";
import { useDashboardData } from "../hooks/useDashboardData";

const FormattedMessage = React.memo(({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, codeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.JSX.Element[] = [];
    let key = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // --- Headings ---
      if (line.trim().startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="text-base font-semibold mt-6 mb-3 text-foreground text-left tracking-tight">
            {line.replace("### ", "").trim()}
          </h3>,
        );
        i++;
      } else if (line.trim().startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="text-lg font-semibold mt-8 mb-3 text-foreground text-left tracking-tight">
            {line.replace("## ", "").trim()}
          </h2>,
        );
        i++;
      } else if (line.trim().startsWith("# ")) {
        elements.push(
          <h1 key={key++} className="text-xl font-semibold mt-10 mb-4 text-foreground text-left tracking-tight">
            {line.replace("# ", "").trim()}
          </h1>,
        );
        i++;
      }
      // --- Unordered lists ---
      else if (line.trim().match(/^[*-]\s/)) {
        const listItems: React.JSX.Element[] = [];
        while (i < lines.length && lines[i].trim().match(/^[*-]\s/)) {
          let itemText = lines[i].replace(/^\s*[*-]\s*/, "").trim();
          itemText = applyInlineFormatting(itemText);
          listItems.push(
            <li key={`li-${key++}`} className="flex gap-2.5 mb-1.5 text-left">
              <span className="text-foreground/40 mt-[0.35rem] flex-shrink-0 text-xs">•</span>
              <span className="flex-1 text-foreground/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: itemText }} />
            </li>,
          );
          i++;
        }
        elements.push(<ul key={key++} className="my-3 space-y-0 text-left pl-1">{listItems}</ul>);
      }
      // --- Ordered lists ---
      else if (line.trim().match(/^\d+\./)) {
        const listItems: React.JSX.Element[] = [];
        let num = 1;
        while (i < lines.length && lines[i].trim().match(/^\d+\./)) {
          let content = lines[i].replace(/^\s*\d+\.\s*/, "").trim();
          content = applyInlineFormatting(content);
          listItems.push(
            <li key={`oli-${key++}`} className="flex gap-2.5 mb-1.5 text-left">
              <span className="text-foreground/40 font-semibold flex-shrink-0 min-w-[20px] text-sm">{num}.</span>
              <span className="flex-1 text-foreground/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
            </li>,
          );
          num++;
          i++;
        }
        elements.push(<ol key={key++} className="my-3 space-y-0 text-left pl-1">{listItems}</ol>);
      }
      // --- Code blocks ---
      else if (line.trim().startsWith("```")) {
        let codeBlock = "";
        const lang = line.replace("```", "").trim() || "code";
        const codeId = `code-${key}`;
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeBlock += lines[i] + "\n";
          i++;
        }
        i++; // skip closing ```

        elements.push(
          <div key={key++} className="my-4 rounded-xl overflow-hidden border border-zinc-700/50 dark:border-zinc-600/30 bg-zinc-900/40 dark:bg-zinc-900/30 shadow-md">
            <div className="bg-zinc-800/60 dark:bg-zinc-800/50 px-4 py-2 flex items-center justify-between border-b border-zinc-700/40">
              <span className="text-xs font-semibold text-zinc-400 capitalize tracking-wider">{lang}</span>
              <button
                onClick={() => copyToClipboard(codeBlock.trim(), codeId)}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2.5 py-1 rounded-md hover:bg-zinc-700/60"
              >
                {copiedCode === codeId ? (
                  <><Check className="h-3.5 w-3.5" /><span>Copied!</span></>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto bg-zinc-950/50 dark:bg-zinc-900/30 text-left">
              <code className="text-[13px] leading-relaxed font-mono text-zinc-100">{codeBlock.trim()}</code>
            </pre>
          </div>,
        );
      }
      // --- Non-empty text lines ---
      else if (line.trim().length > 0) {
        let formattedLine = line;
        // Tree-structure detection (filesystem trees, etc.)
        const isTreeStructure = /^[\s\/\\|]+$/.test(line) || /^[\s\d\/\\|]+$/.test(line);
        if (isTreeStructure) {
          elements.push(
            <pre key={key++} className="font-mono text-[13px] text-foreground/70 leading-tight my-1">{line}</pre>,
          );
        } else {
          formattedLine = formattedLine.replace(/^-\s*/, "");
          formattedLine = applyInlineFormatting(formattedLine);
          elements.push(
            <p key={key++} className="mb-3 leading-7 text-foreground/85 text-left text-[15px]" dangerouslySetInnerHTML={{ __html: formattedLine }} />,
          );
        }
        i++;
      }
      // --- Empty lines ---
      else {
        elements.push(<div key={key++} className="h-1.5" />);
        i++;
      }
    }

    return elements;
  };

  return (
    <div className="space-y-0 text-left w-full max-w-none">
      {formatContent(content)}
      {isStreaming && (
        <span className="inline-block w-[3px] h-[18px] bg-blue-500 rounded-sm ml-0.5 align-text-bottom animate-[blink_1s_ease-in-out_infinite]" />
      )}
    </div>
  );
});

/** Apply bold, italic, and inline code formatting */
function applyInlineFormatting(text: string): string {
  // Bold with colon: **word:**
  text = text.replace(
    /\*\*([^*:]+):\*\*/g,
    '<strong class="font-medium text-foreground">$1:</strong>',
  );
  // Bold: **word**
  text = text.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-medium text-foreground">$1</strong>',
  );
  // Italic: *word*
  text = text.replace(
    /\*([^*]+)\*/g,
    '<em class="italic text-foreground/80">$1</em>',
  );
  // Inline code: `code`
  text = text.replace(
    /`([^`]+)`/g,
    '<code class="inline bg-zinc-900 dark:bg-black text-emerald-400 px-2 py-0.5 rounded-md text-[13px] font-mono border border-zinc-700/50 font-medium">$1</code>',
  );
  return text;
}

const cleanXMLResponse = (xmlText: string): string => {
  if (!xmlText) return "";

  let cleanedText = xmlText.replace(/<\?xml[^?]*\?>/gi, "");
  cleanedText = cleanedText.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1");

  const contentTags = [
    "answer",
    "explanation",
    "examples",
    "tips",
    "pseudocode",
  ];
  let extractedContent = "";

  contentTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
    const matches = cleanedText.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const content = match.replace(
          new RegExp(`<\\/?${tag}[^>]*>`, "gi"),
          "",
        );

        let sectionTitle = "";
        if (tag === "answer") sectionTitle = "## Answer\n\n";
        else if (tag === "explanation")
          sectionTitle = "## Detailed Explanation\n\n";
        else if (tag === "examples") sectionTitle = "## Examples\n\n";
        else if (tag === "tips") sectionTitle = "## Tips & Best Practices\n\n";
        else if (tag === "pseudocode")
          sectionTitle = "```pseudocode\n" + content + "\n```\n\n";

        if (tag === "pseudocode") {
          extractedContent += sectionTitle;
        } else {
          extractedContent += sectionTitle + content + "\n\n";
        }
      });
    }
  });

  if (extractedContent.trim()) {
    cleanedText = extractedContent;
  }

  cleanedText = cleanedText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "");
  cleanedText = cleanedText.replace(/<\/?response[^>]*>/gi, "");
  cleanedText = cleanedText.replace(/<example>/gi, "\n### Example\n\n");
  cleanedText = cleanedText.replace(/<\/example>/gi, "\n");
  cleanedText = cleanedText.replace(/<input>/gi, "**Input:** ");
  cleanedText = cleanedText.replace(/<\/input>/gi, "\n");
  cleanedText = cleanedText.replace(/<output>/gi, "**Output:**\n");
  cleanedText = cleanedText.replace(/<\/output>/gi, "\n");
  cleanedText = cleanedText.replace(/<[^>]+>/g, "");
  cleanedText = cleanedText.replace(/\n{3,}/g, "\n\n");
  cleanedText = cleanedText.trim();

  cleanedText = cleanedText
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return cleanedText;
};

export default function GrindAIChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // For smooth streaming
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [pageLoading, setPageLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedPrompt = useRef(false);

  const {
    userCredits: GetUserCreditDetails,
    userCreditsLoaded,
    userChats: userAllChats,
    refresh,
  } = useDashboardData(["userDetails", "userCredits", "userChats"]);

  const UserProfile = useSelector((state: RootState) => state.userDetails);
  const userFirstPrompt = useSelector(
    (state: RootState) => state.userPrompts.prompt,
  );

  const currentSession = sessions.find((s) => s.id === id);

  const UpdateUserCredit = async () => {
    try {
      const response = await fetch(`${BACKENDURL}/grindai/update-user-credit`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          setUserCreditDetails({
            aicredit: data.credit,
            maxcredit: data.maxcredit,
          }),
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to update user credit. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update user credit. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Throttle streaming updates to ~30fps for smooth rendering
  const streamingBufferRef = useRef<string>("");
  const rafIdRef = useRef<number | null>(null);

  const flushStreamingBuffer = useCallback(() => {
    if (streamingBufferRef.current) {
      setStreamingMessage(streamingBufferRef.current);
    }
    rafIdRef.current = null;
  }, []);

  const scheduleStreamingUpdate = useCallback((text: string) => {
    streamingBufferRef.current = text;
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(flushStreamingBuffer);
    }
  }, [flushStreamingBuffer]);

  const GetAIResponse = useCallback(
    async (userPrompt: string) => {
      if (!id) return;
      const sessionExists = sessions.find((s) => s.id === id);
      if (!sessionExists) {
        return;
      }

      try {
        const aiMessageId = Date.now().toString();
        const aiMessage: Message = {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };
        setSessions((prev) =>
          prev.map((session) =>
            session.id === id
              ? {
                  ...session,
                  messages: [...session.messages, aiMessage],
                }
              : session,
          ),
        );
        setStreamingMessage("");
        setStreamingMessageId(aiMessageId);
        setIsLoading(true);

        const response = await fetch(`${BACKENDURL}/grindai/chat`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            usermessage: userPrompt,
          }),
        });

        if (response.ok) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (!reader) return;
          let fullXMLText = "";
          let lastCleaned = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = JSON.parse(line.slice(6));
                if (data.done) {
                  const finalCleanedText = cleanXMLResponse(fullXMLText);
                  setSessions((prev) => {
                    const updatedSessions = prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: finalCleanedText }
                                : msg,
                            ),
                          }
                        : session,
                    );
                    const updatedSession = updatedSessions.find(
                      (s) => s.id === id,
                    );
                    if (updatedSession) {
                      fetch(`${BACKENDURL}/grindai/update-chat/${id}`, {
                        method: "PUT",
                        headers: {
                          "Content-type": "application/json",
                          token: localStorage.getItem("token") || "",
                        },
                        body: JSON.stringify({
                          messageArray: JSON.stringify(updatedSession.messages),
                        }),
                      })
                        .then((response) => {
                          if (response.ok) {
                            //pass
                          } else {
                            //passs
                          }
                        })
                        .catch(() => {});
                    }
                    return updatedSessions;
                  });
                  setStreamingMessage("");
                  setStreamingMessageId(null);
                  break;
                }
                if (data.text) {
                  fullXMLText += data.text;
                  // Only append the new chunk for smooth streaming
                  const cleaned = cleanXMLResponse(fullXMLText);
                  // Only update if new content
                  if (cleaned !== lastCleaned) {
                    scheduleStreamingUpdate(cleaned);
                    lastCleaned = cleaned;
                  }
                  setSessions((prev) =>
                    prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: cleaned }
                                : msg,
                            ),
                          }
                        : session,
                    ),
                  );
                }
                if (data.error) {
                  //pass
                }
              }
            }
          }
        } else {
          toast({
            title: "Grind AI Down",
            description: "Grind AI Server Is Overloaded Try Again Later",
            variant: "destructive",
          });
          setSessions((prev) =>
            prev.map((session) =>
              session.id === id
                ? {
                    ...session,
                    messages: session.messages.filter(
                      (msg) => msg.id !== aiMessageId,
                    ),
                  }
                : session,
            ),
          );
        }
      } catch (e) {
        toast({
          title: "Grind AI Down",
          description: "Grind AI Server Is Overloaded Try Again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [id, sessions, scheduleStreamingUpdate],
  );




  const CreateUserChat = useCallback(
    async (userPrompt: string) => {
      if (!id) return;
      const sessionExists = sessions.find((s) => s.id === id);

      if (!sessionExists) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      refresh.userDetails();

      try {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: userPrompt,
          timestamp: new Date(),
        };

        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((session) =>
            session.id === id
              ? {
                  ...session,
                  messages: [...session.messages, userMessage, aiMessage],
                  title:
                    session.messages.length === 0
                      ? userPrompt.slice(0, 30) +
                        (userPrompt.length > 30 ? "..." : "")
                      : session.title,
                }
              : session,
          ),
        );

        setStreamingMessage("");
        setStreamingMessageId(aiMessageId);
        setIsLoading(true);

        const response = await fetch(`${BACKENDURL}/grindai/chat`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            usermessage: userPrompt,
          }),
        });

        if (response.ok) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) return;

          let fullXMLText = "";

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = JSON.parse(line.slice(6));

                if (data.done) {
                  const finalCleanedText = cleanXMLResponse(fullXMLText);
                  setSessions((prev) => {
                    const updatedSessions = prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: finalCleanedText }
                                : msg,
                            ),
                          }
                        : session,
                    );

                    const updatedSession = updatedSessions.find(
                      (s) => s.id === id,
                    );
                    if (updatedSession) {
                      fetch(`${BACKENDURL}/grindai/update-chat/${id}`, {
                        method: "PUT",
                        headers: {
                          "Content-type": "application/json",
                          token: localStorage.getItem("token") || "",
                        },
                        body: JSON.stringify({
                          messageArray: JSON.stringify(updatedSession.messages),
                        }),
                      })
                        .then((response) => {
                          if (response.ok) {
                            //pass
                          } else {
                            //pass
                          }
                        })
                        .catch(() => {});
                    }

                    return updatedSessions;
                  });
                  setStreamingMessage("");
                  setStreamingMessageId(null);
                  break;
                }

                if (data.text) {
                  fullXMLText += data.text;
                  const displayText = cleanXMLResponse(fullXMLText);
                  scheduleStreamingUpdate(displayText);

                  setSessions((prev) =>
                    prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: displayText }
                                : msg,
                            ),
                          }
                        : session,
                    ),
                  );
                }

                if (data.error) {
                  console.error("Error from Grind AI:", data.error);
                }
              }
            }
          }
        } else {
          toast({
            title: "Grind AI Down",
            description: "Grind AI Server Is Overloaded Try Again Later",
            variant: "destructive",
          });

          setSessions((prev) =>
            prev.map((session) =>
              session.id === id
                ? {
                    ...session,
                    messages: session.messages.filter(
                      (msg) => msg.id !== aiMessageId,
                    ),
                  }
                : session,
            ),
          );
        }
      } catch (e) {
        toast({
          title: "Grind AI Down",
          description: "Grind AI Server Is Overloaded Try Again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setStreamingMessage("");
        setStreamingMessageId(null);
      }
    },
    [id, sessions, scheduleStreamingUpdate],
  );

  const getUserChats = async () => {
    try {
      setPageLoading(true);
      await refresh.userChats();
    } finally {
      setPageLoading(false);
    }
  };

  const HandleNewChat = async () => {
    const newMessage: Message[] = [];
    try {
      const response = await fetch(
        `${BACKENDURL}/grindai/create-chat-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            message: JSON.stringify(newMessage),
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        await refresh.userChats();
        refresh.userDetails();
        navigate(`/grind-ai/c/${data.chat.id}`);
      } else {
        toast({
          title: "Error",
          description: "You Do Not Have Sufficient AI Credit",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to create a new chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const currentSessionExists = sessions.find((s) => s.id === id);
    const chatExistsInList =
      Array.isArray(userAllChats) && userAllChats.length > 0
        ? userAllChats.some((chat) => chat?.id === id)
        : false;
    if (
      !Array.isArray(userAllChats) ||
      userAllChats.length === 0 ||
      (id && !chatExistsInList)
    ) {
      getUserChats();
    }

    if (!userCreditsLoaded) {
      const fetchUserDetails = async () => {
        await refresh.userDetails();
      };
      fetchUserDetails();
    }

    if (
      userFirstPrompt &&
      typeof userFirstPrompt === "string" &&
      userFirstPrompt.length > 0 &&
      id &&
      currentSessionExists &&
      !hasProcessedPrompt.current
    ) {
      const hasUserMessage =
        Array.isArray(currentSessionExists.messages) &&
        currentSessionExists.messages.length > 0
          ? currentSessionExists.messages.some(
              (msg) => msg.role === "user" && msg.content === userFirstPrompt,
            )
          : false;

      if (hasUserMessage) {
        hasProcessedPrompt.current = true;
        GetAIResponse(userFirstPrompt);
        dispatch(setUserPrompt({ prompt: "" }));
      } else {
        hasProcessedPrompt.current = true;
        CreateUserChat(userFirstPrompt);
        dispatch(setUserPrompt({ prompt: "" }));
      }
    }
  }, [
    userFirstPrompt,
    id,
    sessions,
    CreateUserChat,
    GetAIResponse,
    dispatch,
    getUserChats,
    refresh,
  ]);

  useEffect(() => {
    hasProcessedPrompt.current = false;
  }, [id]);

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const resposne = await fetch(
      `${BACKENDURL}/grindai/delete-chat/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      },
    );

    if (resposne.ok) {
      getUserChats();
      toast({
        title: "Chat Successfully Deleted",
        description:
          "Your Message Is Successfully Deleted For Server Permanently",
        variant: "default",
      });
    } else {
      toast({
        title: "Error While Deleting Chat",
        description: "Error While Deleting Chat Session Try Again Later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Only proceed if we have an id and the session doesn't exist in local state
    if (!id || sessions.find((s) => s.id === id)) {
      return;
    }

    const existingSession =
      Array.isArray(userAllChats) && userAllChats.length > 0
        ? userAllChats.find((chat) => chat?.id === id)
        : undefined;

    if (
      existingSession &&
      existingSession.message &&
      typeof existingSession.message === "string"
    ) {
      try {
        const messages = JSON.parse(existingSession.message);
        if (Array.isArray(messages)) {
          const firstUserMessage = messages.find(
            (msg: Message) => msg.role === "user" && msg.content,
          );
          const newSession: ChatSession = {
            id,
            title: firstUserMessage
              ? firstUserMessage.content.slice(0, 30) +
                (firstUserMessage.content.length > 30 ? "..." : "")
              : "New Chat",
            messages: messages,
            createdAt: new Date(existingSession.createdAt),
          };
          setSessions((prev) => [newSession, ...prev]);
        } else {
          const newSession: ChatSession = {
            id,
            title: "New Chat",
            messages: [],
            createdAt: new Date(),
          };
          setSessions((prev) => [newSession, ...prev]);
        }
      } catch (e) {
        const newSession: ChatSession = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
        };
        setSessions((prev) => [newSession, ...prev]);
      }
    } else if (existingSession) {
      const newSession: ChatSession = {
        id,
        title: "New Chat",
        messages: [],
        createdAt: new Date(existingSession.createdAt),
      };
      setSessions((prev) => [newSession, ...prev]);
    }
  }, [id, sessions, userAllChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, streamingMessage]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !id) return;
    if (GetUserCreditDetails?.aicredit === 0) {
      navigate("/premium/pricing");
      return;
    }
    const userInput = input;
    setInput("");
    await UpdateUserCredit();
    await CreateUserChat(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background sidebar-offset">
      <MainSideNav
        active="ai"
        theme={theme}
        toggleTheme={toggleTheme}
        avatarUrl={UserProfile?.user?.avatar || ""}
        avatarFallback={UserProfile?.user?.fullname?.[0] || "G"}
        onProfile={() => navigate("/you")}
        onSignOut={handleSignOut}
      />

      <main className="flex h-[calc(100vh-3.5rem)] flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:h-screen lg:px-8">
        <section className="flex flex-none items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-border/60 bg-background p-2">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Dashboard
              </p>
              <h1 className="text-base font-semibold sm:text-lg">
                Grind AI Chat
              </h1>
            </div>
          </div>
          <Badge variant="outline">
            {GetUserCreditDetails?.aicredit ?? 0} credits
          </Badge>
        </section>

        <div className="relative min-h-0 flex flex-1 overflow-hidden rounded-2xl border border-border/50 bg-card/60">
          <div
            className={`${
              isSidebarOpen ? "w-80" : "w-0"
            } transition-all duration-300 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col overflow-hidden relative`}
          >
            <div className="p-4 border-b border-border/40">
              <Button
                onClick={HandleNewChat}
                className="w-full gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            <ScrollArea className="flex-1 p-2">
              <div className="space-y-2">
                {!Array.isArray(userAllChats) || userAllChats.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">
                      No chat history yet
                    </p>
                  </div>
                ) : (
                  userAllChats.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => navigate(`/grind-ai/c/${session.id}`)}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        id === session.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-sm truncate">
                          {(() => {
                            try {
                              const messages = JSON.parse(session.message);
                              if (!messages || messages.length === 0) {
                                return "New Chat";
                              }
                              const firstUserMessage = messages.find(
                                (msg: Message) =>
                                  msg.role === "user" && msg.content,
                              );
                              if (firstUserMessage) {
                                return (
                                  firstUserMessage.content.slice(0, 30) +
                                  (firstUserMessage.content.length > 30
                                    ? "..."
                                    : "")
                                );
                              }
                              return "New Chat";
                            } catch (e) {
                              return "New Chat";
                            }
                          })()}
                        </span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this conversation?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This chat and all its messages will be permanently
                              deleted. You won't be able to recover it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep it</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => deleteSession(session.id, e)}
                            >
                              Delete forever
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/40 mb-8">
              {!userCreditsLoaded ? (
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto flex flex-col items-stretch gap-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 opacity-50"
                  disabled
                >
                  <div className="flex items-center justify-between w-full animate-pulse">
                    <span className="text-xs font-medium text-muted-foreground">
                      AI Credits
                    </span>
                    <div className="h-4 w-12 bg-muted rounded"></div>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden animate-pulse">
                    <div className="h-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full w-full"></div>
                  </div>
                  <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto flex flex-col items-stretch gap-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-muted-foreground">
                      AI Credits
                    </span>
                    <span className="text-sm font-bold text-blue-500">
                      {GetUserCreditDetails?.aicredit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{
                        width: `${(GetUserCreditDetails?.aicredit / GetUserCreditDetails?.maxcredit) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {GetUserCreditDetails?.aicredit} of{" "}
                    {GetUserCreditDetails?.maxcredit} credits remaining
                  </p>
                  {GetUserCreditDetails?.aicredit === 0 ? (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <div className="text-center space-y-2">
                        <p className="text-xs text-red-500 font-medium">
                          You have exhausted your AI credits.
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                          onClick={() => navigate("/premium/pricing")}
                        >
                          <Zap className="h-3 w-3 mr-2" />
                          Upgrade Plan
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </Button>
              )}
            </div>

            {isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute -right-10 top-4 rounded-full h-8 w-8 bg-background border border-border/40 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 z-10 rounded-full h-8 w-8 bg-background border border-border/40 hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              {pageLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="max-w-md mx-auto text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto animate-pulse">
                      <BrainCircuit className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded-full w-48 mx-auto animate-pulse"></div>
                      <div className="h-4 bg-muted rounded-full w-32 mx-auto animate-pulse"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Loading your chat...
                    </p>
                  </div>
                </div>
              ) : !currentSession ||
                !currentSession.messages ||
                !Array.isArray(currentSession.messages) ||
                currentSession.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center"></div>
              ) : (
                <div className="max-w-4xl mx-auto w-full space-y-6 pb-4 pt-4">
                  {currentSession.messages.map((mess: Message) => {
                    // If this is the streaming assistant message, show live typing indicator
                    const isStreaming =
                      mess.id === streamingMessageId && isLoading;
                    return (
                      <div
                        key={mess.id}
                        className="flex gap-4 items-start group"
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            mess.role === "user"
                              ? "bg-green-500/10 border border-green-500/20"
                              : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20"
                          }`}
                        >
                          {mess.role === "user" ? (
                            <User className="h-5 w-5 text-green-500" />
                          ) : (
                            <BrainCircuit className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground mb-2 text-left">
                            {mess.role === "user" ? "You" : "Grind AI"}
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {isStreaming ? (
                              <FormattedMessage
                                content={
                                  streamingMessage || mess.content || ""
                                }
                                isStreaming={true}
                              />
                            ) : mess.content ? (
                              <FormattedMessage content={mess.content} />
                            ) : (
                              <div className="flex gap-1.5 py-2">
                                <div
                                  className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            <div className="border-t border-border/40 bg-background/70 p-4">
              <div className="mx-auto w-full max-w-4xl">
                <div className="relative flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Grind AI anything about coding..."
                    className="h-[88px] w-full rounded-xl pb-[50px] pr-12 text-base"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="absolute bottom-2 right-2 h-9 w-9 rounded-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Grind AI can make mistakes. Consider checking important
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
