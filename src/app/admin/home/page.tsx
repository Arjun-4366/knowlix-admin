import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import HeroEditor from "@/components/home/HeroEditor";
import StatsEditor from "@/components/home/StatsEditor";
import WhyParentsEditor from "@/components/home/WhyParentsEditor";
import TestimonialsEditor from "@/components/home/TestimonialsEditor";
import FaqEditor from "@/components/home/FaqEditor";
import CtaEditor from "@/components/home/CtaEditor";

export default function HomePageAdmin() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Home Page" description="Edit every section of the Knowlix home page" />
      <Tabs defaultValue="hero">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {["hero", "stats", "why-parents", "testimonials", "faq", "cta"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="rounded-lg text-sm capitalize data-[state=active]:text-white px-3 py-1.5 data-[state=active]:shadow-none" style={{ "--tw-data-active-bg": "var(--brand-green)" } as React.CSSProperties}>
              {tab === "why-parents" ? "Why Parents" : tab === "cta" ? "Final CTA" : tab === "testimonials" ? "Reviews" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="hero"><HeroEditor /></TabsContent>
        <TabsContent value="stats"><StatsEditor /></TabsContent>
        <TabsContent value="why-parents"><WhyParentsEditor /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsEditor /></TabsContent>
        <TabsContent value="faq"><FaqEditor /></TabsContent>
        <TabsContent value="cta"><CtaEditor /></TabsContent>
      </Tabs>
    </div>
  );
}
