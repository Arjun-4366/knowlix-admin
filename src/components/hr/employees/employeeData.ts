import { Employee } from "./types";

export const EMPLOYEE_STORAGE_KEY = "knowlix_employees";
const employeeListeners = new Set<() => void>();

export const EMPLOYEE_DEPARTMENTS: Employee["department"][] = [
  "HR",
  "Tutor",
  "Sales",
  "Operations",
  "Academics",
  "Finance",
];

export const EMPLOYEE_STATUSES: Employee["status"][] = [
  "Active",
  "On Probation",
  "Terminated",
  "Resigned",
];

export const initialEmployees: Employee[] = [
  {
    id: "EMP-101",
    name: "Priyanjali Sharma",
    email: "priyanjali.s@knowlix.in",
    phone: "+91 98765 43210",
    address: "A-402, Shanti Vihar, Sector 62, Noida, UP",
    dob: "1992-08-15",
    emergencyContact: {
      name: "Ravi Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43211",
    },
    designation: "HR Manager",
    department: "HR",
    dateOfJoining: "2024-01-15",
    status: "Active",
    manager: "Admin",
    salaryDetails: { base: 65000, allowance: 15000, pf: 8000, ctc: 1056000 },
    documents: [
      {
        id: "DOC-101-1",
        name: "Aadhaar_Card_Priyanjali.pdf",
        type: "ID Proof",
        uploadDate: "2024-01-15",
        fileSize: "1.2 MB",
      },
      {
        id: "DOC-101-2",
        name: "Employment_Agreement_Signed.pdf",
        type: "Agreement",
        uploadDate: "2024-01-16",
        fileSize: "2.4 MB",
      },
    ],
    joiningRecords: {
      probationEnd: "2024-04-15",
      joiningNotes: "Joined as lead HR. Probation completed successfully.",
    },
  },
  {
    id: "EMP-102",
    name: "Dr. Ramesh Prasad",
    email: "ramesh.prasad@knowlix.in",
    phone: "+91 87654 32109",
    address: "Flat 12B, Maple Heights, HSR Layout, Bengaluru",
    dob: "1978-05-20",
    emergencyContact: {
      name: "Sunita Prasad",
      relationship: "Spouse",
      phone: "+91 87654 32108",
    },
    designation: "Academic Head & Mathematics Tutor",
    department: "Academics",
    dateOfJoining: "2023-06-01",
    status: "Active",
    manager: "Admin",
    salaryDetails: { base: 90000, allowance: 20000, pf: 11000, ctc: 1452000 },
    documents: [
      {
        id: "DOC-102-1",
        name: "PhD_Mathematics_Certificate.pdf",
        type: "Certificate",
        uploadDate: "2023-05-28",
        fileSize: "3.1 MB",
      },
      {
        id: "DOC-102-2",
        name: "Pan_Card_Ramesh.pdf",
        type: "ID Proof",
        uploadDate: "2023-05-28",
        fileSize: "950 KB",
      },
    ],
    joiningRecords: {
      probationEnd: "2023-09-01",
      joiningNotes: "Ph.D. in Math. Handling Grade 10-12 Curriculum.",
    },
  },
  {
    id: "EMP-103",
    name: "Vikram Aditya",
    email: "vikram.a@knowlix.in",
    phone: "+91 76543 21098",
    address: "15, Green Glen Layout, Bellandur, Bengaluru",
    dob: "1995-11-02",
    emergencyContact: {
      name: "Suresh Aditya",
      relationship: "Father",
      phone: "+91 76543 21090",
    },
    designation: "Operations Associate",
    department: "Operations",
    dateOfJoining: "2025-02-10",
    status: "On Probation",
    manager: "Priyanjali Sharma",
    salaryDetails: { base: 35000, allowance: 8000, pf: 4200, ctc: 566400 },
    documents: [
      {
        id: "DOC-103-1",
        name: "Graduation_Degree_Vikram.pdf",
        type: "Certificate",
        uploadDate: "2025-02-10",
        fileSize: "1.8 MB",
      },
    ],
    joiningRecords: {
      probationEnd: "2025-08-10",
      joiningNotes: "Operations team member. Currently on 6 months probation.",
    },
  },
  {
    id: "EMP-104",
    name: "Neha Patel",
    email: "neha.patel@knowlix.in",
    phone: "+91 95432 10987",
    address: "Row House 7, Royal Palms, Goregaon East, Mumbai",
    dob: "1994-03-24",
    emergencyContact: {
      name: "Karan Patel",
      relationship: "Brother",
      phone: "+91 95432 10986",
    },
    designation: "Senior Admissions Counsellor",
    department: "Sales",
    dateOfJoining: "2024-03-01",
    status: "Resigned",
    manager: "Priyanjali Sharma",
    salaryDetails: { base: 45000, allowance: 12000, pf: 5400, ctc: 748800 },
    documents: [
      {
        id: "DOC-104-1",
        name: "Experience_Letter_Sales.pdf",
        type: "Certificate",
        uploadDate: "2024-03-01",
        fileSize: "1.1 MB",
      },
    ],
    joiningRecords: {
      probationEnd: "2024-06-01",
      joiningNotes: "Experienced counsellor. Relocated out of city.",
    },
    exitRecords: {
      exitDate: "2025-04-30",
      reason: "Relocation",
      exitNotes: "Resigned due to personal relocation. Served full notice period.",
    },
  },
];

let cachedEmployees: Employee[] = initialEmployees;
let cachedEmployeesRaw: string | null = null;
let hasHydratedEmployees = false;

function syncEmployeesFromStorage() {
  if (typeof window === "undefined") {
    return initialEmployees;
  }

  const storedEmployees = window.localStorage.getItem(EMPLOYEE_STORAGE_KEY);

  if (!storedEmployees) {
    cachedEmployees = initialEmployees;
    cachedEmployeesRaw = null;
    hasHydratedEmployees = true;
    return cachedEmployees;
  }

  if (hasHydratedEmployees && storedEmployees === cachedEmployeesRaw) {
    return cachedEmployees;
  }

  try {
    const parsedEmployees = JSON.parse(storedEmployees) as Employee[];

    if (Array.isArray(parsedEmployees)) {
      cachedEmployees = parsedEmployees;
      cachedEmployeesRaw = storedEmployees;
      hasHydratedEmployees = true;
      return cachedEmployees;
    }
  } catch {
    // Fall through to in-memory defaults.
  }

  cachedEmployees = initialEmployees;
  cachedEmployeesRaw = null;
  hasHydratedEmployees = true;
  return cachedEmployees;
}

export function loadEmployees(): Employee[] {
  if (typeof window === "undefined") {
    return initialEmployees;
  }

  return syncEmployeesFromStorage();
}

export function persistEmployees(employees: Employee[]) {
  if (typeof window === "undefined") {
    return;
  }

  cachedEmployees = employees;
  cachedEmployeesRaw = JSON.stringify(employees);
  hasHydratedEmployees = true;

  window.localStorage.setItem(EMPLOYEE_STORAGE_KEY, cachedEmployeesRaw);
  employeeListeners.forEach((listener) => listener());
}

export function subscribeToEmployees(listener: () => void) {
  employeeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      employeeListeners.delete(listener);
    };
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === EMPLOYEE_STORAGE_KEY) {
      syncEmployeesFromStorage();
      listener();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    employeeListeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function getEmployeesServerSnapshot() {
  return initialEmployees;
}
