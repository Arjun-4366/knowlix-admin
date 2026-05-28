export type MediaType = "image" | "video";

export interface IGalleryItem {
  id?: string;
  mediaUrl: string | File;
  mediaType: MediaType;
  tag: string;
  description: string;
}

export interface IGalleryResponse {
  status: string;
  gallery: IGalleryItem[];
}
