import { useState } from "react";
import { X, FileText, CheckCircle, Upload } from "lucide-react";
import { Student } from "./StudentStats";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddStudentFormProps {
  onSubmit: (student: Omit<Student, "id">) => void;
  onClose: () => void;
}

export default function AddStudentForm({ onSubmit, onClose }: AddStudentFormProps) {
  // Student Details State
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [location, setLocation] = useState("");
  const [courseType, setCourseType] = useState("Online School");
  const [courseName, setCourseName] = useState("");
  const [packageSelection, setPackageSelection] = useState("3 Months");
  const [customPackageDuration, setCustomPackageDuration] = useState("");

  // Document Submission State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

  // Administrative Details State
  const [subjectTutor, setSubjectTutor] = useState("Dr. Ramesh Prasad");
  const [mentorSalesBro, setMentorSalesBro] = useState("Sarah Jenkins");
  const [coordinatorName, setCoordinatorName] = useState("David Miller");
  const [admissionStatus, setAdmissionStatus] = useState("Pending Approval");

  const requiredDocs = [
    "Birth Certificate",
    "Transfer Certificate",
    "Previous Academic Records",
    "Identification Documents",
  ];

  const handleMockUpload = (doc: string) => {
    const sanitizedDoc = doc.toLowerCase().replace(/\s+/g, "_");
    setUploadedDocs((prev) => ({
      ...prev,
      [doc]: `${sanitizedDoc}_submission.pdf`,
    }));
  };

  const handleRemoveDoc = (doc: string) => {
    setUploadedDocs((prev) => {
      const updated = { ...prev };
      delete updated[doc];
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !studentName ||
      !parentName ||
      !location ||
      !courseName ||
      !subjectTutor ||
      !mentorSalesBro ||
      !coordinatorName
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const packageText =
      packageSelection === "Custom Package"
        ? `Custom (${customPackageDuration || "0"} Months)`
        : packageSelection;

    onSubmit({
      name: studentName,
      parentName,
      grade,
      location,
      courseType,
      courseName,
      subjectTutor,
      mentorSalesBro,
      packageSelection: packageText,
      customPackageDuration:
        packageSelection === "Custom Package" ? customPackageDuration : undefined,
      documentsSubmitted: Object.keys(uploadedDocs),
      coordinatorName,
      admissionStatus,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Add New Student</h3>
          <p className="text-xs text-slate-450 mt-0.5">
            Register a new student and upload admission files.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto max-h-[80vh] p-6 space-y-6 divide-y divide-slate-100"
      >
        {/* Section 1: Student Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-750 uppercase tracking-wider">
            Student Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Student Name *</Label>
              <Input
                type="text"
                required
                placeholder="Enter student's full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Parent Name *</Label>
              <Input
                type="text"
                required
                placeholder="Enter parent's full name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Class / Grade *</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Grade 1",
                    "Grade 2",
                    "Grade 3",
                    "Grade 4",
                    "Grade 5",
                    "Grade 6",
                    "Grade 7",
                    "Grade 8",
                    "Grade 9",
                    "Grade 10",
                    "Grade 11",
                    "Grade 12",
                  ].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Place / Location *</Label>
              <Input
                type="text"
                required
                placeholder="e.g. Bangalore, IN"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Course Type *</Label>
              <Select value={courseType} onValueChange={setCourseType}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Select Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online School">Online School</SelectItem>
                  <SelectItem value="Online Tuition">Online Tuition</SelectItem>
                  <SelectItem value="Hybrid Learning">Hybrid Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Course Name *</Label>
              <Input
                type="text"
                required
                placeholder="e.g. Mathematics, Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Package Selection *</Label>
              <Select value={packageSelection} onValueChange={setPackageSelection}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="2 Months">2 Months</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="Custom Package">Custom Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {packageSelection === "Custom Package" && (
              <div className="space-y-1.5 animate-in slide-in-from-top-1">
                <Label className="text-xs font-semibold text-slate-550">
                  Custom Package Duration (Months) *
                </Label>
                <Input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter months (e.g. 9)"
                  value={customPackageDuration}
                  onChange={(e) => setCustomPackageDuration(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Parent Document Submission */}
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-750 uppercase tracking-wider">
              Parent Document Submission
            </h4>
            <Badge
              variant="outline"
              className="text-[10px] bg-[var(--brand-light-green)] text-[var(--brand-mid)] px-2 py-0.5 rounded-full border border-[var(--brand-light)]/20 font-bold uppercase"
            >
              Admission Required
            </Badge>
          </div>
          <p className="text-xs text-slate-500 italic mt-0.5">
            Required files for Online School Admission. Click &apos;Upload&apos; to simulate
            file submission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocs.map((doc) => {
              const isUploaded = !!uploadedDocs[doc];
              return (
                <div
                  key={doc}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isUploaded
                      ? "border-[var(--brand-green)]/40 bg-[var(--brand-light-green)]/10"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <FileText
                      className={`w-5 h-5 flex-shrink-0 ${
                        isUploaded ? "text-[var(--brand-green)]" : "text-slate-400"
                      }`}
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-700 truncate">{doc}</p>
                      <p className="text-[10px] text-slate-450 truncate mt-0.5">
                        {isUploaded ? uploadedDocs[doc] : "No document uploaded"}
                      </p>
                    </div>
                  </div>

                  {isUploaded ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] font-bold text-[var(--brand-green)] flex items-center gap-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc)}
                        className="text-[10px] text-red-505 hover:text-red-700 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleMockUpload(doc)}
                      className="h-8 rounded-lg bg-white border border-slate-200 hover:border-[var(--brand-green)]/40 text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Assignments & Administrative Details */}
        <div className="pt-5 space-y-4">
          <h4 className="text-sm font-bold text-slate-750 uppercase tracking-wider">
            Assignments & Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Academic Coordinator *
              </Label>
              <Select value={coordinatorName} onValueChange={setCoordinatorName}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Academic Coordinator" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Dr. Ramesh Prasad",
                    "Amit Shah",
                    "Sarah Jenkins",
                    "David Miller",
                    "Ananya Roy",
                  ].map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Subject Tutor *</Label>
              <Select value={subjectTutor} onValueChange={setSubjectTutor}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Subject Tutor" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Dr. Ramesh Prasad",
                    "Amit Shah",
                    "Sarah Jenkins",
                    "David Miller",
                    "Ananya Roy",
                  ].map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">
                Mentor - Sales Bro *
              </Label>
              <Select value={mentorSalesBro} onValueChange={setMentorSalesBro}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Mentor - Sales Bro" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Dr. Ramesh Prasad",
                    "Amit Shah",
                    "Sarah Jenkins",
                    "David Miller",
                    "Ananya Roy",
                  ].map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-550">Admission Status *</Label>
              <Select value={admissionStatus} onValueChange={setAdmissionStatus}>
                <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  <SelectValue placeholder="Admission Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="pt-5 flex justify-end gap-3 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-5 py-2.5 text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl shadow-md shadow-green-600/10"
          >
            Save Student Details
          </Button>
        </div>
      </form>
    </div>
  );
}
