"use client";

import SectionCard from "@/components/shared/SectionCard";

export default function VisionMissionEditor() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <SectionCard title="Vision">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Our Vision</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            To make world-class, personalised education accessible to every child in India and beyond,
            regardless of location or background.
          </p>
          <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            This content is managed by the development team and cannot be edited here.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Mission">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Our Mission</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            To provide structured, mentor-led online education that genuinely improves academic outcomes
            through small batches, daily accountability, and a nurturing learning environment.
          </p>
          <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            This content is managed by the development team and cannot be edited here.
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
