export type NoteAttachmentType = "document" | "pdf" | "image";
export type NoteStatus = "published" | "draft";

export interface INote {
  id: string;
  standard: string;
  syllabus: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  content: string;
  attachmentType: NoteAttachmentType;
  fileUrl: string;
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
  standard: string;
  syllabus: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  content: string;
  file: File;
  tags: string[];
  status: NoteStatus;
}

export interface IUpdateNotePayload {
  standard?: string;
  syllabus?: string;
  subject?: string;
  chapter?: string;
  title?: string;
  description?: string;
  content?: string;
  file?: File;
  tags?: string[];
  status?: NoteStatus;
}

export interface INotesQueryParams {
  search?: string;
  standard?: string;
  syllabus?: string;
  subject?: string;
  chapter?: string;
  status?: string;
  attachmentType?: string;
  page?: number;
  limit?: number;
}

export interface INotesFilters {
  chapters: string[];
  standards: string[];
  subjects: string[];
  syllabuses: string[];
}

export interface INotesFiltersResponse {
  data: INotesFilters;
  status: string;
}
