"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Users, X, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionCard from "@/components/shared/SectionCard";
import MediaUpload from "@/components/shared/MediaUpload";
import { IProgram, ProgramType } from "@/types/program";
import { useGetPrograms, useCreateProgram, useUpdateProgram, useDeleteProgram } from "@/querys/programQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import Loader from "@/components/shared/Loader";
import Image from "next/image";

export default function ProgramsManager() {
  const { data: programData, isLoading, isError, error } = useGetPrograms();
  const { mutateAsync: createProgramMutation } = useCreateProgram();
  const { mutateAsync: updateProgramMutation } = useUpdateProgram();
  const { mutateAsync: deleteProgramMutation } = useDeleteProgram();
  const { confirm } = useConfirmation();

  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <Loader text="Fetching Programs..." />;
  
  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl">
        <p className="text-red-600 font-semibold">Failed to load programs</p>
        <p className="text-xs text-red-400 mt-1">{(error as any)?.message || "Unknown error"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const programs = Array.isArray(programData?.programs) ? programData.programs : [];

  const openModal = (program: IProgram | null = null) => {
    setSelectedProgram(
      program
        ? {
            ...program,
            rating: Number.isFinite(program.rating) ? program.rating : 5,
            studentsEnrolled: Number.isFinite(program.studentsEnrolled) ? program.studentsEnrolled : 0,
            features: (() => {
              if (Array.isArray(program.features)) return program.features;
              if (typeof program.features === "string") {
                try { const p = JSON.parse(program.features); return Array.isArray(p) ? p : []; } catch { return []; }
              }
              return [];
            })(),
          }
        : {
            type: "online",
            image: "",
            tag: "",
            rating: 5,
            studentsEnrolled: 0,
            title: "",
            grade: "",
            description: "",
            features: [],
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedProgram) return;
    setIsSubmitting(true);
    try {
      if (selectedProgram.id) {
        await updateProgramMutation({ id: selectedProgram.id, data: selectedProgram });
      } else {
        await createProgramMutation(selectedProgram);
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
      title: "Delete Program",
      message: "Are you sure you want to delete this program? This will remove it from the website.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteProgramMutation(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const updateFeature = (index: number, value: string) => {
    if (!selectedProgram) return;
    const newFeatures = [...selectedProgram.features];
    newFeatures[index] = value;
    setSelectedProgram({ ...selectedProgram, features: newFeatures });
  };

  const addFeature = () => {
    if (!selectedProgram) return;
    setSelectedProgram({
      ...selectedProgram,
      features: [...selectedProgram?.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    if (!selectedProgram) return;
    setSelectedProgram({
      ...selectedProgram,
      features: selectedProgram.features.filter((_, i) => i !== index),
    });
  };

  return (
    <SectionCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Learning Programs ({programs.length})
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold rounded-xl hover:bg-[#15803d] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => (
          <ProgramCard
            key={p.id}
            program={p}
            onEdit={() => openModal(p)}
            onDelete={() => p.id && handleDelete(p.id)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">
                {selectedProgram.id ? "Edit Program" : "Add New Program"}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Program Type</Label>
                  <Select 
                    value={selectedProgram.type} 
                    onValueChange={(v: ProgramType) => setSelectedProgram({ ...selectedProgram, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online School</SelectItem>
                      <SelectItem value="tuition">Online Tuition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tag (e.g. Popular)</Label>
                  <Input 
                    value={selectedProgram.tag} 
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, tag: e.target.value })} 
                    placeholder="Badge text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input 
                    value={selectedProgram.title} 
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, title: e.target.value })} 
                    placeholder="Program Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Grade / Level</Label>
                  <Input 
                    value={selectedProgram.grade} 
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, grade: e.target.value })} 
                    placeholder="e.g. Grade 1 - 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Rating (0.0 - 5.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={Number.isFinite(selectedProgram.rating) ? selectedProgram.rating : ""}
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Students Enrolled</Label>
                  <Input
                    type="number"
                    value={Number.isFinite(selectedProgram.studentsEnrolled) ? selectedProgram.studentsEnrolled : ""}
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, studentsEnrolled: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea 
                  value={selectedProgram.description} 
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, description: e.target.value })} 
                  rows={3}
                  className="resize-none"
                  placeholder="Program overview..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Program Image</Label>
                <MediaUpload 
                  value={selectedProgram.image}
                  onChange={(val) => setSelectedProgram({ ...selectedProgram, image: val })}
                  ratio="video"
                  accept="image/*"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Key Features</Label>
                  <button 
                    onClick={addFeature}
                    className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:text-green-700 uppercase tracking-widest"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedProgram?.features?.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input 
                        value={feature} 
                        onChange={(e) => updateFeature(idx, e.target.value)} 
                        placeholder={`Feature ${idx + 1}`}
                        className="h-10 text-sm"
                      />
                      <button 
                        onClick={() => removeFeature(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {selectedProgram?.features?.length === 0 && (
                    <p className="text-xs text-gray-400 italic py-2 text-center border border-dashed border-gray-100 rounded-xl">No features added yet.</p>
                  )}
                </div>
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
                {isSubmitting ? "Saving..." : "Save Program"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function ProgramCard({
  program: p,
  onEdit,
  onDelete,
}: {
  program: IProgram & { id?: string };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = typeof p.image === "string" && p.image && !imgError;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-green-100 hover:shadow-xl hover:shadow-green-500/5 transition-all flex flex-col">
      <div className="aspect-video relative bg-gray-100">
        {hasImage ? (
          <Image
            src={p.image as string}
            alt={p.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs">
            No Cover Image
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
          {p.type}
        </div>
        {p.tag && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-amber-400 text-white text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
            {p.tag}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.grade}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
            <Star className="w-3 h-3 fill-current" /> {p.rating}
          </div>
        </div>
        <h4 className="font-bold text-gray-800 leading-tight mb-3 group-hover:text-green-700 transition-colors">
          {p.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-green-500" /> {p.studentsEnrolled} Students
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
