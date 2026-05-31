const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  //auth
  LOGIN: `${API_BASE_URL}/auth/login`,

  //dashboard
  ADMIN_DASHBOARD: `${API_BASE_URL}/dashboard`,

  //website//

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

  //students
  GET_STUDENTS: `${API_BASE_URL}/students/fetch`,
  ADD_STUDENT: `${API_BASE_URL}/students/create`,
  UPDATE_STUDENT: `${API_BASE_URL}/students/update`,
  DELETE_STUDENT: `${API_BASE_URL}/students/delete`,
  GET_STUDENT: (id: string) => `${API_BASE_URL}/students/${id}`,
  ASSIGN_TUTOR: (tutorId: string) => `${API_BASE_URL}/students/?tutorId=${tutorId}/assign`,
  GET_STUDENT_DOC: (studentId: string) => `${API_BASE_URL}/students/${studentId}/documents`,

  //tutors
  GET_TUTORS: `${API_BASE_URL}/tutors/fetch`,
  GET_TOP5_TUTORS: `${API_BASE_URL}/tutors/top5`,
  ADD_TUTOR: `${API_BASE_URL}/tutors/create`,
  UPDATE_TUTOR: `${API_BASE_URL}/tutors/update`,
  DELETE_TUTOR: `${API_BASE_URL}/tutors/delete`,
  APPROVE_TUTOR: (id: string) => `${API_BASE_URL}/tutors/${id}/approve`,
  UPDATE_TUTOR_PERMISSIONS: (id: string) => `${API_BASE_URL}/tutors/${id}/permissions`,
  GET_TUTOR_PERFORMANCE: (id: string) => `${API_BASE_URL}/tutors/${id}/performance`,
  GET_TUTOR: (id: string) => `${API_BASE_URL}/tutors/${id}`,
  ADD_GROWTH_POINT:`${API_BASE_URL}/growth/award`,
  GET_LEADERBOARD:`${API_BASE_URL}/growth/leaderboard`,

  // reports
  GET_REPORTS: `${API_BASE_URL}/reports`,


  // TUTOR
  //dashboard
  GET_TUTOR_DASHBOARD:`${API_BASE_URL}/tutor/dashboard`,
  
  // profile
  TUTOR_PROFILE:`${API_BASE_URL}/tutor/profile`,

  //students
  GET_TUTOR_STUDENTS:`${API_BASE_URL}/tutor/students`,
  GET_TUTOR_STUDENT: (id:string)=>`${API_BASE_URL}/tutor/students/${id}`,
  //Attendance
  GET_TUTOR_ATTENDANCE:`${API_BASE_URL}/tutor/attendance`,
  MARK_TUTOR_ATTENDANCE:`${API_BASE_URL}/tutor/attendance/mark`,
  GET_SESSIONS:`${API_BASE_URL}/tutor/meet/fetch`,
  CREATE_SESSION:`${API_BASE_URL}/tutor/meet/create`,
  UPDATE_SESSION: (id: string) => `${API_BASE_URL}/tutor/meet/${id}/update`,
  DELETE_SESSION: (id: string) => `${API_BASE_URL}/tutor/meet/${id}`,

  //assignments
  GET_TUTOR_ASSIGNMENTS:`${API_BASE_URL}/tutor/assignments/fetch`,
  CREATE_ASSIGNMENTS:`${API_BASE_URL}/tutor/assignments/create`,
  EVALUATE_ASSIGNMENTS:(id:string)=>`${API_BASE_URL}/tutor/assignments/${id}/evaluate`,

  //exams
  GET_TUTOR_EXAMS: `${API_BASE_URL}/tutor/exams/fetch`,
  CREATE_EXAM: `${API_BASE_URL}/tutor/exams/create`,
  UPDATE_EXAM_STATUS: (id: string) => `${API_BASE_URL}/tutor/exams/${id}/status`,
  ENTER_EXAM_RESULTS: (id: string) => `${API_BASE_URL}/tutor/exams/${id}/results`,
  
} as const; 
