"use client";

import SectionCard from "@/components/shared/SectionCard";

export default function FounderEditor() {
  return (
    <SectionCard title="Founder Message" description="Displayed on the About page">
      <div className="flex gap-6">
        {/* Avatar placeholder */}
        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
          <span className="text-3xl">👤</span>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-base font-semibold text-gray-800">Arjun Mehta</p>
            <p className="text-sm text-green-700 font-medium">Founder &amp; CEO</p>
            <p className="text-xs text-gray-400">12+ years in education</p>
          </div>

          <blockquote className="border-l-4 border-green-400 pl-4 italic text-sm text-gray-600 leading-relaxed">
            "Every child is capable of excellence. Our job is to create the environment where that
            excellence can naturally emerge."
          </blockquote>

          <p className="text-sm text-gray-600 leading-relaxed">
            Arjun founded Knowlix after witnessing firsthand how the lack of personalised attention was
            holding brilliant students back. With a background in education technology and a passion for
            child development, he built Knowlix to bridge this gap.
          </p>

          <p className="text-xs text-gray-400">
            B.Tech IIT Mumbai &nbsp;·&nbsp; M.Ed Educational Leadership &nbsp;·&nbsp; Former Head of Curriculum, EduFirst India
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        This content is managed by the development team and cannot be edited here.
      </div>
    </SectionCard>
  );
}
