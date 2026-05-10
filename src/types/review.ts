export interface IReview {
  id?: string;
  rating: number;
  ratingText: string;
  name: string;
  city: string;
  grade: string;
}

export interface IReviewResponse {
  reviews: IReview[];
  status: string;
}
