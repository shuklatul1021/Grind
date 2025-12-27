import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@repo/ui/button";
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
  SquareChevronRight,
  Sun,
  Moon,
  LogOut,
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
  setUserAllChats,
  setUserCreditDetails,
  setUserPrompt,
} from "../state/ReduxStateProvider";

const FormattedMessage = ({ content }: { content: string }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.JSX.Element[] = [];
    let key = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.trim().startsWith("### ")) {
        elements.push(
          <h3
            key={key++}
            className="text-lg font-semibold mt-8 mb-4 text-foreground text-left tracking-tight"
          >
            {line.replace("### ", "").trim()}
          </h3>
        );
        i++;
      } else if (line.trim().startsWith("## ")) {
        elements.push(
          <h2
            key={key++}
            className="text-xl font-semibold mt-10 mb-4 text-foreground text-left tracking-tight"
          >
            {line.replace("## ", "").trim()}
          </h2>
        );
        i++;
      } else if (line.trim().startsWith("# ")) {
        elements.push(
          <h1
            key={key++}
            className="text-2xl font-semibold mt-12 mb-5 text-foreground text-left tracking-tight"
          >
            {line.replace("# ", "").trim()}
          </h1>
        );
        i++;
      } else if (line.trim().match(/^[*-]\s/)) {
        const listItems: React.JSX.Element[] = [];
        while (i < lines.length && lines[i].trim().match(/^[*-]\s/)) {
          let itemText = lines[i].replace(/^[*-]\s/, "").trim();

          itemText = itemText.replace(/^\*\s*/, "");

          itemText = itemText.replace(
            /^\*\*([^*:]+):\*\*\s*/,
            '<strong class="font-medium text-foreground">$1:</strong> '
          );

          itemText = itemText.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-medium text-foreground">$1</strong>'
          );

          itemText = itemText.replace(
            /`([^`]+)`/g,
            '<code class="inline-flex items-center bg-zinc-950 dark:bg-black text-emerald-400 px-3 py-1.5 rounded-lg text-[13px] font-mono border border-zinc-700 dark:border-zinc-800 shadow-lg font-semibold">$1</code>'
          );

          listItems.push(
            <li
              key={`li-${key++}`}
              className="flex gap-3 mb-2.5 text-left group"
            >
              <span className="text-foreground/50 mt-[0.35rem] flex-shrink-0 text-sm font-medium">
                •
              </span>
              <span
                className="flex-1 text-foreground/85 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: itemText }}
              />
            </li>
          );
          i++;
        }
        elements.push(
          <ul key={key++} className="my-5 space-y-0 text-left pl-1">
            {listItems}
          </ul>
        );
      } else if (line.trim().match(/^\d+\./)) {
        const listItems: React.JSX.Element[] = [];
        let num = 1;
        while (i < lines.length && lines[i].trim().match(/^\d+\./)) {
          let content = lines[i].replace(/^\s*\d+\.\s*/, "").trim();
          content = content.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-medium text-foreground">$1</strong>'
          );
          content = content.replace(
            /`([^`]+)`/g,
            '<code class="inline-flex items-center bg-zinc-950 dark:bg-black text-emerald-400 px-3 py-1.5 rounded-lg text-[13px] font-mono border border-zinc-700 dark:border-zinc-800 shadow-lg font-semibold">$1</code>'
          );

          listItems.push(
            <li key={`oli-${key++}`} className="flex gap-3 mb-2.5 text-left">
              <span className="text-foreground/50 font-semibold flex-shrink-0 min-w-[20px] text-sm">
                {num}.
              </span>
              <span
                className="flex-1 text-foreground/85 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </li>
          );
          num++;
          i++;
        }
        elements.push(
          <ol key={key++} className="my-5 space-y-0 text-left pl-1">
            {listItems}
          </ol>
        );
      } else if (line.trim().startsWith("```")) {
        let codeBlock = "";
        const lang = line.replace("```", "").trim() || "code";
        const codeId = `code-${key}`;
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeBlock += lines[i] + "\n";
          i++;
        }
        i++;

        elements.push(
          <div
            key={key++}
            className="my-6 rounded-xl overflow-hidden border border-zinc-700/50 dark:border-zinc-600/30 bg-zinc-900/40 dark:bg-zinc-900/30 shadow-lg"
          >
            <div className="bg-zinc-800/60 dark:bg-zinc-800/50 px-4 py-2.5 flex items-center justify-between border-b border-zinc-700/40 dark:border-zinc-600/30">
              <span className="text-xs font-semibold text-zinc-300 dark:text-zinc-400 capitalize tracking-wider text-left">
                {lang}
              </span>
              <button
                onClick={() => copyToClipboard(codeBlock.trim(), codeId)}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-200 transition-all duration-200 px-3 py-1.5 rounded-md hover:bg-zinc-700/60 dark:hover:bg-zinc-700/40 border border-transparent hover:border-zinc-600/40"
              >
                {copiedCode === codeId ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto bg-zinc-950/50 dark:bg-zinc-900/30 text-left scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              <code className="text-[13.5px] leading-relaxed font-mono text-zinc-50 dark:text-zinc-100">
                {codeBlock.trim()}
              </code>
            </pre>
          </div>
        );
      } else if (line.trim().length > 0) {
        let formattedLine = line;
        const isTreeStructure =
          /^[\s\/\\|]+$/.test(line) || /^[\s\d\/\\|]+$/.test(line);

        if (isTreeStructure) {
          elements.push(
            <pre
              key={key++}
              className="font-mono text-[13px] text-foreground/70 leading-tight my-1"
            >
              {line}
            </pre>
          );
        } else {
          formattedLine = formattedLine.replace(/^-\s*/, "");

          formattedLine = formattedLine.replace(
            /\*\*([^*:]+):\*\*/g,
            '<strong class="font-medium text-foreground">$1:</strong>'
          );
          formattedLine = formattedLine.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-medium text-foreground">$1</strong>'
          );
          formattedLine = formattedLine.replace(
            /\*([^*]+)\*/g,
            '<em class="italic text-foreground/80">$1</em>'
          );
          formattedLine = formattedLine.replace(
            /`([^`]+)`/g,
            '<code class="inline-flex items-center bg-zinc-950 dark:bg-black text-emerald-400 px-3 py-1.5 rounded-lg text-[13px] font-mono border border-zinc-700 dark:border-zinc-800 shadow-lg font-semibold">$1</code>'
          );

          elements.push(
            <p
              key={key++}
              className="mb-4 leading-7 text-foreground/85 text-left text-[15px]"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          );
        }
        i++;
      } else {
        elements.push(<div key={key++} className="h-2" />);
        i++;
      }
    }

    return elements;
  };

  return (
    <div className="space-y-0 text-left w-full max-w-none">
      {formatContent(content)}
    </div>
  );
};

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
          ""
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
  const [pageLoading, setPageLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasProcessedPrompt = useRef(false);

  const [gettingUserLatestCreditLoading, setGettingUserLatestCreditLoading] =
    useState(false);
  const userFirstPrompt = useSelector(
    (state: RootState) => state.userPrompts.prompt
  );

  const userAllChats = useSelector(
    (state: RootState) => state.userAllChats.allchats
  );

  const GetUserCreditDetails = useSelector(
    (state: RootState) => state.userCreditDetails
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
          })
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
              : session
          )
        );

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
                                : msg
                            ),
                          }
                        : session
                    );

                    const updatedSession = updatedSessions.find(
                      (s) => s.id === id
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
                            console.log("Messages saved to database");
                          } else {
                            console.log("Failed to save messages to database");
                          }
                        })
                        .catch((e) => {
                          console.log("Error saving messages:", e);
                        });
                    }

                    return updatedSessions;
                  });
                  break;
                }

                if (data.text) {
                  fullXMLText += data.text;
                  const displayText = cleanXMLResponse(fullXMLText);

                  setSessions((prev) =>
                    prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: displayText }
                                : msg
                            ),
                          }
                        : session
                    )
                  );
                }

                if (data.error) {
                  console.error("Stream error:", data.error);
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
                      (msg) => msg.id !== aiMessageId
                    ),
                  }
                : session
            )
          );
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Grind AI Down",
          description: "Grind AI Server Is Overloaded Try Again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [id, sessions, setSessions]
  );

  async function getUserDetails() {
    try {
      const response = await fetch(`${BACKENDURL}/user/details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          setUserCreditDetails({
            aicredit: data.user.aitoken,
            maxcredit: data.user.maxaitoken,
          })
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      });
    }
  }

  const CreateUserChat = useCallback(
    async (userPrompt: string) => {
      if (!id) return;
      const sessionExists = sessions.find((s) => s.id === id);
      console.log("Session exists:", sessionExists);
      if (!sessionExists) {
        console.log("Session doesn't exist, creating it first...");
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      getUserDetails();

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

        console.log("Adding messages to session...");
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
              : session
          )
        );

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
                                : msg
                            ),
                          }
                        : session
                    );

                    const updatedSession = updatedSessions.find(
                      (s) => s.id === id
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
                            console.log(
                              "Messages saved to database successfully"
                            );
                          } else {
                            console.log("Failed to save messages to database");
                          }
                        })
                        .catch((e) => {
                          console.log("Error saving messages:", e);
                        });
                    }

                    return updatedSessions;
                  });
                  break;
                }

                if (data.text) {
                  fullXMLText += data.text;
                  const displayText = cleanXMLResponse(fullXMLText);

                  setSessions((prev) =>
                    prev.map((session) =>
                      session.id === id
                        ? {
                            ...session,
                            messages: session.messages.map((msg) =>
                              msg.id === aiMessageId
                                ? { ...msg, content: displayText }
                                : msg
                            ),
                          }
                        : session
                    )
                  );
                }

                if (data.error) {
                  console.error("Stream error:", data.error);
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
                      (msg) => msg.id !== aiMessageId
                    ),
                  }
                : session
            )
          );
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Grind AI Down",
          description: "Grind AI Server Is Overloaded Try Again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [id, sessions, setSessions]
  );

  const getUserChats = async () => {
    try {
      setPageLoading(true);
      const response = await fetch(`${BACKENDURL}/grindai/get-chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setUserAllChats(data.chats));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch chat sessions. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Failed to fetch chat sessions. Please try again.",
        variant: "destructive",
      });
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
        }
      );
      if (response.ok) {
        const data = await response.json();
        const newChat = {
          id: data.chat.id,
          message: data.chat.message,
          createdAt: data.chat.createdAt,
        };
        console.log("Adding new chat to Redux:", newChat);
        await getUserChats();
        getUserDetails();
        navigate(`/grind-ai/c/${data.chat.id}`);
      } else {
        toast({
          title: "Error",
          description: "You Do Not Have Sufficient AI Credit",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Failed to create a new chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const currentSessionExists = sessions.find((s) => s.id === id);
    const chatExistsInList = userAllChats.some((chat) => chat.id === id);
    if (userAllChats.length === 0 || (id && !chatExistsInList)) {
      getUserChats();
    }

    if (GetUserCreditDetails.maxcredit === 0) {
      const fetchUserDetails = async () => {
        setGettingUserLatestCreditLoading(true);
        await getUserDetails();
        setGettingUserLatestCreditLoading(false);
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
      const hasUserMessage = currentSessionExists.messages.some(
        (msg) => msg.role === "user" && msg.content === userFirstPrompt
      );

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
    getUserDetails,
  ]);

  useEffect(() => {
    hasProcessedPrompt.current = false;
  }, [id]);

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Session Id ", sessionId);
    const resposne = await fetch(
      `${BACKENDURL}/grindai/delete-chat/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      }
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

    const existingSession = userAllChats.find((chat) => chat?.id === id);

    if (
      existingSession &&
      existingSession.message &&
      typeof existingSession.message === "string"
    ) {
      try {
        const messages = JSON.parse(existingSession.message);
        if (Array.isArray(messages)) {
          const firstUserMessage = messages.find(
            (msg: Message) => msg.role === "user" && msg.content
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
          console.error("Invalid messages format:", messages);
          const newSession: ChatSession = {
            id,
            title: "New Chat",
            messages: [],
            createdAt: new Date(),
          };
          setSessions((prev) => [newSession, ...prev]);
        }
      } catch (e) {
        console.error("Error parsing existing messages:", e);
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
  }, [currentSession?.messages]);

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
    <div className="flex h-screen bg-background flex-col overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/problems"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link
              to="/contest"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link
              to="/compiler"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Compiler
            </Link>
            <Link
              to="/grind-ai"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-base font-medium transition-all hover:bg-blue-600"
            >
              Grind AI
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Pricing
            </Link>
            <Link
              to="/you"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Profile
            </Link>
            <Link
              to="/premium"
              className="px-4 py-2 rounded-full text-base font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Premium
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`${
            isSidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 border-r border-border/40 bg-background/95 backdrop-blur flex flex-col overflow-hidden relative`}
        >
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-4 ">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <SquareChevronRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Grind AI</div>
                <div className="text-xs text-muted-foreground">
                  Your Coding Assistant
                </div>
              </div>
            </div>

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
              {userAllChats.length === 0 ? (
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
                                msg.role === "user" && msg.content
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
                            console.error("Error parsing message:", e);
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
            {gettingUserLatestCreditLoading ? (
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
                        onClick={() => navigate("/pricing")}
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
                    <SquareChevronRight className="h-6 w-6 text-blue-500" />
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
            ) : !currentSession?.messages ||
              currentSession.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center"></div>
            ) : (
              <div className="max-w-4xl mx-auto w-full space-y-6 pb-4 pt-4">
                {currentSession.messages.map((mess: Message) => (
                  <div key={mess.id} className="flex gap-4 items-start group">
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
                        <SquareChevronRight className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground mb-2 text-left">
                        {mess.role === "user" ? "You" : "Grind AI"}
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {mess.content ? (
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
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-border/40 bg-background/95 backdrop-blur p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Grind AI anything about coding..."
                  className="pr-12 h-12 text-base rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="absolute right-2 h-9 w-9 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Grind AI can make mistakes. Consider checking important
                information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
