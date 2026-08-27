export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects?: string[];
  experience?: string;
  availability?: string[];
  role?: string;
  department: "HR" | "Tutor" | "Sales" | "Operations" | "Academics" | "Finance" | string;
  designation: string;
  status: "Active" | "Pending" | "Terminated" | "Resigned" | "Pending" | "Approved" | string;
  dateOfJoining: string;
  profileImage?: string;
  address: string;
  dob: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  manager?: string;
  salaryDetails: {
    base: number;
    allowance: number;
    pf: number;
    ctc: number;
  };
  documents: {
    id: string;
    name: string;
    type: "ID Proof" | "Certificate" | "Agreement" | "Other" | string;
    uploadDate: string;
    fileSize: string;
  }[];
  joiningRecords: {
    probationEnd?: string;
    joiningNotes?: string;
  };
  exitRecords?: {
    exitDate?: string;
    reason?: string;
    exitNotes?: string;
  };
}

export type DepartmentType = Employee["department"];
export type StatusType = Employee["status"];
