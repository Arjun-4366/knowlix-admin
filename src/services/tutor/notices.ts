import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";
import { QueryParams } from "@/types/queryParams";

export interface ITutorAnnouncement {
  id: string;
  category: string;
  title: string;
  content: string;
  authorId: string;
  department: string;
  audience: string;
  priority: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorNotice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorNoticesData {
  announcements: ITutorAnnouncement[];
  notices: ITutorNotice[];
  totalAnnouncements?: number;
  totalNotices?: number;
}

export const getTutorNotices = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<ITutorNoticesData>>(ENDPOINTS.GET_TUTOR_NOTICES, { params });
  return res.data.data;
};
