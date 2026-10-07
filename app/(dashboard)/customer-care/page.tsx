import type { Metadata } from "next";
import { TicketWorkspace } from "@/components/support/TicketWorkspace";
import { getSupportTickets, getTicketMessages } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Customer Care | MobilJuragan",
  description:
    "Pusat penanganan pertanyaan dan keluhan pelanggan MobilJuragan Merauke beserta riwayat percakapan tim.",
};

// Percakapan berubah setiap ada balasan baru, jadi data diambil segar tiap request.
export const dynamic = "force-dynamic";

export default async function CustomerCarePage() {
  const tickets = await getSupportTickets();
  const firstTicket = tickets[0];
  const messages = firstTicket ? await getTicketMessages(firstTicket.id) : [];

  return <TicketWorkspace initialTickets={tickets} initialMessages={messages} />;
}
