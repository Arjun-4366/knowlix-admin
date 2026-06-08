import { Student } from "@/components/admin/students/StudentStats";
import { IStudent, IStudentDocuments } from "@/types/admin/student";

const documentLabels: Array<{
  key: keyof IStudentDocuments;
  label: string;
}> = [
  { key: "birthCertificate", label: "Birth Certificate" },
  { key: "transferCertificate", label: "Transfer Certificate" },
  { key: "previousAcademicRecord", label: "Previous Academic Records" },
  { key: "identificationDocument", label: "Identification Documents" },
];

export const getSubmittedDocumentLabels = (documents?: IStudentDocuments) => {
  if (!documents) {
    return [];
  }

  return documentLabels
    .filter((document) => Boolean(documents[document.key]))
    .map((document) => document.label);
};

export const formatAdmissionStatus = (status?: string) => {
  if (!status) {
    return "Pending";
  }

  const normalized = status.toLowerCase();

  if (normalized === "active" || normalized === "approved") {
    return "Approved";
  }

  if (normalized === "pending") {
    return "Pending";
  }

  if (normalized === "in_review") {
    return "In Review";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  if (normalized === "inactive") {
    return "Inactive";
  }

  return status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export const toAdmissionStatusPayload = (status: string) => {
  if (status === "Approved") {
    return "active";
  }

  return status.toLowerCase().replace(/\s+/g, "_");
};

export const formatPackage = (packageValue?: string, customDetails?: string) => {
  if (packageValue === "custom" && customDetails) {
    return customDetails;
  }

  if (!packageValue) {
    return "Not selected";
  }

  return packageValue
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const mapApiStudentToStudent = (student: IStudent): Student => ({
  id: student.id,
  admissionNumber: student.admissionNumber,
  name: student.studentName,
  parentName: student.parentName,
  grade: `Grade ${student.class}`,
  location: student.place,
  courseType: student.courseType,
  courseName: "",
  subjectTutor: student.assignedTutorId || "Not assigned",
  mentorSalesBro: student.assignedMentorId || "Not assigned",
  packageSelection: formatPackage(student.package, student.customPackageDetails),
  customPackageDuration: student.customPackageDetails,
  documentsSubmitted: getSubmittedDocumentLabels(student.documents),
  coordinatorName: student.coordinatorName,
  admissionStatus: formatAdmissionStatus(student.admissionStatus),
});
