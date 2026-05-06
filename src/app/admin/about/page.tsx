import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import StoryEditor from "@/components/about/StoryEditor";
import ValuesEditor from "@/components/about/ValuesEditor";

const tabs = [
  { value: "story", label: "Our Story" },
  { value: "values", label: "Core Values" },
];

export default function AboutPageAdmin() {
  return (
    <div className="max-w-5xl">
      <PageHeader
        title="About Page"
        description="Edit all sections of the About page"
      />
      <Tabs defaultValue="story">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
              style={
                {
                  "--tw-data-active-bg": "var(--brand-green)",
                } as React.CSSProperties
              }
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="story">
          <StoryEditor />
        </TabsContent>

        <TabsContent value="values">
          <ValuesEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
