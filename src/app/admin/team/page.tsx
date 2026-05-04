import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import LeadershipEditor from "@/components/team/LeadershipEditor";
import MentorsManager from "@/components/team/MentorsManager";

export default function TeamPageAdmin() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Team" description="Manage leadership and mentor profiles" />
      <Tabs defaultValue="leadership">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger value="leadership" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Leadership
          </TabsTrigger>
          <TabsTrigger value="mentors" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Mentors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leadership"><LeadershipEditor /></TabsContent>
        <TabsContent value="mentors"><MentorsManager /></TabsContent>
      </Tabs>
    </div>
  );
}
