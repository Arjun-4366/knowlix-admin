"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import BlogList from "@/components/blog/BlogList";
import BlogForm from "@/components/blog/BlogForm";
import { useGetBlogs } from "@/querys/blogQuery";
import Loader from "@/components/shared/Loader";
import { IBlog } from "@/types/blog";

export default function BlogPageAdmin() {
  const { data: blogData, isLoading } = useGetBlogs();
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedPost, setSelectedPost] = useState<IBlog | null>(null);

  if (isLoading) return <Loader text="Fetching Blog Posts..." />;

  const groupedBlogs = blogData?.data || {};
  
  const handleNew = (post: IBlog | null = null) => {
    setSelectedPost(post);
    setView("form");
  };

  const handleBack = () => {
    setSelectedPost(null);
    setView("list");
  };

  return (
    <div className="max-w-6xl">
      <PageHeader 
        title="Blog & Resources" 
        description="Manage company news, workshops, trainings, and collaboration announcements" 
      />

      {view === "list" ? (
        <BlogList 
          onNew={handleNew} 
          groupedBlogs={groupedBlogs as any} 
        />
      ) : (
        <BlogForm 
          onBack={handleBack} 
          initialData={selectedPost} 
        />
      )}
    </div>
  );
}
