import { useState, type FormEvent } from "react";
import { CheckCircle, FileText, X } from "lucide-react";
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
import { ICreateStudentPayload, IStudentDocuments, IStudent } from "@/types/admin/student";

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
  const [studentName, setStudentName] = useState(studentToEdit?.studentName ?? "");
  const [parentName, setParentName] = useState(studentToEdit?.parentName ?? "");
  const [studentClass, setStudentClass] = useState(studentToEdit?.class ?? "8");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [place, setPlace] = useState(studentToEdit?.place ?? "");
  const [courseType, setCourseType] = useState(studentToEdit?.courseType ?? "Online Tuition");
  const [packageValue, setPackageValue] = useState(studentToEdit?.package ?? "3_months");
  const [customPackageDetails, setCustomPackageDetails] = useState(studentToEdit?.customPackageDetails ?? "");
  const [documents, setDocuments] = useState<IStudentDocuments>(studentToEdit?.documents ?? emptyDocuments);
  const [coordinatorName, setCoordinatorName] = useState(studentToEdit?.coordinatorName ?? "");
  const [admissionStatus, setAdmissionStatus] = useState(studentToEdit?.admissionStatus ?? "active");
  const [assignedTutorId, setAssignedTutorId] = useState(studentToEdit?.assignedTutorId ?? "");
  const [assignedMentorId, setAssignedMentorId] = useState(studentToEdit?.assignedMentorId ?? "");
  const [assignedCoordinatorId, setAssignedCoordinatorId] = useState(studentToEdit?.assignedCoordinatorId ?? "");

  const setDocumentValue = (key: keyof IStudentDocuments, value: string) => {
    setDocuments((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !studentName.trim() ||
      !parentName.trim() ||
      (!studentToEdit && !email.trim()) ||
      (!studentToEdit && !password.trim()) ||
      !place.trim() ||
      !coordinatorName.trim() ||
      !assignedTutorId.trim() ||
      !assignedMentorId.trim() ||
      !assignedCoordinatorId.trim()
    ) {
      toast.error("Please fill all required student and assignment fields.");
      return;
    }

    onSubmit({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      class: studentClass,
      email: email.trim(),
      phone: phone.trim(),
      password,
      place: place.trim(),
      courseType,
      package: packageValue,
      customPackageDetails: customPackageDetails.trim(),
      documents,
      coordinatorName: coordinatorName.trim(),
      admissionStatus,
      assignedTutorId: assignedTutorId.trim(),
      assignedMentorId: assignedMentorId.trim(),
      assignedCoordinatorId: assignedCoordinatorId.trim(),
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
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91..."
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
                  {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((value) => (
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
                Course Type *
              </Label>
              <Select value={courseType} onValueChange={setCourseType}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online Tuition">Online Tuition</SelectItem>
                  <SelectItem value="Online School">Online School</SelectItem>
                  <SelectItem value="Hybrid Learning">Hybrid Learning</SelectItem>
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
              <Select value={admissionStatus} onValueChange={setAdmissionStatus}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Admission Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-550">
              Custom Package Details
            </Label>
            <Textarea
              value={customPackageDetails}
              onChange={(event) => setCustomPackageDetails(event.target.value)}
              placeholder="Optional notes for custom package"
              className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-4 pt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-750">
              Documents
            </h4>
            <Badge
              variant="outline"
              className="rounded-full border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--brand-mid)]"
            >
              URL Based
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {documentFields.map((field) => {
              const hasValue = !!documents[field.key];

              return (
                <div key={field.key} className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-550">
                    {hasValue ? (
                      <CheckCircle className="h-3.5 w-3.5 text-[var(--brand-green)]" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    {field.label}
                  </Label>
                  <Input
                    value={documents[field.key]}
                    onChange={(event) => setDocumentValue(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-750">
            Assignments
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Coordinator Name *
              </Label>
              <Input
                required
                value={coordinatorName}
                onChange={(event) => setCoordinatorName(event.target.value)}
                placeholder="Rahul Kumar"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Assigned Tutor ID *
              </Label>
              <Input
                required
                value={assignedTutorId}
                onChange={(event) => setAssignedTutorId(event.target.value)}
                placeholder="6a15d349475d455434c93af5"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Assigned Mentor ID *
              </Label>
              <Input
                required
                value={assignedMentorId}
                onChange={(event) => setAssignedMentorId(event.target.value)}
                placeholder="66503d4a7a4e7c91d9b9a222"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Assigned Coordinator ID *
              </Label>
              <Input
                required
                value={assignedCoordinatorId}
                onChange={(event) => setAssignedCoordinatorId(event.target.value)}
                placeholder="66503d4a7a4e7c91d9b9a333"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
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
            {isSubmitting ? <ButtonLoader /> : (studentToEdit ? "Update Student" : "Save Student")}
          </Button>
        </div>
      </form>
    </div>
  );
}
