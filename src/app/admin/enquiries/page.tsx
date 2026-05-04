import PageHeader from "@/components/shared/PageHeader";
import EnquiriesList from "@/components/enquiries/EnquiriesList";

export default function EnquiriesPage() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Enquiries" description="Contact form submissions from parents and students" />
      <EnquiriesList />
    </div>
  );
}
