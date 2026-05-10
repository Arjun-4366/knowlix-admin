"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetApplications,
  useUpdateApplicationStatus,
  useDeleteApplication,
  useGetCareersAdmin,
} from "@/querys/careerQuery";
import { ICareerApplication, ApplicationStatus } from "@/types/career";
import { useConfirmation } from "@/context/ConfirmationContext";
import Loader from "@/components/shared/Loader";
import { format } from "date-fns";

const statusConfig: Record<
  ApplicationStatus,
  { bg: string; text: string; icon: any }
> = {
  New: { bg: "bg-blue-50", text: "text-blue-600", icon: AlertCircle },
  Reviewing: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
  Shortlisted: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle },
  Rejected: { bg: "bg-red-50", text: "text-red-600", icon: XCircle },
  Hired: { bg: "bg-purple-50", text: "text-purple-600", icon: CheckCircle },
};

export default function ApplicationsList() {
  const { data: appData, isLoading: loadingApps } = useGetApplications();
  const { data: careerData, isLoading: loadingCareers } = useGetCareersAdmin();
  const { mutateAsync: updateStatus } = useUpdateApplicationStatus();
  const { mutateAsync: deleteApp } = useDeleteApplication();
  const { confirm } = useConfirmation();

  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<ICareerApplication | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loadingApps || loadingCareers)
    return <Loader text="Loading Applications..." />;

  const applications = appData?.applications || [];
  const careers = careerData?.careers || [];

  const getCareerTitle = (id: string) => {
    return careers.find((c) => c.id === id)?.title || "Unknown Position";
  };

  const filtered = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      getCareerTitle(a.careerId).toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    confirm({
      title: "Remove Application",
      message:
        "Are you sure you want to delete this candidate's application? This cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteApp(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleStatusUpdate = async (id: string, status: ApplicationStatus) => {
    try {
      await updateStatus({ id, status });
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (app: ICareerApplication) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by candidate name, email, or job title…"
          className="pl-12 h-12 rounded-2xl border-gray-100 bg-white shadow-sm focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((app) => {
              const conf = statusConfig[app.status] || statusConfig.New;
              const StatusIcon = conf.icon;
              return (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors text-xs">
                        {app.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {app.name}
                        </p>
                        <p className="text-[10px] text-gray-400">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {getCareerTitle(app.careerId)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {app.appliedAt
                      ? format(new Date(app.appliedAt), "MMM dd, yyyy")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${conf.bg} ${conf.text} text-[10px] font-bold uppercase tracking-wider`}
                    >
                      <StatusIcon className="w-2.5 h-2.5" />
                      {app.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openModal(app)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-20 text-gray-400 italic font-medium"
                >
                  No candidate applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {selectedApp.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 leading-tight">
                    {selectedApp.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                    Job:{" "}
                    <span className="text-blue-600 font-semibold">
                      {getCareerTitle(selectedApp.careerId)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      <Mail className="w-3 h-3 text-blue-500" /> Email
                    </div>
                    <p className="text-sm text-gray-700">{selectedApp.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      <Phone className="w-3 h-3 text-blue-500" /> Phone
                    </div>
                    <p className="text-sm text-gray-700">
                      {selectedApp.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    <FileText className="w-3 h-3 text-blue-500" /> Applicant
                    Message
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100 min-h-[120px] italic">
                    "
                    {selectedApp.message || "No introductory message provided."}
                    "
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4" /> View Resume (PDF)
                  </a>
                </div>
              </div>

              <div className="space-y-5 md:border-l md:border-gray-100 md:pl-6">
                <div className="space-y-3">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Update Status
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {(
                      [
                        "New",
                        "Reviewing",
                        "Shortlisted",
                        "Rejected",
                        "Hired",
                      ] as const
                    ).map((status) => {
                      const isActive = selectedApp.status === status;
                      const conf = statusConfig[status];
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            handleStatusUpdate(selectedApp.id, status)
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            isActive
                              ? `${conf.bg} ${conf.text} border-current`
                              : "bg-white text-gray-400 border-gray-50 hover:border-gray-200 hover:text-gray-600"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
