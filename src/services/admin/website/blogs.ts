import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IBlog, IBlogResponse } from "@/types/admin/blog";
import { IApiResponse } from "@/types/admin/api";

export const getBlogs = async () => {
  const res = await apiClient.get<IBlogResponse>(ENDPOINTS.BLOGS_FETCH);
  return res.data;
};

export const createBlog = async (data: IBlog) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("date", data.date);
  formData.append("readTime", data.readTime);
  formData.append("isFeatured", String(data.isFeatured));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image", data.image);
  }

  const res = await apiClient.post<IApiResponse<IBlog>>(ENDPOINTS.BLOGS_CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateBlog = async (data: IBlog) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("date", data.date);
  formData.append("readTime", data.readTime);
  formData.append("isFeatured", String(data.isFeatured));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image", data.image);
  }

  const res = await apiClient.put<IApiResponse<IBlog>>(`${ENDPOINTS.BLOGS_UPDATE}/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.BLOGS_DELETE}/${id}`);
  return res.data;
};
