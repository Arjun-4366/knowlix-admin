"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Info, ArrowLeft } from "lucide-react";
import { useGetStudent } from "@/querys/tutor/studentQuery";
import { Button } from "@/components/ui/button";
import TutorStudentDetails from "@/components/tutor/TutorStudentDetails";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function TutorStudentDetailsContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: response, isLoading } = useGetStudent(id);
  const student = response || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Info className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Student Not Found</h3>
          <p className="text-sm text-slate-500 mt-1">We couldn&apos;t find a student matching ID &quot;{id}&quot;.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/tutor/students")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-655 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Roster
        </Button>
      </div>
    );
  }

  return (
    <TutorStudentDetails
      student={student}
      onBack={() => router.push("/tutor/students")}
    />
  );
}

export default function TutorStudentDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TutorStudentDetailsContent params={params} />
    </Suspense>
  );
}
