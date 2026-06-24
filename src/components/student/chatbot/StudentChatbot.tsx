"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  RefreshCw,
  FileText,
  BookOpen,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  useGetStudentNoteSubjects,
  useGetStudentNoteChapters,
  useGetStudentNotes,
} from "@/querys/student/studentQuery";
import type { IStudentNote } from "@/services/student/student";

type Step = "subject" | "chapter" | "results";

interface TextMessage {
  id: string;
  kind: "text";
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface NotesMessage {
  id: string;
  kind: "notes";
  sender: "bot";
  notes: IStudentNote[];
  subject: string;
  chapter: string;
  timestamp: Date;
}

type Message = TextMessage | NotesMessage;

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mr-auto">
      <div className="w-7 h-7 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="p-3.5 rounded-2xl bg-white border border-slate-150 rounded-tl-sm shadow-sm flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

const TYPE_CONFIG = {
  pdf: {
    label: "PDF",
    bg: "bg-red-50 text-red-600 border-red-100",
    btnBg: "bg-red-500 hover:bg-red-600",
    actionLabel: "Open PDF",
  },
  image: {
    label: "Image",
    bg: "bg-purple-50 text-purple-600 border-purple-100",
    btnBg: "bg-purple-500 hover:bg-purple-600",
    actionLabel: "View Image",
  },
  document: {
    label: "Document",
    bg: "bg-blue-50 text-blue-600 border-blue-100",
    btnBg: "bg-[var(--brand-green)] hover:bg-[var(--brand-mid)]",
    actionLabel: "View Document",
  },
} as const;

function NoteCard({ note }: { note: IStudentNote }) {
  const cfg = TYPE_CONFIG[note.attachmentType] ?? TYPE_CONFIG.document;

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="rounded-xl border border-slate-150 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--brand-green)]/30 transition-all">
      {/* Header strip */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-3.5 h-3.5 text-[var(--brand-green)] flex-shrink-0" />
          <p className="text-xs font-bold text-slate-800 truncate">{note.title}</p>
        </div>
        <span className={`flex-shrink-0 ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${cfg.bg}`}>
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3.5 py-2.5 space-y-2.5">
        {/* Description */}
        {note.description && (
          <p className="text-[11px] text-slate-600 leading-relaxed">{note.description}</p>
        )}

        {/* Meta row: standard + syllabus + date */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
            Class {note.standard}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
            {note.syllabus}
          </span>
          {formattedDate && (
            <span className="text-[10px] text-slate-400 ml-auto">{formattedDate}</span>
          )}
        </div>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* File action */}
        {note.fileUrl && (
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-[10px] font-bold text-white transition-colors ${cfg.btnBg}`}
          >
            <ExternalLink className="w-3 h-3" />
            {cfg.actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export default function StudentChatbot() {
  const [step, setStep] = useState<Step>("subject");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      kind: "text",
      sender: "bot",
      text: "Hi! I'm your Knowlix Study Assistant. Which subject would you like to explore notes for?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messageAreaRef = useRef<HTMLDivElement>(null);

  const { data: subjectsData, isLoading: subjectsLoading } = useGetStudentNoteSubjects();
  const subjects = subjectsData?.data ?? [];

  const { data: chaptersData, isLoading: chaptersLoading } = useGetStudentNoteChapters(
    selectedSubject ?? ""
  );
  const chapters = chaptersData?.data ?? [];

  const { data: notesData, isLoading: notesLoading } = useGetStudentNotes(
    selectedSubject ?? "",
    selectedChapter ?? ""
  );

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTo({ top: messageAreaRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    document.body.classList.add("chatbot-open");
    return () => document.body.classList.remove("chatbot-open");
  }, []);

  // When chapters load after subject selection, add bot chapter prompt
  useEffect(() => {
    if (!selectedSubject || chaptersLoading || step !== "chapter") return;

    setIsTyping(false);

    if (chapters.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-no-chapters-${Date.now()}`,
          kind: "text",
          sender: "bot",
          text: `Hmm, no chapters found for ${selectedSubject} yet. Try a different subject.`,
          timestamp: new Date(),
        } as TextMessage,
      ]);
      setStep("subject");
      setSelectedSubject(null);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-chapters-${Date.now()}`,
        kind: "text",
        sender: "bot",
        text: `Great choice! Here are the chapters available for ${selectedSubject}. Which one would you like to explore?`,
        timestamp: new Date(),
      } as TextMessage,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersLoading]);

  // When notes load after chapter selection, add bot notes message
  useEffect(() => {
    if (!selectedSubject || !selectedChapter || notesLoading || step !== "results") return;

    setIsTyping(false);
    const notes = notesData?.data ?? [];

    if (notes.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-no-notes-${Date.now()}`,
          kind: "text",
          sender: "bot",
          text: `No notes found for ${selectedSubject} — ${selectedChapter} yet. Try another chapter or subject!`,
          timestamp: new Date(),
        } as TextMessage,
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-notes-${Date.now()}`,
          kind: "notes",
          sender: "bot",
          notes,
          subject: selectedSubject,
          chapter: selectedChapter,
          timestamp: new Date(),
        } as NotesMessage,
        {
          id: `bot-notes-footer-${Date.now()}`,
          kind: "text",
          sender: "bot",
          text: `Found ${notes.length} note${notes.length !== 1 ? "s" : ""} for ${selectedSubject} — ${selectedChapter}. Would you like to explore another chapter or start over?`,
          timestamp: new Date(),
        } as TextMessage,
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesLoading]);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setStep("chapter");
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-subject-${Date.now()}`,
        kind: "text",
        sender: "user",
        text: subject,
        timestamp: new Date(),
      } as TextMessage,
    ]);
  };

  const handleSelectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    setStep("results");
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-chapter-${Date.now()}`,
        kind: "text",
        sender: "user",
        text: chapter,
        timestamp: new Date(),
      } as TextMessage,
    ]);
  };

  const handleAnotherChapter = () => {
    setSelectedChapter(null);
    setStep("chapter");
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-another-chapter-${Date.now()}`,
        kind: "text",
        sender: "bot",
        text: `Sure! Which chapter in ${selectedSubject} would you like to explore next?`,
        timestamp: new Date(),
      } as TextMessage,
    ]);
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setStep("subject");
    setIsTyping(false);
    setMessages([
      {
        id: `init-reset-${Date.now()}`,
        kind: "text",
        sender: "bot",
        text: "Sure! Which subject would you like to explore notes for?",
        timestamp: new Date(),
      },
    ]);
  };

  const isChipDisabled = chaptersLoading || notesLoading || isTyping;

  return (
    <div className="space-y-6 w-full flex flex-col h-full pb-1">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left: context panel */}
        <div className="space-y-4 lg:col-span-1 flex flex-col min-h-0 h-full">
          <Card className="bg-white border-slate-150 shadow-sm flex-1 flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Notes Finder
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
              {/* Current selection */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current Selection
                </p>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 w-14">Subject</span>
                    <span className="text-xs font-bold text-slate-700 flex-1 truncate">
                      {selectedSubject ?? <span className="text-slate-300 font-normal">—</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 w-14">Chapter</span>
                    <span className="text-xs font-bold text-slate-700 flex-1 truncate">
                      {selectedChapter ?? <span className="text-slate-300 font-normal">—</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress steps */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Steps
                </p>
                {(["subject", "chapter", "results"] as Step[]).map((s, i) => {
                  const labels = ["Choose Subject", "Choose Chapter", "View Notes"];
                  const isActive = step === s;
                  const isDone =
                    (s === "subject" && selectedSubject !== null) ||
                    (s === "chapter" && selectedChapter !== null);
                  return (
                    <div
                      key={s}
                      className={`flex items-center gap-2 text-xs rounded-lg px-2.5 py-2 ${
                        isActive
                          ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] font-bold"
                          : isDone
                            ? "text-slate-400"
                            : "text-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isDone
                            ? "bg-[var(--brand-green)] text-white"
                            : isActive
                              ? "bg-[var(--brand-mid)] text-white"
                              : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {labels[i]}
                    </div>
                  );
                })}
              </div>

              {/* Reset button */}
              {(selectedSubject || selectedChapter) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-9 text-xs font-semibold border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Start Over
                </Button>
              )}

              {/* Tip */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-600">Tip:</span> Select a subject, then a
                  chapter to browse all available study notes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: chat area */}
        <div className="lg:col-span-3 flex flex-col h-full min-h-0">
          <Card className="bg-white border-slate-150 shadow-sm flex-1 flex flex-col overflow-hidden h-full">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center border border-[var(--brand-light)]/20">
                  <Bot className="w-5 h-5 text-[var(--brand-green)]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Knowlix Notes Assistant</h3>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                    Online & Ready
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleReset}
                title="Reset Chat"
                className="rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={messageAreaRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-50/30"
            >
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";

                if (msg.kind === "notes") {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5 mr-auto max-w-[90%]">
                      <div className="w-7 h-7 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0 text-white">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-mid)]">
                            {msg.subject} — {msg.chapter}
                          </span>
                        </div>
                        {msg.notes.map((note) => (
                          <NoteCard key={note.id} note={note} />
                        ))}
                        <span className="text-[8px] text-slate-400 block px-1">
                          {msg.timestamp.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[80%] ${
                      isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                        isBot ? "bg-[var(--brand-green)]" : "bg-[var(--brand-dark)]"
                      }`}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed border shadow-sm ${
                          isBot
                            ? "bg-white border-slate-150 text-slate-750 rounded-tl-sm"
                            : "bg-[var(--brand-mid)] border-[var(--brand-mid)] text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={`text-[8px] text-slate-400 block px-1 ${!isBot && "text-right"}`}
                      >
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && <TypingIndicator />}
            </div>

            {/* Bottom action bar — replaces text input */}
            <div className="p-4 border-t border-slate-150 bg-white flex-shrink-0">
              {step === "subject" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select a subject
                  </p>
                  {subjectsLoading ? (
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 w-24 rounded-full bg-slate-100 animate-pulse" />
                      ))}
                    </div>
                  ) : subjects.length === 0 ? (
                    <p className="text-xs text-slate-400">No subjects available.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => handleSelectSubject(subject)}
                          disabled={isChipDisabled}
                          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[var(--brand-green)]/40 bg-[var(--brand-light-green)] text-xs font-semibold text-[var(--brand-mid)] hover:bg-[var(--brand-green)] hover:text-white hover:border-[var(--brand-green)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {subject}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "chapter" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select a chapter in {selectedSubject}
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-[10px] font-semibold text-slate-400 hover:text-[var(--brand-green)] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Change subject
                    </button>
                  </div>
                  {chaptersLoading ? (
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 w-28 rounded-full bg-slate-100 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter}
                          onClick={() => handleSelectChapter(chapter)}
                          disabled={isChipDisabled}
                          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-[var(--brand-green)] hover:text-white hover:border-[var(--brand-green)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {chapter}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "results" && (
                <div className="flex items-center gap-3">
                  {notesLoading ? (
                    <p className="text-xs text-slate-400 animate-pulse">Loading notes…</p>
                  ) : (
                    <>
                      <button
                        onClick={handleAnotherChapter}
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        Another chapter in {selectedSubject}
                      </button>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[var(--brand-green)]/40 bg-[var(--brand-light-green)] text-xs font-semibold text-[var(--brand-mid)] hover:bg-[var(--brand-green)] hover:text-white transition-all"
                      >
                        <RotateCcw className="w-3 h-3" /> New subject
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
