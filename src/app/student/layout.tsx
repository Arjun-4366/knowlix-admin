import StudentShell from "@/components/student/layout/StudentShell";


const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return <StudentShell>{children}</StudentShell>;
};

export default StudentLayout;
