import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import OnlineSchoolEditor from "@/components/courses/OnlineSchoolEditor";
import OnlineTuitionEditor from "@/components/courses/OnlineTuitionEditor";

export default function CoursesPageAdmin() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Courses" description="Manage Online School and Online Tuition content" />
      <Tabs defaultValue="school">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger value="school" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Online School
          </TabsTrigger>
          <TabsTrigger value="tuition" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Online Tuition
          </TabsTrigger>
        </TabsList>
        <TabsContent value="school"><OnlineSchoolEditor /></TabsContent>
        <TabsContent value="tuition"><OnlineTuitionEditor /></TabsContent>
      </Tabs>
    </div>
  );
}
