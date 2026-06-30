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
  GET_STUDENT_SESSIONS: (id: string) => `${API_BASE_URL}/students/${id}/sessions`,
  GET_STUDENT_EXAMS: (id: string) => `${API_BASE_URL}/students/${id}/exams`,
  GET_ADMIN_STUDENT_ASSIGNMENTS: (id: string) => `${API_BASE_URL}/students/${id}/assignments`,

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
  GET_GROWTH_HISTORY: `${API_BASE_URL}/growth/history`,
  HR_GROWTH_AWARD: `${API_BASE_URL}/hr/growth/award`,
  HR_GROWTH_LEADERBOARD: `${API_BASE_URL}/hr/growth/leaderboard`,
  HR_GROWTH_HISTORY: `${API_BASE_URL}/hr/growth/history`,
  ASSIGN_STUDENTS_TO_TUTOR: (id: string) => `${API_BASE_URL}/tutors/${id}/assign-students`,

  //notes
  GET_NOTES: `${API_BASE_URL}/admin/notes/fetch`,
  CREATE_NOTE: `${API_BASE_URL}/admin/notes/create`,
  UPDATE_NOTE: (id: string) => `${API_BASE_URL}/admin/notes/${id}`,
  DELETE_NOTE: (id: string) => `${API_BASE_URL}/admin/notes/${id}`,
  GET_FILTERS: `${API_BASE_URL}/admin/notes/filters`,

  // reports
  GET_REPORTS: `${API_BASE_URL}/reports`,

  // STUDENT
  GET_STUDENT_DASHBOARD: `${API_BASE_URL}/student/dashboard`,
  GET_STUDENT_NOTICES: `${API_BASE_URL}/student/notices`,
  STUDENT_CHATBOT: `${API_BASE_URL}/student/chatbot`,
  GET_STUDENT_SCHEDULE: `${API_BASE_URL}/student/schedule`,
  GET_STUDENT_ASSIGNMENTS: `${API_BASE_URL}/student/assignments`,
  SUBMIT_STUDENT_ASSIGNMENT: (id: string) => `${API_BASE_URL}/student/assignments/${id}/submit`,
  GET_STUDENT_ASSIGNMENT_STATUS: (id: string) => `${API_BASE_URL}/student/assignments/${id}/status`,
  GET_STUDENT_RESULTS: `${API_BASE_URL}/student/results`,
  GET_STUDENT_RESULTS_GRADES: `${API_BASE_URL}/student/results/grades`,
  GET_STUDENT_RESULTS_ANALYTICS: `${API_BASE_URL}/student/results/analytics`,
  GET_STUDENT_FEES: `${API_BASE_URL}/student/fees`,
  GET_STUDENT_FEES_STATUS: `${API_BASE_URL}/student/fees/status`,
  GET_STUDENT_PROFILE:`${API_BASE_URL}/student/profile`,

  // student notes
  GET_STUDENT_NOTE_SUBJECTS: `${API_BASE_URL}/student/notes/subjects`,
  GET_STUDENT_NOTE_CHAPTERS: `${API_BASE_URL}/student/notes/chapters`,
  GET_STUDENT_NOTES: `${API_BASE_URL}/student/notes`,

  // TUTOR
  //dashboard
  GET_TUTOR_DASHBOARD:`${API_BASE_URL}/tutor/dashboard`,
  GET_TUTOR_SALARY:`${API_BASE_URL}/tutor/salary/fetch`,
  
  // profile
  TUTOR_PROFILE:`${API_BASE_URL}/tutor/profile`,

  //students
  GET_TUTOR_STUDENTS:`${API_BASE_URL}/tutor/students`,
  GET_TUTOR_STUDENT: (id:string)=>`${API_BASE_URL}/tutor/students/${id}`,

  //mentors
  // superadmin
  SUPERADMIN_REVENUE: `${API_BASE_URL}/superadmin/revenue`,

  GET_MENTORS: `${API_BASE_URL}/mentors/fetch`,
  CREATE_MENTOR: `${API_BASE_URL}/mentors/create`,
  UPDATE_MENTOR: (id: string) => `${API_BASE_URL}/mentors/update/${id}`,
  DELETE_MENTOR: (id: string) => `${API_BASE_URL}/mentors/delete/${id}`,

  //coordinators

  GET_COORDINATORS: `${API_BASE_URL}/coordinators/fetch`,
  CREATE_COORDINATOR: `${API_BASE_URL}/coordinators/create`,
  UPDATE_COORDINATOR: (id: string) => `${API_BASE_URL}/coordinators/update/${id}`,
  DELETE_COORDINATOR: (id: string) => `${API_BASE_URL}/coordinators/delete/${id}`,

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

  //notices
  GET_TUTOR_NOTICES: `${API_BASE_URL}/tutor/notices`,

  //exams
  GET_TUTOR_EXAMS: `${API_BASE_URL}/tutor/exams/fetch`,
  CREATE_EXAM: `${API_BASE_URL}/tutor/exams/create`,
  UPDATE_EXAM_STATUS: (id: string) => `${API_BASE_URL}/tutor/exams/${id}/status`,
  ENTER_EXAM_RESULTS: (id: string) => `${API_BASE_URL}/tutor/exams/${id}/results`,

    // Tutor management (HR)
    CREATE_TUTOR: `${API_BASE_URL}/hr/tutors/create`,
    GET_TUTORS_HR: `${API_BASE_URL}/hr/tutors`,
    GET_TUTOR_HR: (id: string) => `${API_BASE_URL}/hr/tutors/${id}`,
    UPDATE_TUTOR_HR: (id: string) => `${API_BASE_URL}/hr/tutors/${id}`,
    ADD_REMARK_HR: (id: string) => `${API_BASE_URL}/hr/tutors/${id}/remarks`,

    // Tutor attendance (HR)
    GET_HR_TUTOR_ATTENDANCE: `${API_BASE_URL}/hr/attendance`,
    GET_HR_TUTOR_ATTENDANCE_SUMMARY: `${API_BASE_URL}/hr/tutors/attendance/summary`,
    APPROVE_ATTENDANCE: (id: string) => `${API_BASE_URL}/hr/attendance/${id}/approve`,
    APPROVE_ATTENDANCE_BULK: `${API_BASE_URL}/hr/attendance/approve-bulk`,

    // Holidays
    GET_HOLIDAYS: `${API_BASE_URL}/hr/holidays`,
    CREATE_HOLIDAY: `${API_BASE_URL}/hr/holidays/create`,
    DELETE_HOLIDAY: (id: string) => `${API_BASE_URL}/hr/holidays/${id}`,

  

    // Notices & announcements
    CREATE_NOTICE: `${API_BASE_URL}/hr/notices/create`,
    GET_NOTICES: `${API_BASE_URL}/hr/notices`,
    DELETE_NOTICE: (id: string) => `${API_BASE_URL}/hr/notices/${id}`,
    UPDATE_NOTICE: (id: string) => `${API_BASE_URL}/hr/notices/${id}`,

    // Salary management (CRUD)
    HR_SALARY_LIST: `${API_BASE_URL}/hr/tutors/salary`,
    HR_SALARY_CREATE: `${API_BASE_URL}/hr/tutors/salary/create`,
    HR_SALARY_UPDATE: (id: string) => `${API_BASE_URL}/hr/tutors/salary/${id}`,
    HR_SALARY_DELETE: (id: string) => `${API_BASE_URL}/hr/tutors/salary/${id}`,

    // Reports & analytics
    GET_HR_ATTENDANCE_REPORT: `${API_BASE_URL}/hr/reports/attendance`,
    GET_HR_SALARY: `${API_BASE_URL}/hr/reports/salary`,
    GET_HR_PERFORMANCE_REPORT: `${API_BASE_URL}/hr/reports/performance`,
    GET_HR_TURNOVER: `${API_BASE_URL}/hr/reports/turnover`,

    // Progress Reports (Tutor)
    TUTOR_PROGRESS_CREATE: `${API_BASE_URL}/tutor/progress/create`,
    TUTOR_PROGRESS_FETCH: `${API_BASE_URL}/tutor/progress/fetch`,
    TUTOR_PROGRESS_UPDATE: (id: string) => `${API_BASE_URL}/tutor/progress/${id}`,
    TUTOR_PROGRESS_DELETE: (id: string) => `${API_BASE_URL}/tutor/progress/${id}`,

    // Legacy aliases (kept for backwards compat)
    GET_HR_ATTENDANCE: `${API_BASE_URL}/hr/reports/attendance`,
    GET_HR_PERFOMANCE: `${API_BASE_URL}/hr/reports/performance`,
    CREATE_PERFOMANCE: `${API_BASE_URL}/hr/performance/create`,
    UPDATE_PERFOMANCE: (id: string) => `${API_BASE_URL}/hr/performance/${id}`,
    
    // Admin HR management
    ADMIN_HR_FETCH: `${API_BASE_URL}/admin/hr`,
    ADMIN_HR_CREATE: `${API_BASE_URL}/admin/hr/create`,
    ADMIN_HR_UPDATE_PASSWORD: (id: string) => `${API_BASE_URL}/admin/hr/${id}/set-password`,
    ADMIN_HR_DELETE: (id: string) => `${API_BASE_URL}/admin/hr/${id}`,

    // Curriculum — Standards
    GET_STANDARDS: `${API_BASE_URL}/admin/standards/fetch`,
    CREATE_STANDARD: `${API_BASE_URL}/admin/standards/create`,
    UPDATE_STANDARD: (id: string) => `${API_BASE_URL}/admin/standards/${id}`,
    DELETE_STANDARD: (id: string) => `${API_BASE_URL}/admin/standards/${id}`,

    // Curriculum — Syllabuses
    GET_SYLLABUSES: `${API_BASE_URL}/admin/syllabuses/fetch`,
    CREATE_SYLLABUS: `${API_BASE_URL}/admin/syllabuses/create`,
    UPDATE_SYLLABUS: (id: string) => `${API_BASE_URL}/admin/syllabuses/${id}`,
    DELETE_SYLLABUS: (id: string) => `${API_BASE_URL}/admin/syllabuses/${id}`,

    // Curriculum — Subjects
    GET_SUBJECTS: `${API_BASE_URL}/admin/subjects/fetch`,
    CREATE_SUBJECT: `${API_BASE_URL}/admin/subjects/create`,
    UPDATE_SUBJECT: (id: string) => `${API_BASE_URL}/admin/subjects/${id}`,
    DELETE_SUBJECT: (id: string) => `${API_BASE_URL}/admin/subjects/${id}`,

} as const; 
