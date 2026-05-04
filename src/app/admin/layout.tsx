import AdminShell from "@/components/common/AdminShell";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <AdminShell>{children}</AdminShell>;
};

export default AdminLayout;
