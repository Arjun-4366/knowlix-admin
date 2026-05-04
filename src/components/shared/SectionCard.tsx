interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ title, description, children, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && (
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--brand-dark)" }}
            >
              {title}
            </h2>
          )}
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
