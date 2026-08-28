import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createNote, deleteNote, getNotes, getNotesFilters, updateNote } from "@/services/admin/notes/notes";
import { ICreateNotePayload, INotesQueryParams, IUpdateNotePayload } from "@/types/admin/notes";

const NOTES_KEY = ["notes"] as const;
const NOTES_FILTERS_KEY = ["notes-filters"] as const;

export const useGetNotesFilters = (params?: { subjectId?: string }) => {
  return useQuery({
    queryKey: [...NOTES_FILTERS_KEY, params?.subjectId ?? null],
    queryFn: () => getNotesFilters(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetNotes = (params?: INotesQueryParams) => {
  return useQuery({
    queryKey: [...NOTES_KEY, params],
    queryFn: () => getNotes(params),
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateNotePayload) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      toast.success("Note created successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to create note"),
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateNotePayload }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      toast.success("Note updated successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update note"),
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      toast.success("Note deleted successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete note"),
  });
};
