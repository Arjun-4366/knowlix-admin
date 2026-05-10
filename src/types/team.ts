export type TeamCategory = "Leadership" | "Advisory" | "Core Team" | "Mentor";

export interface ITeamMember {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string | File;
  category: TeamCategory;
  tags: string[];
}

export interface ITeamResponse {
  status: string;
  message: string;
  data: Record<TeamCategory, ITeamMember[]>;
}
