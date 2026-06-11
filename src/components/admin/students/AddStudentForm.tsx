import { useState, useRef, useEffect, type FormEvent } from "react";
import { CheckCircle, FileText, X, Upload, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/shared/Loader";
import {
  ICreateStudentPayload,
  IStudentDocuments,
  IStudent,
} from "@/types/admin/student";
import { useGetPrograms, useGetCoursesByProgram } from "@/querys/admin/programQuery";
import { useGetMentors } from "@/querys/admin/mentorQuery";
import { useGetCoordinators } from "@/querys/admin/coordinatorQuery";

interface CertificateUploadFieldProps {
  label: string;
  value: string | File | undefined;
  onChange: (file: File | string) => void;
  accept?: string;
}

function CertificateUploadField({
  label,
  value,
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg",
}: CertificateUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = (val: string | File) => {
    if (val instanceof File) {
      return val.name;
    }
    try {
      const decoded = decodeURIComponent(val);
      const parts = decoded.split("/");
      return parts[parts.length - 1] || "Uploaded Document";
    } catch {
      return "Uploaded Document";
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "";
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const isFile = value instanceof File;
  const isUrl = typeof value === "string" && value.startsWith("http");

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-550">
        {value ? (
          <CheckCircle className="h-3.5 w-3.5 text-[var(--brand-green)]" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-slate-400" />
        )}
        {label}
      </Label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-sm hover:bg-slate-50 transition-colors">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] text-[var(--brand-green)]">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-700">
                {getFileName(value)}
              </p>
              <p className="text-[10px] text-slate-450 mt-0.5">
                {isFile
                  ? formatFileSize((value as File).size)
                  : "Cloud Document"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isUrl && (
              <a
                href={value as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-750 transition-colors shadow-sm"
                title="View Document"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-750 transition-colors shadow-sm"
              title="Replace File"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-650 transition-colors shadow-sm"
              title="Remove File"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-250 bg-slate-50/50 py-4 px-3 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-350 transition-all group"
        >
          <Upload className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <div>
            <p className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
              Click to upload {label.toLowerCase()}
            </p>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Supports PDF, PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface AddStudentFormProps {
  onSubmit: (student: ICreateStudentPayload) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  studentToEdit?: IStudent;
}

const emptyDocuments: IStudentDocuments = {
  birthCertificate: "",
  transferCertificate: "",
  previousAcademicRecord: "",
  identificationDocument: "",
};

const documentFields: Array<{
  key: keyof IStudentDocuments;
  label: string;
  placeholder: string;
}> = [
  {
    key: "birthCertificate",
    label: "Birth Certificate",
    placeholder: "https://example.com/documents/birth-certificate.pdf",
  },
  {
    key: "transferCertificate",
    label: "Transfer Certificate",
    placeholder: "https://example.com/documents/transfer-certificate.pdf",
  },
  {
    key: "previousAcademicRecord",
    label: "Previous Academic Record",
    placeholder: "https://example.com/documents/academic-record.pdf",
  },
  {
    key: "identificationDocument",
    label: "Identification Document",
    placeholder: "https://example.com/documents/id-proof.pdf",
  },
];

export default function AddStudentForm({
  onSubmit,
  onClose,
  isSubmitting = false,
  studentToEdit,
}: AddStudentFormProps) {
  const { data: mentorsResponse } = useGetMentors();
  const { data: coordinatorsResponse } = useGetCoordinators();
  const { data: programsResponse } = useGetPrograms();

  const mentorsList = mentorsResponse?.data ?? [];
  const coordinatorsList = coordinatorsResponse?.data ?? [];
  const programsList = programsResponse?.programs ?? [];

  const [studentName, setStudentName] = useState(
    studentToEdit?.studentName ?? "",
  );
  const [parentName, setParentName] = useState(studentToEdit?.parentName ?? "");
  const [studentClass, setStudentClass] = useState(studentToEdit?.class ?? "8");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [place, setPlace] = useState(studentToEdit?.place ?? "");
  const [programId, setProgramId] = useState(studentToEdit?.programId ?? "");
  const [courseId, setCourseId] = useState(studentToEdit?.courseId ?? "");

  const { data: coursesResponse } = useGetCoursesByProgram(programId);
  const coursesList = coursesResponse?.courses ?? [];
  const [packageValue, setPackageValue] = useState(
    studentToEdit?.package ?? "3_months",
  );
  
  const [customYears, setCustomYears] = useState(
    studentToEdit?.customPackageDetails?.match(/(\d+)\s*year/)?.[1] || "0"
  );
  const [customMonths, setCustomMonths] = useState(
    studentToEdit?.customPackageDetails?.match(/(\d+)\s*month/)?.[1] || "0"
  );

  const [customPackageDetails, setCustomPackageDetails] = useState(
    studentToEdit?.customPackageDetails ?? "",
  );
  const [totalFee, setTotalFee] = useState<number | "">(
    studentToEdit?.totalFee ?? ""
  );
  const [paidAmount, setPaidAmount] = useState<number | "">(
    studentToEdit?.paidAmount ?? ""
  );
  const [documents, setDocuments] = useState<IStudentDocuments>(
    studentToEdit?.documents ?? emptyDocuments,
  );
  const [coordinatorName, setCoordinatorName] = useState(
    studentToEdit?.coordinatorName ?? "",
  );
  const [admissionStatus, setAdmissionStatus] = useState(
    studentToEdit?.admissionStatus ?? "active",
  );

  const [assignedMentorId, setAssignedMentorId] = useState(
    studentToEdit?.mentorId ?? "",
  );
  const [assignedCoordinatorId, setAssignedCoordinatorId] = useState(
    studentToEdit?.coordinatorId ?? "",
  );

  const setDocumentValue = (
    key: keyof IStudentDocuments,
    value: string | File,
  ) => {
    setDocuments((current) => ({ ...current, [key]: value }));
  };

  const isOnlineSchool = programsList.find((p) => p.id === programId)?.title?.toLowerCase().includes("online school");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !studentName.trim() ||
      !parentName.trim() ||
      (!studentToEdit && !email.trim()) ||
      (!studentToEdit && !password.trim()) ||
      !place.trim() ||
      !coordinatorName.trim() ||
      !programId.trim() ||
      !courseId.trim() ||
      !assignedMentorId.trim() ||
      !assignedCoordinatorId.trim()
    ) {
      toast.error("Please fill all required student and assignment fields.");
      return;
    }

    let finalCustomDetails = customPackageDetails.trim();
    if (packageValue === "custom") {
      const parts = [];
      if (customYears !== "0") parts.push(`${customYears} year${customYears !== "1" ? "s" : ""}`);
      if (customMonths !== "0") parts.push(`${customMonths} month${customMonths !== "1" ? "s" : ""}`);
      finalCustomDetails = parts.join(" ");
    }

    onSubmit({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      class: studentClass,
      email: email.trim(),
      phone: phone.trim(),
      password,
      place: place.trim(),
      courseType: programsList.find(p => p.id === programId)?.title || "",
      programId: programId.trim(),
      courseId: courseId.trim(),
      package: packageValue,
      customPackageDetails: finalCustomDetails,
      documents: isOnlineSchool ? documents : emptyDocuments,
      admissionStatus,
      totalFee: totalFee === "" ? 0 : Number(totalFee),
      paidAmount: paidAmount === "" ? 0 : Number(paidAmount),
      mentorId: assignedMentorId.trim(),
      coordinatorId: assignedCoordinatorId.trim(),
    });
  };

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {studentToEdit ? "Edit Student" : "Add New Student"}
          </h3>
          <p className="mt-0.5 text-xs text-slate-450">
            {studentToEdit
              ? "Update student using the admin API payload."
              : "Create a student using the admin API payload."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-h-[80vh] space-y-6 divide-y divide-slate-100 overflow-y-auto p-6"
      >
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-750">
            Student Details
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Student Name *
              </Label>
              <Input
                required
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Ayaan Mohammed"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Parent Name *
              </Label>
              <Input
                required
                value={parentName}
                onChange={(event) => setParentName(event.target.value)}
                placeholder="Shanavas"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {!studentToEdit && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-550">
                    Email *
                  </Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="student@example.com"
                    className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-550">
                    Phone
                  </Label>
                  <Input
                    type="number"
                    value={phone}
                    onChange={(event) => {
                      const val = event.target.value;
                      if (/^\d*$/.test(val)) {
                        setPhone(val);
                      }
                    }}
                    placeholder="9876543210"
                    className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-550">
                    Password *
                  </Label>
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="password123"
                    className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Class *
              </Label>
              <Select value={studentClass} onValueChange={setStudentClass}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, index) =>
                    String(index + 1),
                  ).map((value) => (
                    <SelectItem key={value} value={value}>
                      Class {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Place *
              </Label>
              <Input
                required
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                placeholder="Calicut"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Program *
              </Label>
              <Select value={programId} onValueChange={(val) => { setProgramId(val); setCourseId(""); }}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programsList.map((prog) => (
                    <SelectItem key={prog.id} value={prog.id!}>
                      {prog.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Course *
              </Label>
              <Select disabled={!programId} value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesList.map((course) => (
                    <SelectItem key={course.id} value={course.id!}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Package *
              </Label>
              <Select value={packageValue} onValueChange={setPackageValue}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="2_months">2 Months</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                  <SelectItem value="6_months">6 Months</SelectItem>
                  <SelectItem value="1_year">1 Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Admission Status *
              </Label>
              <Select
                key={`status-${studentToEdit?.id || "new"}`}
                value={admissionStatus}
                onValueChange={setAdmissionStatus}
              >
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Admission Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission_taken">
                    Admission Taken
                  </SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="course_completed">
                    Course Completed
                  </SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Total Fee (₹)
              </Label>
              <Input
                type="number"
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="25000"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Paid Amount (₹)
              </Label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="5000"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {packageValue === "custom" && (
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <Label className="text-xs font-semibold text-slate-550">
                Custom Package Duration
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Select value={customYears} onValueChange={setCustomYears}>
                  <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 Years</SelectItem>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={customMonths} onValueChange={setCustomMonths}>
                  <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 Months</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m} Month{m !== "1" && "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {isOnlineSchool && (
          <div className="space-y-4 pt-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-750">
                Documents
              </h4>
              <Badge
                variant="outline"
                className="rounded-full border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--brand-mid)]"
              >
                File Upload
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {documentFields.map((field) => (
                <CertificateUploadField
                  key={field.key}
                  label={field.label}
                  value={documents[field.key]}
                  onChange={(value) => setDocumentValue(field.key, value)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 pt-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-750">
            Assignments
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-slate-555">
                Assigned Admissions Coordinator *
              </Label>
              <Select
                value={assignedCoordinatorId}
                onValueChange={(val) => {
                  setAssignedCoordinatorId(val);
                  const selected = coordinatorsList.find((c) => c.id === val);
                  if (selected) {
                    setCoordinatorName(selected.name);
                  }
                }}
              >
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Select Coordinator" />
                </SelectTrigger>
                <SelectContent>
                  {coordinatorsList.map((coordinator) => (
                    <SelectItem key={coordinator.id} value={coordinator.id}>
                      {coordinator.name} ({coordinator.designation} -{" "}
                      {coordinator.department})
                    </SelectItem>
                  ))}
                  {assignedCoordinatorId &&
                    !coordinatorsList.some(
                      (c) => c.id === assignedCoordinatorId,
                    ) && (
                      <SelectItem value={assignedCoordinatorId}>
                        {coordinatorName
                          ? `${coordinatorName} (ID: ${assignedCoordinatorId})`
                          : `ID: ${assignedCoordinatorId}`}
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Assigned Mentor *
              </Label>
              <Select
                value={assignedMentorId}
                onValueChange={setAssignedMentorId}
              >
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Select Mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentorsList.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.name} ({mentor.designation} - {mentor.department})
                    </SelectItem>
                  ))}
                  {assignedMentorId &&
                    !mentorsList.some((m) => m.id === assignedMentorId) && (
                      <SelectItem value={assignedMentorId}>
                        {studentToEdit?.coordinatorId
                          ? `ID: ${studentToEdit.mentorId}`
                          : assignedMentorId}
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-white pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-slate-500 hover:bg-slate-50"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-xl bg-[var(--brand-green)] px-5 py-2.5 text-white shadow-md shadow-green-600/10 hover:bg-[var(--brand-mid)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ButtonLoader />
            ) : studentToEdit ? (
              "Update Student"
            ) : (
              "Save Student"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
