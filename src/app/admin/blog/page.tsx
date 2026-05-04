"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import BlogList from "@/components/blog/BlogList";
import BlogForm from "@/components/blog/BlogForm";

export default function BlogPageAdmin() {
  const [view, setView] = useState<"list" | "new">("list");

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Blog"
        description="Manage blog posts"
        action={
          view === "list" ? undefined : undefined
        }
      />
      {view === "list" ? (
        <BlogList onNew={() => setView("new")} />
      ) : (
        <BlogForm onBack={() => setView("list")} />
      )}
    </div>
  );
}
