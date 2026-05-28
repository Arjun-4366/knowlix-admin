"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import PhotosManager from "@/components/gallery/PhotosManager";
import VideosManager from "@/components/gallery/VideosManager";
import { useGetGallery } from "@/querys/admin/galleryQuery";
import Loader from "@/components/shared/Loader";

export default function GalleryPageAdmin() {
  const { data, isLoading } = useGetGallery();

  if (isLoading) return <Loader text="Loading Gallery Data..." />;

  const galleryItems = data?.gallery || [];

  return (
    <div className="max-w-6xl">
      <PageHeader title="Gallery Management" description="Centralized management for your platform's visual assets" />

      <Tabs defaultValue="photos">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="bg-white/50 backdrop-blur-md border border-gray-100 rounded-2xl p-1.5 shadow-sm">
            <TabsTrigger
              value="photos"
              className="rounded-xl text-xs font-black uppercase tracking-widest px-6 py-2.5 data-[state=active]:bg-[#16a34a] data-[state=active]:text-white transition-all"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="rounded-xl text-xs font-black uppercase tracking-widest px-6 py-2.5 data-[state=active]:bg-[#16a34a] data-[state=active]:text-white transition-all"
            >
              Videos
            </TabsTrigger>
          </TabsList>


        </div>

        <TabsContent value="photos" className="mt-0 outline-none">
          <PhotosManager initialData={galleryItems.filter(i => i.mediaType === "image")} />
        </TabsContent>
        <TabsContent value="videos" className="mt-0 outline-none">
          <VideosManager initialData={galleryItems.filter(i => i.mediaType === "video")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
