export interface ICurriculumItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICurriculumResponse {
  status: string;
  data: ICurriculumItem[];
  total: number;
}

export interface ICreateCurriculumPayload {
  name: string;
}

export interface IUpdateCurriculumPayload {
  name: string;
}
