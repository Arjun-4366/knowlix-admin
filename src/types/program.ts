export type ProgramType = "online" | "tuition";

export interface IProgram {
  id?: string;
  type: ProgramType;
  image: string | File;
  tag: string;
  rating: number;
  studentsEnrolled: number;
  title: string;
  grade: string;
  description: string;
  features: string[];
  courseIds?: string[] | null;
}

export interface ICourse {
  id?: string;
  programId: string;
  title: string;
  description: string;
  grade: string;
  totalStudentsEnrolled: string;
  image: string | File;
}

export interface IProgramResponse {
  status: string;
  programs: IProgram[];
}

export interface ICourseResponse {
  status: string;
  courses: ICourse[];
}
