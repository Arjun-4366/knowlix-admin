const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  //auth
  LOGIN: `${API_BASE_URL}/auth/login`,

  //about
  ABOUT: `${API_BASE_URL}/about/fetch`,
  ABOUT_CREATE: `${API_BASE_URL}/about/create`,
  ABOUT_STATUS: `${API_BASE_URL}/about/change-status`,
  ABOUT_IMAGE: `${API_BASE_URL}/about/upload-image`,
  ABOUT_DOCUMENT: `${API_BASE_URL}/about/upload-document`,

  // reviews
  REVIEWS_FETCH: `${API_BASE_URL}/reviews/fetch`,
  REVIEWS_CREATE: `${API_BASE_URL}/reviews/create`,
  REVIEWS_DELETE: `${API_BASE_URL}/reviews/delete`,

  // faqs
  FAQS_FETCH: `${API_BASE_URL}/faqs/fetch`,
  FAQS_CREATE: `${API_BASE_URL}/faqs/create`,
  FAQS_DELETE: `${API_BASE_URL}/faqs/delete`,

  // team
  TEAM_FETCH: `${API_BASE_URL}/team/fetch`,
  TEAM_CREATE: `${API_BASE_URL}/team/create`,
  TEAM_UPDATE: `${API_BASE_URL}/team/update`,
  TEAM_DELETE: `${API_BASE_URL}/team/delete`,

  // careers
  CAREERS_FETCH: `${API_BASE_URL}/careers/fetch`,
  CAREERS_ADMIN_FETCH: `${API_BASE_URL}/careers/admin/fetch`,
  CAREERS_CREATE: `${API_BASE_URL}/careers/create`,
  CAREERS_UPDATE: `${API_BASE_URL}/careers/update`,
  CAREERS_DELETE: `${API_BASE_URL}/careers/delete`,

  // applications
  APPLICATIONS_FETCH: `${API_BASE_URL}/career-applications/fetch`,
  APPLICATIONS_UPDATE: `${API_BASE_URL}/career-applications/update`,
  APPLICATIONS_DELETE: `${API_BASE_URL}/career-applications/delete`,

  // blogs
  BLOGS_FETCH: `${API_BASE_URL}/blogs/fetch`,
  BLOGS_CREATE: `${API_BASE_URL}/blogs/create`,
  BLOGS_UPDATE: `${API_BASE_URL}/blogs/update`,
  BLOGS_DELETE: `${API_BASE_URL}/blogs/delete`,

  // gallery
  GALLERY_FETCH: `${API_BASE_URL}/gallery/fetch`,
  GALLERY_CREATE: `${API_BASE_URL}/gallery/create`,
  GALLERY_DELETE: `${API_BASE_URL}/gallery/delete`,

  // enquiries
  ENQUIRIES_FETCH: `${API_BASE_URL}/enquiries/fetch`,
  ENQUIRIES_UPDATE: `${API_BASE_URL}/enquiries/update`,
  ENQUIRIES_DELETE: `${API_BASE_URL}/enquiries/delete`,

  // programs
  PROGRAMS_FETCH: `${API_BASE_URL}/programs/fetch`,
  PROGRAMS_CREATE: `${API_BASE_URL}/programs/create`,
  PROGRAMS_UPDATE: `${API_BASE_URL}/programs/update`,
  PROGRAMS_DELETE: `${API_BASE_URL}/programs/delete`,
  PROGRAMS_ADD_COURSE: `${API_BASE_URL}/programs/add-course`,
  PROGRAMS_UPDATE_COURSE: `${API_BASE_URL}/programs/update-course`,
  PROGRAMS_DELETE_COURSE: `${API_BASE_URL}/programs/delete-course`,
  PROGRAMS_GET_COURSES: `${API_BASE_URL}/programs`, // usage: /programs/:id/courses
} as const;
