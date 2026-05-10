import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, GripVertical, Save, X } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import { useGetFaqs, useCreateFaq, useDeleteFaq } from "@/querys/faqQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { IFaq } from "@/types/faq";
import Loader, { ButtonLoader } from "@/components/shared/Loader";
import { toast } from "react-hot-toast";

interface FaqEditorProps {
  active?: boolean;
}

export default function FaqEditor({ active = true }: FaqEditorProps) {
  const { data: faqData, isLoading } = useGetFaqs(active);
  const { mutateAsync: createFaqMutation, isPending: isSaving } = useCreateFaq();
  const { mutateAsync: deleteFaqMutation } = useDeleteFaq();
  const { confirm } = useConfirmation();

  const [items, setItems] = useState<IFaq[]>([]);

  useEffect(() => {
    if (faqData?.data) {
      setItems(faqData.data);
    }
  }, [faqData]);

  const update = (i: number, field: keyof IFaq, value: string) =>
    setItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));

  const handleAdd = () => setItems((prev) => [...prev, { question: "", answer: "" }]);

  const handleDelete = (id: string | undefined, index: number) => {
    if (!id) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    confirm({
      title: "Delete FAQ",
      message: "Are you sure you want to delete this question? This will be permanently removed.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteFaqMutation(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const save = async () => {
    try {
      // Save each modified or new FAQ
      // For simplicity, we create/update one by one or we could have a bulk API
      // Since the user provided create endpoint for one item, we'll save the currently modified one or handle all.
      // But usually, an FAQ editor saves the whole list.
      // Let's assume createFaq can handle the current list or we save each.
      
      // Filter out empty items
      const validItems = items.filter(item => item.question.trim() && item.answer.trim());
      
      for (const item of validItems) {
        await createFaqMutation(item);
      }
      
      toast.success("FAQs updated successfully!");
    } catch (error) {
      toast.error("Failed to save FAQs");
    }
  };

  if (isLoading && active) return <Loader text="Fetching FAQs..." />;

  return (
    <SectionCard title="FAQ Items" description="Frequently asked questions shown on the home page">
      <div className="space-y-4">
        {items.map((faq, i) => (
          <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50 group hover:border-green-100 transition-colors">
            <div className="flex-shrink-0 mt-2 text-gray-300">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question</Label>
                <Input 
                  value={faq.question} 
                  onChange={(e) => update(i, "question", e.target.value)} 
                  placeholder="e.g. What grades does Knowlix support?"
                  className="bg-white border-gray-100 focus:border-green-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Answer</Label>
                <Textarea 
                  value={faq.answer} 
                  onChange={(e) => update(i, "answer", e.target.value)} 
                  rows={3} 
                  placeholder="Provide a clear, helpful answer..."
                  className="bg-white border-gray-100 focus:border-green-400 resize-none"
                />
              </div>
            </div>
            <button 
              onClick={() => handleDelete(faq.id, i)} 
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 self-start mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
            <p className="text-sm text-gray-400 italic">No FAQs yet. Start by adding one below.</p>
          </div>
        )}

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50/30 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New FAQ
        </button>
      </div>
      
      <FormActions onSave={save} saving={isSaving} label="Save FAQs" />
    </SectionCard>
  );
}
