"use client"
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import StoryEditor from "@/components/about/StoryEditor";
import ValuesEditor from "@/components/about/ValuesEditor";
import { useGetAbout } from "@/querys/admin/aboutQuery";
import { IAboutPayload } from "@/types/admin/about";
import Loader from "@/components/shared/Loader";

const tabs = [
  { value: "story", label: "Our Story" },
  { value: "values", label: "Core Values" },
];

const DEFAULT_ABOUT: IAboutPayload = {
  mainPageTag: "",
  mainPageTitle: "",
  mainPageSubtitle: "",
  stats: [],
  results: [],
  whyChooseKnowlix: [],
  yearBaseJourney: [],
  aboutHighlights: [],
};

export default function AboutPageAdmin() {
  const { data: aboutData, isLoading } = useGetAbout();
  const [form, setForm] = useState<IAboutPayload>(DEFAULT_ABOUT);

  useEffect(() => {
    if (aboutData) {
      const sanitized = { ...aboutData };
      if (sanitized.yearBaseJourney) {
        sanitized.yearBaseJourney = sanitized.yearBaseJourney.map((j: any) => ({
          ...j,
          description: Array.isArray(j.description)
            ? j.description
            : typeof j.description === "string" && j.description
              ? [j.description]
              : [],
        }));
      }
      setForm(sanitized);
    }
  }, [aboutData]);

  if (isLoading) {
    return <Loader text="Fetching About Page Data..." />;
  }

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
        <TabsContent value="story" forceMount className="data-[state=inactive]:hidden">
          <StoryEditor form={form} setForm={setForm} />
        </TabsContent>

        <TabsContent value="values" forceMount className="data-[state=inactive]:hidden">
          <ValuesEditor form={form} setForm={setForm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
