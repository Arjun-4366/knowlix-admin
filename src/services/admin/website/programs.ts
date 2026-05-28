import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IProgram, IProgramResponse, ICourse, ICourseResponse } from "@/types/admin/program";
import { IApiResponse } from "@/types/admin/api";

// ─── Programs ──────────────────────────────────────────────────────────────

export const getPrograms = async () => {
  const res = await apiClient.get<IProgramResponse>(ENDPOINTS.PROGRAMS_FETCH);
  return res.data;
};

export const createProgram = async (data: IProgram) => {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("tag", data.tag);
  formData.append("rating", data.rating.toString());
  formData.append("studentsEnrolled", data.studentsEnrolled.toString());
  formData.append("title", data.title);
  formData.append("grade", data.grade);
  formData.append("description", data.description);
  formData.append("features", JSON.stringify(data.features));
  if (data.image instanceof File) formData.append("image", data.image);

  const res = await apiClient.post<IApiResponse<IProgram>>(ENDPOINTS.PROGRAMS_CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProgram = async (id: string, data: Partial<IProgram>) => {
  const formData = new FormData();
  if (data.type) formData.append("type", data.type);
  if (data.tag !== undefined) formData.append("tag", data.tag);
  if (data.rating !== undefined) formData.append("rating", data.rating.toString());
  if (data.studentsEnrolled !== undefined) formData.append("studentsEnrolled", data.studentsEnrolled.toString());
  if (data.title) formData.append("title", data.title);
  if (data.grade) formData.append("grade", data.grade);
  if (data.description) formData.append("description", data.description);
  if (data.features) formData.append("features", JSON.stringify(data.features));
  if (data.image instanceof File) formData.append("image", data.image);

  const res = await apiClient.put<IApiResponse<IProgram>>(`${ENDPOINTS.PROGRAMS_UPDATE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProgram = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.PROGRAMS_DELETE}/${id}`);
  return res.data;
};

// ─── Courses ───────────────────────────────────────────────────────────────
// Route: GET /programs/:id/courses

export const getCoursesByProgram = async (programId: string) => {
  const res = await apiClient.get<ICourseResponse>(
    `${ENDPOINTS.PROGRAMS_GET_COURSES}/${programId}/courses`
  );
  return res.data;
};

// Route: POST /programs/add-course
export const addCourseToProgram = async (data: ICourse) => {
  const formData = new FormData();
  formData.append("programId", data.programId);
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("grade", data.grade);
  formData.append("totalStudentsEnrolled", data.totalStudentsEnrolled);
  if (data.image instanceof File) formData.append("image", data.image);

  const res = await apiClient.post(ENDPOINTS.PROGRAMS_ADD_COURSE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Route: PUT /programs/update-course/:id
export const updateCourse = async (id: string, data: Partial<ICourse>) => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.grade) formData.append("grade", data.grade);
  if (data.totalStudentsEnrolled) formData.append("totalStudentsEnrolled", data.totalStudentsEnrolled);
  if (data.image instanceof File) formData.append("image", data.image);

  const res = await apiClient.put(`${ENDPOINTS.PROGRAMS_UPDATE_COURSE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Route: DELETE /programs/delete-course/:id
export const deleteCourse = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.PROGRAMS_DELETE_COURSE}/${id}`);
  return res.data;
};
