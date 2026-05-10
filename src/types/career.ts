export type ApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";
export type CareerStatus = "Active" | "Inactive";

export interface ICareer {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  status: CareerStatus;
  createdAt?: string;
}

export interface ICareerApplication {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ICareerResponse {
  status: string;
  careers: ICareer[];
}

export interface IApplicationResponse {
  status: string;
  applications: ICareerApplication[];
}
