"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IBlog, BlogCategory } from "@/types/admin/blog";
import { useDeleteBlog } from "@/querys/admin/blogQuery";
import { useConfirmation } from "@/context/ConfirmationContext";

import Image from "next/image";

const categories: string[] = ["All", "Collaborations", "Talks", "Trainings", "Workshops", "Partnerships", "Uncategorized"];

interface Props {
  onNew: (post?: IBlog) => void;
  groupedBlogs: Record<string, IBlog[]>;
}

export default function BlogList({ onNew, groupedBlogs }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const { mutateAsync: deleteBlogMutation } = useDeleteBlog();
  const { confirm } = useConfirmation();

  const allPosts = Object.values(groupedBlogs || {}).flat();

  const filtered = allPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());

    let matchCat = true;
    if (category !== "All") {
      if (category === "Uncategorized") {
        matchCat = p.category === "" || !p.category;
      } else {
        matchCat = p.category === category;
      }
    }

    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this post? This will permanently remove the article from the platform.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteBlogMutation(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-9 h-11 rounded-xl border-gray-100 bg-white focus:ring-green-500"
          />
        </div>
        <Select value={category} onValueChange={(v: any) => setCategory(v)}>
          <SelectTrigger className="w-full sm:w-56 h-11 py-5 rounded-xl border-gray-100 bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <button
          onClick={() => onNew()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap"
          style={{ background: "var(--brand-green)" }}
        >
          <Plus className="w-5 h-5" /> New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <div key={post.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-green-100 hover:shadow-xl hover:shadow-green-500/5 transition-all flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              {typeof post.image === "string" && post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <span className="text-sm italic">No Cover Image</span>
                </div>
              )}
              {post.isFeatured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-amber-400 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-white" /> Featured
                </div>
              )}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
                {post.category || "Uncategorized"}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-800 leading-tight mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                {post.title}
              </h3>

              <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-green-500" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-green-500" /> {post.readTime}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <button
                  onClick={() => onNew(post)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id!)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-medium italic">No blog posts match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
