"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, FileText, Calendar, BookOpen, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  actions?: { label: string; actionKey: string; icon?: React.ElementType }[];
}

const PRESET_TOPICS = [
  { label: "Course Information", icon: BookOpen, prompt: "Tell me about my enrolled courses, duration, and curriculum." },
  { label: "Class Details", icon: Calendar, prompt: "When is my next class and what is the topic?" },
  { label: "Subject Support", icon: HelpCircle, prompt: "What subjects do I have support for and who are my tutors?" },
  { label: "Study Notes", icon: FileText, prompt: "Can you provide study notes for Grade 10 Mathematics?" },
  { label: "Question Papers", icon: Download, prompt: "Where can I find last year's Grade 10 Physics question papers?" },
];

export default function StudentChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "Hello! I am your Knowlix Study Assistant. How can I help you today? You can choose one of the quick topics below or type any question you have about your studies, schedules, or notes.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = prompt.toLowerCase();
        if (text.includes("course") || text.includes("curriculum")) {
          resolve("You are currently enrolled in **Grade 10 - Online Schooling Program**. Your curriculum focuses on **Mathematics** (Calculus, Trigonometry, Statistics) and **Physics** (Kinematics, Thermodynamics, Electromagnetism). You have active access to live rooms and digital homework submissions.");
        } else if (text.includes("class") || text.includes("schedule") || text.includes("next")) {
          resolve("Your next class is **Mathematics** (Topic: *Integration & Calculus Core*) with **Dr. Ramesh Prasad** scheduled for **Today at 4:00 PM**. You can join directly from your Schedule page or Dashboard.");
        } else if (text.includes("support") || text.includes("tutor")) {
          resolve("You have complete academic support for Mathematics and Physics mentored by **Dr. Ramesh Prasad**. Chemistry support is overseen by **Vikram Malhotra**, and Computer Science support is guided by **David Miller**.");
        } else if (text.includes("notes") || text.includes("study")) {
          resolve("I have generated study guides for your upcoming exams. Click below to download: \n\n1. **Trigonometry Core Formula Cheat Sheet** (PDF) \n2. **Kinematics & Gravity Lab Summaries** (PDF)\n\nLet me know if you need guides for other subjects!");
        } else if (text.includes("paper") || text.includes("question")) {
          resolve("Here are the previous year final and midterm papers for Grade 10:\n\n- **Grade 10 Mathematics Term Exam (2025)**\n- **Grade 10 Physics Annual Paper (2025)**\n\nYou can click on them in the panel to download and solve them for practice!");
        } else if (text.includes("doubt") || text.includes("clarification") || text.includes("help")) {
          resolve("Of course! Please type in the specific academic doubt you have (e.g., 'What is Newton's Second Law?' or 'How do I integrate x^2?') and I will clarify it step-by-step.");
        } else if (text.includes("newton")) {
          resolve("Newton's Second Law states that acceleration of an object is dependent upon two variables: the net force acting upon the object and the mass of the object (**F = ma**). This means that force is equal to mass multiplied by acceleration.");
        } else if (text.includes("integrate")) {
          resolve("To integrate $x^n$ with respect to $x$, use the power rule for integration: $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ (where $n \\neq -1$). For example, $\\int x^2 dx = \\frac{x^3}{3} + C$.");
        } else {
          resolve("I've logged your doubt. Let me summarize this for you: For Grade 10 Math and Physics support, you can submit this doubt directly to Dr. Ramesh Prasad during the upcoming mentor check-in, or ask me another specific academic question!");
        }
      }, 1000);
    });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const botText = await getBotResponse(textToSend);
    
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: botText,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="space-y-6 w-full pb-10 flex flex-col h-[calc(100vh-100px)]">
      <DashboardHeader
        title="AI Chatbot Assistant"
        description="Interact with our intelligent study bot to get study notes, past papers, schedule details, and immediate doubt clarification."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Column: Preset topics panel */}
        <div className="space-y-4 lg:col-span-1 flex flex-col">
          <Card className="bg-white border-slate-150 shadow-sm flex-1 flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Assistant Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-2">
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-2">
                Click a topic to ask:
              </p>
              {PRESET_TOPICS.map((topic, i) => {
                const Icon = topic.icon;
                return (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => handleSend(topic.prompt)}
                    className="w-full justify-start text-left text-xs font-semibold h-11 border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 cursor-pointer flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-[var(--brand-green)] flex-shrink-0" />
                    <span className="truncate">{topic.label}</span>
                  </Button>
                );
              })}

              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  Doubt Solved Examples
                </p>
                <button
                  onClick={() => handleSend("Explain Newton's Second Law.")}
                  className="w-full text-left text-[10px] text-slate-600 hover:text-[var(--brand-green)] font-semibold p-2 bg-slate-50 border border-slate-100 hover:border-[var(--brand-green)]/30 rounded-lg cursor-pointer transition-colors block"
                >
                  "Explain Newton's Second Law."
                </button>
                <button
                  onClick={() => handleSend("How do I integrate x^2?")}
                  className="w-full text-left text-[10px] text-slate-600 hover:text-[var(--brand-green)] font-semibold p-2 bg-slate-50 border border-slate-100 hover:border-[var(--brand-green)]/30 rounded-lg cursor-pointer transition-colors block"
                >
                  "How do I integrate x^2?"
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active chat container */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="bg-white border-slate-150 shadow-sm flex-1 flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center border border-[var(--brand-light)]/20">
                  <Bot className="w-5 h-5 text-[var(--brand-green)] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Knowlix Study AI</h3>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" /> Online & Ready
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setMessages([
                    {
                      id: "init-1",
                      sender: "bot",
                      text: "Hello! I am your Knowlix Study Assistant. How can I help you today? You can choose one of the quick topics below or type any question you have about your studies, schedules, or notes.",
                      timestamp: new Date()
                    }
                  ]);
                }}
                title="Reset Chat"
                className="rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-50/30">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold ${
                        isBot ? "bg-[var(--brand-green)]" : "bg-[var(--brand-dark)]"
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line border shadow-sm ${
                          isBot
                            ? "bg-white border-slate-150 text-slate-750 rounded-tl-sm"
                            : "bg-[var(--brand-mid)] border-[var(--brand-mid)] text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.text}

                        {/* Special download buttons mock */}
                        {isBot && msg.text.includes("Formula Cheat Sheet") && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              onClick={() => toast.success("Downloading: Trigonometry_Formula_Sheet.pdf")}
                              className="h-8 text-[10px] px-3 font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-lg flex items-center gap-1 shadow-none"
                            >
                              <Download className="w-3.5 h-3.5" /> Trig Formulas.pdf
                            </Button>
                            <Button
                              onClick={() => toast.success("Downloading: Kinematics_Summary.pdf")}
                              className="h-8 text-[10px] px-3 font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-lg flex items-center gap-1 shadow-none"
                            >
                              <Download className="w-3.5 h-3.5" /> Kinematics.pdf
                            </Button>
                          </div>
                        )}

                        {isBot && msg.text.includes("Term Exam (2025)") && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              onClick={() => toast.success("Downloading: Maths_Term_Exam_2025.pdf")}
                              className="h-8 text-[10px] px-3 font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-lg flex items-center gap-1 shadow-none"
                            >
                              <Download className="w-3.5 h-3.5" /> Maths 2025 Paper.pdf
                            </Button>
                            <Button
                              onClick={() => toast.success("Downloading: Physics_Annual_Exam_2025.pdf")}
                              className="h-8 text-[10px] px-3 font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-lg flex items-center gap-1 shadow-none"
                            >
                              <Download className="w-3.5 h-3.5" /> Physics 2025 Paper.pdf
                            </Button>
                          </div>
                        )}
                      </div>
                      <span className={`text-[8px] text-slate-400 block px-1 ${!isBot && "text-right"}`}>
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-2.5 mr-auto">
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-150 rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-150 bg-white flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a doubt or type your question..."
                  className="flex-1 h-10 border border-slate-200 rounded-xl text-xs bg-slate-50 focus-visible:bg-white"
                />
                <Button
                  type="submit"
                  className="h-10 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-xl px-4 cursor-pointer transition-all flex items-center justify-center shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
