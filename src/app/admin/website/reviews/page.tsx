"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Star, Eye, X } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import {
  useGetReviews,
  useCreateReview,
  useDeleteReview,
} from "@/querys/admin/reviewQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { IReview } from "@/types/admin/review";
import { toast } from "react-hot-toast";

import Loader from "@/components/shared/Loader";

export default function ReviewsPage() {
  const { data: reviewData, isLoading } = useGetReviews();
  const { mutateAsync: createReview, isPending: isCreating } =
    useCreateReview();
  const { mutateAsync: deleteReviewMutation } = useDeleteReview();
  const { confirm } = useConfirmation();

  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviews = reviewData?.reviews || [];

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Review",
      message:
        "Are you sure you want to delete this review? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteReviewMutation(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const openModal = (review: IReview | null = null) => {
    setSelectedReview(
      review || {
        rating: 5,
        ratingText: "",
        name: "",
        city: "",
        grade: "",
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data: IReview) => {
    try {
      await createReview(data);
      toast.success(data.id ? "Review updated" : "Review created");
      closeModal();
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  if (isLoading) return <Loader text="Fetching Reviews..." />;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Review Management"
        description="Manage parent and student testimonials displayed across the platform"
      />

      <SectionCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            All Reviews ({reviews.length})
          </h3>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#16a34a] text-white text-xs font-semibold rounded-lg hover:bg-[#15803d] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">
                  Review Text
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.grade}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p className="line-clamp-1 max-w-xs">{r.ratingText}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openModal(r)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                        title="Edit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => r.id && handleDelete(r.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400 italic"
                  >
                    No reviews found. Click "Add Review" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Modal Backdrop */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">
                {selectedReview.id ? "Edit Review" : "Add New Review"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Reviewer Name</Label>
                  <Input
                    value={selectedReview.name}
                    onChange={(e) =>
                      setSelectedReview({
                        ...selectedReview,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Rahul Kumar"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating</Label>
                  <div className="flex gap-1 py-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`w-6 h-6 cursor-pointer transition-colors ${s < selectedReview.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-200"}`}
                        onClick={() =>
                          setSelectedReview({
                            ...selectedReview,
                            rating: s + 1,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={selectedReview.city}
                    onChange={(e) =>
                      setSelectedReview({
                        ...selectedReview,
                        city: e.target.value,
                      })
                    }
                    placeholder="e.g. Kochi"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Grade/Class</Label>
                  <Input
                    value={selectedReview.grade}
                    onChange={(e) =>
                      setSelectedReview({
                        ...selectedReview,
                        grade: e.target.value,
                      })
                    }
                    placeholder="e.g. Grade 10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Review Content</Label>
                <Textarea
                  value={selectedReview.ratingText}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      ratingText: e.target.value,
                    })
                  }
                  rows={5}
                  className="resize-none"
                  placeholder="Paste the full review here..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(selectedReview)}
                disabled={isCreating}
                className="px-6 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors shadow-sm disabled:opacity-50"
              >
                {isCreating ? "Saving..." : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
