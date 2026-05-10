export type BlogCategory = "Collaborations" | "Talks" | "Trainings" | "Workshops" | "Partnerships" | "";

export interface IBlog {
  id?: string;
  title: string;
  description: string;
  image: string | File;
  isFeatured: boolean;
  category: BlogCategory;
  date: string;
  readTime: string;
}

export interface IBlogResponse {
  status: string;
  data: Record<string, IBlog[]>;
}
