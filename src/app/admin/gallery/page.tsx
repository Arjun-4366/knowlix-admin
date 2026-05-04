import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import PhotosManager from "@/components/gallery/PhotosManager";
import VideosManager from "@/components/gallery/VideosManager";

export default function GalleryPageAdmin() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Gallery" description="Manage photos and videos" />
      <Tabs defaultValue="photos">
        <TabsList className="mb-6 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger value="photos" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Photos
          </TabsTrigger>
          <TabsTrigger value="videos" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos"><PhotosManager /></TabsContent>
        <TabsContent value="videos"><VideosManager /></TabsContent>
      </Tabs>
    </div>
  );
}
