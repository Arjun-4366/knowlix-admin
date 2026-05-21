"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import HeroEditor from "@/components/home/HeroEditor";
import StatsEditor from "@/components/home/StatsEditor";
import WhyParentsEditor from "@/components/home/WhyParentsEditor";
import FaqEditor from "@/components/home/FaqEditor";
import { useGetAbout } from "@/querys/aboutQuery";
import { IAboutPayload } from "@/types/about";
import Loader from "@/components/shared/Loader";

const DEFAULT_FORM: IAboutPayload = {
  mainPageTag: "",
  mainPageTitle: "",
  mainPageSubtitle: "",
  mainPageFeatureImage: "",
  stats: [],
  results: [],
  whyChooseKnowlix: Array(6).fill({ title: "", subtitle: "", icon: "GraduationCap" }),
  yearBaseJourney: [],
};

export default function HomePageAdmin() {
  const { data: homeData, isLoading } = useGetAbout();
  const [form, setForm] = useState<IAboutPayload>(DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (homeData) {
      const features = [...(homeData.whyChooseKnowlix || [])];
      while (features.length < 6) {
        features.push({ title: "", subtitle: "", icon: "GraduationCap" });
      }
      setForm({ ...homeData, whyChooseKnowlix: features.slice(0, 6) });
    }
  }, [homeData]);

  if (isLoading) {
    return <Loader text="Loading Home Page Data..." />;
  }

  const tabs = [
    { id: "hero",       label: "Hero" },
    { id: "stats",      label: "Stats" },
    { id: "why-parents", label: "Why Parents" },
    { id: "faq",        label: "FAQ" },
  ];

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Home Page"
        description="Edit every section of the Knowlix home page"
      />
      <Tabs defaultValue="hero" onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="hero" forceMount className="data-[state=inactive]:hidden">
          <HeroEditor form={form} setForm={setForm} />
        </TabsContent>
        <TabsContent value="stats" forceMount className="data-[state=inactive]:hidden">
          <StatsEditor form={form} setForm={setForm} />
        </TabsContent>
        <TabsContent value="why-parents" forceMount className="data-[state=inactive]:hidden">
          <WhyParentsEditor form={form} setForm={setForm} />
        </TabsContent>
        <TabsContent value="faq" forceMount className="data-[state=inactive]:hidden">
          <FaqEditor active={activeTab === "faq"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
