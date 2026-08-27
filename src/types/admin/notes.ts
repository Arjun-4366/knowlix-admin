export type NoteAttachmentType = "document" | "pdf" | "image";
export type NoteStatus = "published" | "draft";

export interface INote {
  id: string;
  standard: string;
  standardId?: string;
  syllabus: string;
  syllabusId?: string;
  subject: string;
  subjectId?: string;
  chapter: string;
  title: string;
  description: string;
  content: string;
  attachmentType: NoteAttachmentType;
  fileUrls: string[];
  tags: string[];
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface INotesResponse {
  data: INote[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  status: string;
}

export interface ICreateNotePayload {
  standardId: string;
  syllabusId: string;
  subjectId: string;
  chapter: string;
  title: string;
  description: string;
  content: string;
  files: File[];
  tags: string[];
  status: NoteStatus;
}

export interface IUpdateNotePayload {
  standardId?: string;
  syllabusId?: string;
  subjectId?: string;
  chapter?: string;
  title?: string;
  description?: string;
  content?: string;
  files?: File[];
  tags?: string[];
  status?: NoteStatus;
}

export interface INotesQueryParams {
  search?: string;
  standardId?: string;
  syllabusId?: string;
  subjectId?: string;
  chapter?: string;
  status?: string;
  attachmentType?: string;
  page?: number;
  limit?: number;
}

export interface INotesFilterItem {
  id: string;
  name: string;
}

export interface INotesFilters {
  chapters: string[];
  standards: INotesFilterItem[];
  subjects: INotesFilterItem[];
  syllabuses: INotesFilterItem[];
}

export interface INotesFiltersResponse {
  data: INotesFilters;
  status: string;
}
