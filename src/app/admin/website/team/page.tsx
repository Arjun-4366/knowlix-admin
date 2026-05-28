"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import LeadershipEditor from "@/components/team/LeadershipEditor";
import { useGetTeam } from "@/querys/admin/teamQuery";
import Loader from "@/components/shared/Loader";

export default function TeamPageAdmin() {
  const { data: teamData, isLoading } = useGetTeam();
  const [activeTab, setActiveTab] = useState("Leadership");

  if (isLoading) return <Loader text="Fetching Team Members..." />;

  const groupedData = teamData?.data || {
    Leadership: [],
    Advisory: [],
    "Core Team": [],
    Mentor: [],
  };

  return (
    <div className="max-w-5xl">
      <PageHeader title="Team Management" description="Manage profiles across Leadership, Advisory, Core Team, and Mentors" />

      <Tabs defaultValue="Leadership" onValueChange={(v) => setActiveTab(v)}>
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {["Leadership", "Advisory", "Core Team", "Mentor"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:bg-[#16a34a]"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Leadership">
          <LeadershipEditor initialMembers={groupedData.Leadership} category="Leadership" />
        </TabsContent>
        <TabsContent value="Advisory">
          <LeadershipEditor initialMembers={groupedData.Advisory} category="Advisory" />
        </TabsContent>
        <TabsContent value="Core Team">
          <LeadershipEditor initialMembers={groupedData["Core Team"]} category="Core Team" />
        </TabsContent>
        <TabsContent value="Mentor">
          <LeadershipEditor initialMembers={groupedData.Mentor} category="Mentor" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
