import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IGalleryItem, IGalleryResponse } from "@/types/admin/gallery";
import { IApiResponse } from "@/types/admin/api";

export const getGalleryItems = async () => {
  const res = await apiClient.get<IGalleryResponse>(ENDPOINTS.GALLERY_FETCH);
  return res.data;
};

export const addGalleryItem = async (data: IGalleryItem) => {
  const formData = new FormData();
  formData.append("tag", data.tag);
  formData.append("description", data.description);
  formData.append("mediaType", data.mediaType);

  if (data.mediaUrl instanceof File) {
    formData.append("media", data.mediaUrl);
  } else if (typeof data.mediaUrl === "string") {
    formData.append("media", data.mediaUrl);
  }

  const res = await apiClient.post<IApiResponse<IGalleryItem>>(ENDPOINTS.GALLERY_CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteGalleryItem = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.GALLERY_DELETE}/${id}`);
  return res.data;
};
