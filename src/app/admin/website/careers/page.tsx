import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import PositionsManager from "@/components/careers/PositionsManager";
import ApplicationsList from "@/components/careers/ApplicationsList";

export default function CareersPageAdmin() {
  return (
    <div className="max-w-6xl">
      <PageHeader title="Careers" description="Manage open positions and review applications" />
      <Tabs defaultValue="positions">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger value="positions" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Open Positions
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Applications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="positions"><PositionsManager /></TabsContent>
        <TabsContent value="applications"><ApplicationsList /></TabsContent>
      </Tabs>
    </div>
  );
}
