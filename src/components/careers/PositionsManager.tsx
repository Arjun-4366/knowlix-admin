"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Pencil, X, MapPin, Briefcase } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import { useGetCareersAdmin, useCreateCareer, useUpdateCareer, useDeleteCareer } from "@/querys/admin/careerQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ICareer } from "@/types/admin/career";
import Loader from "@/components/shared/Loader";
import { toast } from "react-hot-toast";

export default function PositionsManager() {
  const { data: careerData, isLoading } = useGetCareersAdmin();
  const { mutateAsync: createCareerMutation } = useCreateCareer();
  const { mutateAsync: updateCareerMutation } = useUpdateCareer();
  const { mutateAsync: deleteCareerMutation } = useDeleteCareer();
  const { confirm } = useConfirmation();

  const [selectedPosition, setSelectedPosition] = useState<ICareer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <Loader text="Fetching Career Postings..." />;

  const careers = careerData?.careers || [];

  const openModal = (position: ICareer | null = null) => {
    setSelectedPosition(position || {
      title: "",
      department: "",
      location: "",
      type: "Full Time",
      description: "",
      requirements: "",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPosition(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedPosition) return;
    setIsSubmitting(true);
    try {
      if (selectedPosition.id) {
        await updateCareerMutation({ id: selectedPosition.id, data: selectedPosition });
      } else {
        await createCareerMutation(selectedPosition);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Career Posting",
      message: "Are you sure you want to remove this job opening? This will also affect any pending applications linked to this role.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteCareerMutation(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <SectionCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Job Directory ({careers.length})
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold rounded-xl hover:bg-[#15803d] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Position
        </button>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-y border-gray-100">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {careers.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-700">{p.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium mt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {p.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold uppercase tracking-tight">
                    {p.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {p.status ?? 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openModal(p)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                      title="Edit Details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => p.id && handleDelete(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                      title="Delete Posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {careers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                  No job postings found. Click "Add Position" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">
                {selectedPosition.id ? "Edit Position" : "Add New Position"}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Job Title</Label>
                  <Input
                    value={selectedPosition.title}
                    onChange={(e) => setSelectedPosition({ ...selectedPosition, title: e.target.value })}
                    placeholder="e.g. Flutter Developer"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Input
                    value={selectedPosition.department}
                    onChange={(e) => setSelectedPosition({ ...selectedPosition, department: e.target.value })}
                    placeholder="e.g. Mobile Development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    value={selectedPosition.location}
                    onChange={(e) => setSelectedPosition({ ...selectedPosition, location: e.target.value })}
                    placeholder="e.g. Bangalore, India (or Remote)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Input
                    value={selectedPosition.type}
                    onChange={(e) => setSelectedPosition({ ...selectedPosition, type: e.target.value })}
                    placeholder="e.g. Full Time"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Job Description</Label>
                <Textarea
                  value={selectedPosition.description}
                  onChange={(e) => setSelectedPosition({ ...selectedPosition, description: e.target.value })}
                  rows={4}
                  className="resize-none text-sm"
                  placeholder="Summarize the core responsibilities..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Key Requirements</Label>
                <Textarea
                  value={selectedPosition.requirements}
                  onChange={(e) => setSelectedPosition({ ...selectedPosition, requirements: e.target.value })}
                  rows={3}
                  className="resize-none text-sm"
                  placeholder="List qualifications, skills, and experience..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-700">Accepting Applications</p>
                  <p className="text-xs text-gray-500">Hide or show this posting on the website.</p>
                </div>
                <button
                  onClick={() => setSelectedPosition({ ...selectedPosition!, status: selectedPosition!.status === 'Active' ? 'Inactive' : 'Active' })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedPosition.status === 'Active' ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${selectedPosition.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
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
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Publish Posting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
