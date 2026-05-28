import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { ITeamMember, ITeamResponse } from "@/types/admin/team";
import { IApiResponse } from "@/types/admin/api";

export const getTeam = async () => {
  const res = await apiClient.get<ITeamResponse>(ENDPOINTS.TEAM_FETCH);
  return res.data;
};

export const createTeamMember = async (data: ITeamMember) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("role", data.role);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("tags", JSON.stringify(data.tags));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image", data.image);
  }

  const res = await apiClient.post<IApiResponse<ITeamMember>>(
    ENDPOINTS.TEAM_CREATE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};

export const deleteTeamMember = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(
    `${ENDPOINTS.TEAM_DELETE}/${id}`,
  );
  return res.data;
};

export const updateTeamMember = async (id: string, data: ITeamMember) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("role", data.role);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("tags", JSON.stringify(data.tags));

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image", data.image);
  }

  const res = await apiClient.put<IApiResponse<ITeamMember>>(
    `${ENDPOINTS.TEAM_UPDATE}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};
