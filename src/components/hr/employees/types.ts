export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  designation: string;
  department: "HR" | "Tutor" | "Sales" | "Operations" | "Academics" | "Finance";
  dateOfJoining: string;
  status: "Active" | "On Probation" | "Terminated" | "Resigned";
  manager: string;
  salaryDetails: {
    base: number;
    allowance: number;
    pf: number;
    ctc: number;
  };
  documents: {
    id: string;
    name: string;
    type: "ID Proof" | "Certificate" | "Agreement" | "Other";
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
export type DocType = Employee["documents"][0]["type"];
