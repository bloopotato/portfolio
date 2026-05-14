"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
};

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    submissions.forEach((submission) => {
      if (!respondedIds.has(submission.id)) {
        const timer = setTimeout(() => {
          setRespondedIds((prev) => new Set([...prev, submission.id]));
        }, 800);
        return () => clearTimeout(timer);
      }
    });
  }, [submissions, respondedIds]);

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name && email && message) {
      const newSubmission: Submission = {
        id: Date.now().toString(),
        name,
        email,
        message,
      };

      // optimistic UI update
      setSubmissions([...submissions, newSubmission]);

      // capture values to send after clearing inputs
      const payload = { name, email, message };

      setName("");
      setEmail("");
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.warn("Failed to send contact email", await res.text());
        }
      } catch (err) {
        console.error("Error sending contact email", err);
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-1">
      <header className="flex items-center gap-3 border-b-2 border-border-theme bg-surface-2 px-3 py-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-theme bg-surface-3 text-sm text-foreground"
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border-theme bg-surface-3 text-lg text-foreground">
            <FaRegSmile />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Yu Hui</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
            <div className="self-start rounded-2xl rounded-tl-sm border-2 border-border-theme bg-surface-3 px-4 py-3 text-sm text-foreground shadow-sm">
              Hello! Feel free to contact me here!
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1 rounded-2xl rounded-tr-sm ml-6 border-2 border-border-theme bg-surface-2 px-4 py-3 shadow-sm">
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                  Hello, I am
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="your name"
                  maxLength={50}
                  className="w-full bg-transparent border border-border-theme px-2 py-1 rounded-md text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1 rounded-2xl rounded-tr-sm ml-6 border-2 border-border-theme bg-surface-2 px-4 py-3 shadow-sm">
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                  This is my email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  maxLength={40}
                  className="w-full bg-transparent border border-border-theme px-2 py-1 rounded-md text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {submissions.map((submission) => (
              <div key={submission.id} className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm ml-6 border-2 border-border-theme bg-surface-3 px-4 py-3 text-sm text-foreground shadow-sm">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {submission.name} • {submission.email}
                    </p>
                    <p className="whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>

                {respondedIds.has(submission.id) && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm mr-6 border-2 border-border-theme bg-surface-3 px-4 py-3 text-sm text-foreground shadow-sm">
                      I&apos;ll get back to you soon! Thanks for reaching out.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-3 border-t-2 border-border-theme p-3">
          <div className="flex-1 rounded-2xl border-2 border-border-theme bg-surface-2 px-4 py-1 shadow-sm">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                handleTextareaInput();
              }}
              placeholder="Type your message here..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 max-h-40"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl border-2 border-border-theme bg-surface-3 p-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:translate-x-0.5"
          >
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
}
