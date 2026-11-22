import { PageHeader } from "@/components/ui/PageHeader";
import { ReportForm } from "./ReportForm";

export default function ReportIncidentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Report an incident"
        subtitle="If someone needs help now, call 112 first. This form shares details with participating responders."
      />
      <ReportForm />
    </div>
  );
}
