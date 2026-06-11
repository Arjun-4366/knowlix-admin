import { create } from "zustand";
import { IAssignedStudent, ITutorProfilePayload } from "@/types/tutor/profile";

interface TutorStore {
  profile: ITutorProfilePayload | null;
  /** Flat list of subject names from subjectEntries (or subjects fallback) */
  subjects: string[];
  /** Populated student objects assigned to this tutor */
  assignedStudents: IAssignedStudent[];

  setProfile: (profile: ITutorProfilePayload) => void;
  clearProfile: () => void;
}

export const useTutorStore = create<TutorStore>((set) => ({
  profile: null,
  subjects: [],
  assignedStudents: [],

  setProfile: (profile) => {
    // Derive subjects from subjectEntries if available, else subjects[]
    const subjects =
      profile.subjectEntries && profile.subjectEntries.length > 0
        ? profile.subjectEntries.map((e) => e.name)
        : profile.subjects || [];

    // Normalize assignedStudentIds — it may be string[] or IAssignedStudent[]
    const assignedStudents: IAssignedStudent[] = (
      profile.assignedStudentIds || []
    )
      .map((entry) => {
        if (typeof entry === "string") {
          // Plain ID — minimal object
          return { id: entry, studentName: entry, email: "", phone: "" } as IAssignedStudent;
        }
        return entry as IAssignedStudent;
      });

    set({ profile, subjects, assignedStudents });
  },

  clearProfile: () => set({ profile: null, subjects: [], assignedStudents: [] }),
}));
