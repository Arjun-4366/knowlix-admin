export type EnquiryStatus = "New" | "Contacted" | "Closed";

export interface IEnquiry {
  id: string;
  name: string;
  childGrade: string;
  phoneNumber: string;
  message: string;
  status: EnquiryStatus;
  createdAt?: string;
}

export interface IEnquiryResponse {
  status: string;
  enquiries: IEnquiry[];
}
