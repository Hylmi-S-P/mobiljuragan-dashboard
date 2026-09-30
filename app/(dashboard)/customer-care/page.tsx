import { TicketWorkspace } from "@/components/support/TicketWorkspace";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function CustomerCarePage() {
  return (
    <>
      <ScreenHeader
        heading="Customer Care"
        subheading="Kelola pertanyaan dan keluhan customer secara terstruktur."
      />
      <TicketWorkspace />
    </>
  );
}
