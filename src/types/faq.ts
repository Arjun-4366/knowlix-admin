export interface IFaq {
  id?: string;
  question: string;
  answer: string;
}

export interface IFaqResponse {
  data: IFaq[];
  success: string;
}
