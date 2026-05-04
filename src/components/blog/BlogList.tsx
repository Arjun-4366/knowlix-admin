"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
};

const initial: Post[] = [
  { id: 1, title: "How to Build a Productive Study Routine for Your Child at Home", category: "Parenting Tips", date: "2026-04-20", readTime: "5 min", featured: true, published: true },
  { id: 2, title: "The Spaced Repetition Method — Why Your Child Forgets and How to Fix It", category: "Study Techniques", date: "2026-04-15", readTime: "7 min", featured: false, published: true },
  { id: 3, title: "5 Surprising Benefits of Online Schooling You Didn't Know About", category: "Online Learning", date: "2026-04-10", readTime: "6 min", featured: false, published: true },
  { id: 4, title: "CBSE Board Exam Preparation — A Month-by-Month Strategy Guide", category: "Exam Strategies", date: "2026-04-05", readTime: "9 min", featured: true, published: true },
  { id: 5, title: "How to Talk to Your Child About Exam Pressure Without Making It Worse", category: "Parenting Tips", date: "2026-03-28", readTime: "5 min", featured: false, published: true },
  { id: 6, title: "Why Active Recall Beats Re-Reading (And How to Use It)", category: "Study Techniques", date: "2026-03-20", readTime: "6 min", featured: false, published: false },
  { id: 7, title: "Top 7 Signs Your Child Needs Extra Academic Support", category: "Parenting Tips", date: "2026-03-15", readTime: "4 min", featured: false, published: false },
  { id: 8, title: "How Online Tuition is Closing the Learning Gap in Rural India", category: "Online Learning", date: "2026-03-10", readTime: "8 min", featured: false, published: true },
];

const categories = ["All", "Parenting Tips", "Study Techniques", "Online Learning", "Exam Strategies"];

interface Props {
  onNew: () => void;
}

export default function BlogList({ onNew }: Props) {
  const [posts, setPosts] = useState<Post[]>(initial);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const togglePublished = (id: number) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));

  const toggleFeatured = (id: number) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));

  const remove = (id: number) => setPosts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…" className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ background: "var(--brand-green)" }}
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Read</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {post.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                    <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{post.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{post.date}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{post.readTime}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublished(post.id)}
                    className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors"
                    style={post.published
                      ? { background: "#dcfce7", color: "#15803d" }
                      : { background: "#f3f4f6", color: "#9ca3af" }}
                  >
                    {post.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => toggleFeatured(post.id)}
                      title="Toggle featured"
                      className="text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${post.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </button>
                    <button onClick={onNew} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(post.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No posts found</p>
        )}
      </div>
    </div>
  );
}
