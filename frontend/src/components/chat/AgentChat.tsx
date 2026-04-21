import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  SlidersHorizontal,
  User,
  AlignLeft,
  FileText,
  Loader2,
  Mic,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useOpportunities } from "@/api/useOpportunities";
import { useMapData } from "@/api/useMapData";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  actions?: { id: string; label: string; tabContent: string }[];
  isLoading?: boolean;
}

export function AgentChat() {
  const { addTab } = useAppStore();
  const { routes } = useMapData(); // Get routes from map store to detect compliance data
  const { fetchOpportunities, isLoading: isFetching } = useOpportunities({
    orchestratorUrl: "http://localhost:8000",
  });
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content:
        'Welcome to ProGLOBAX\n\nI am your AI-powered global trade intelligence assistant. I help you discover, analyze, and capitalize on international trade opportunities with precision and speed.\n\nTry asking: "Find salt export opportunities in Vietnam" or "Analyze supply risks in Southeast Asia"',
    },
  ]);
  
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Speech Recognition Initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognition.onend = () => {
          setListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleActionClick = (action: NonNullable<Message["actions"]>[0]) => {
    addTab({
      id: action.id,
      title: action.label,
      contentType: action.tabContent,
      isClosable: true,
    });

    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: `Executing ${action.label}...` },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: `I've prepared the environment for ${action.label}.`,
        },
      ]);
    }, 600);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userPrompt,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Show loading message
    const loadingMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMsgId,
        role: "agent",
        content: "Analyzing market vectors and searching for opportunities...",
        isLoading: true,
      },
    ]);

    try {
      // Call the orchestrator API to fetch opportunities
      await fetchOpportunities(userPrompt);

      // Check if this is a compliance response (has routes with compliance_status)
      const hasComplianceData = routes && routes.length > 0 && routes.some(r => r.compliance_status);

      // Update the loading message with success
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                ...msg,
                isLoading: false,
                content: `✅ Found opportunities for: "${userPrompt}"\n\nOpportunities are now displayed on the map and in the dedicated tab. Check the Opportunities panel to browse and explore each opportunity in detail.`,
                actions: [
                  {
                    id: "view_opportunities",
                    label: "View All Opportunities",
                    tabContent: "opportunities",
                  },
                  { id: "view_map", label: "View on Map", tabContent: "map" },
                ],
              }
            : msg,
        ),
      );
    } catch (error) {
      // Show error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                ...msg,
                isLoading: false,
                content: `❌ Error: Could not fetch opportunities. Make sure the orchestrator API is running on http://localhost:8000\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`,
              }
            : msg,
        ),
      );
    }
  };

  return (
    <div className="w-[380px] h-full bg-background border-l border-border/50 flex flex-col shrink-0">
      {/* Header */}
      <div className="h-12 flex justify-between items-center px-5 shrink-0 z-10 border-b border-border/30">
        <span className="font-semibold text-sm text-foreground/90">
          AI Trade Assistant
        </span>
        <button
          onClick={() => {
            console.log("Settings clicked");
          }}
          className="text-muted-foreground hover:text-primary text-lg font-bold px-2"
        >
          +
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col w-full">
            {msg.role === "user" ? (
              // User Message Match the mockup (Dark Bubble, slightly rounded, aligned left actually but grouped)
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    You
                  </span>
                </div>
                <div className="bg-card bg-opacity-70 px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm border border-border/30 text-foreground/90 w-full">
                  {msg.content}
                </div>
              </div>
            ) : (
              // AI Message matched to mockup (Card base with nested actions)
              <div className="flex flex-col items-start gap-2 w-full mt-2">
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      proGLOBAX AI
                    </span>
                  </div>
                  {msg.id !== "1" && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 bg-secondary/30 px-2 py-0.5 rounded">
                      {msg.isLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />{" "}
                          Processing
                        </>
                      ) : (
                        <>
                          <AlignLeft className="w-3 h-3" /> Analysis
                        </>
                      )}
                    </div>
                  )}
                </div>

                {msg.id === "1" ? (
                  // Welcome message - no card styling
                  <div className="text-foreground/90 leading-relaxed space-y-3">
                    {msg.content.split("\n\n").map((paragraph, idx) => (
                      <div
                        key={idx}
                        className={
                          idx === 0
                            ? "text-xl font-semibold text-foreground"
                            : "text-sm whitespace-pre-line"
                        }
                      >
                        {paragraph}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Regular AI message with card styling
                  <div className="bg-card border border-border/60 rounded-xl overflow-hidden w-full flex flex-col shadow-lg">
                    {msg.isLoading ? (
                      <div className="p-4 text-sm text-foreground/90 leading-relaxed border-b border-border/40 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        {msg.content}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-foreground/90 leading-relaxed border-b border-border/40 whitespace-pre-line">
                        {msg.content}
                      </div>
                    )}

                    {msg.actions &&
                      msg.actions.length > 0 &&
                      !msg.isLoading && (
                        <div className="p-4 bg-secondary/30 flex flex-col gap-2">
                          <span className="text-xs text-muted-foreground mb-1">
                            Suggested Actions:
                          </span>
                          {msg.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleActionClick(action)}
                              className="flex items-center justify-between px-4 py-2.5 bg-secondary hover:bg-secondary/80 border border-border/80 hover:border-primary/50 rounded-lg text-sm transition-all group text-left shadow-sm w-full"
                            >
                              <span className="text-primary/90 group-hover:text-primary font-medium">
                                {action.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/50">
        <form
          onSubmit={handleSend}
          className="relative flex items-center bg-card border border-border/50 rounded-xl"
        >
          <button
            type="button"
            disabled={isFetching}
            onClick={() => {
              if (!recognitionRef.current) {
                alert("Speech Recognition not supported in this browser");
                return;
              }

              if (listening) {
                recognitionRef.current.stop();
                setListening(false);
              } else {
                recognitionRef.current.start();
                setListening(true);
              }
            }}
            className="pl-4 pr-2 text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
          >
            <Mic
              className={`w-4 h-4 ${listening ? "text-red-500 animate-pulse" : ""}`}
            />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isFetching}
            placeholder="Ask AI anything (e.g., 'Find salt opportunities in Vietnam')..."
            className="w-full bg-transparent pl-2 pr-10 py-3.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isFetching}
            className="absolute right-2 p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-50 transition-colors"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}