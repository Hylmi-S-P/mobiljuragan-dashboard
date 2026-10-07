"use client";

import { useMemo, useState, useTransition } from "react";

import { replyToTicketAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { DataNotice } from "@/components/ui/DataNotice";
import { Panel } from "@/components/ui/PageLayout";
import { StatusChip } from "@/components/ui/StatusChip";
import { TICKET_STATUS } from "@/lib/labels";
import type { SupportTicketView, TicketMessageView } from "@/lib/operations";
import type { SupportTicketStatus } from "@/lib/types";

type Props = {
  initialTickets: SupportTicketView[];
  initialMessages: TicketMessageView[];
};

function initialOf(label: string): string {
  return label.trim().charAt(0).toUpperCase() || "?";
}

export function TicketWorkspace({ initialTickets, initialMessages }: Props) {
  const firstTicketId = initialTickets[0]?.id ?? "";
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(firstTicketId);
  const [messages, setMessages] = useState<TicketMessageView[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSending, startTransition] = useTransition();

  const filteredTickets = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword.length === 0) return initialTickets;
    return initialTickets.filter((ticket) =>
      [ticket.customerLabel, ticket.title, ticket.category].some((field) =>
        field.toLowerCase().includes(keyword),
      ),
    );
  }, [query, initialTickets]);

  const activeTicket = initialTickets.find((ticket) => ticket.id === activeId) ?? null;

  function sendReply() {
    if (!activeTicket) return;
    const text = draft.trim();
    if (text.length === 0) {
      setDraftError("Balasan tidak boleh kosong.");
      return;
    }

    setDraftError(null);
    const optimisticMessage: TicketMessageView = {
      id: `optimistic-${Date.now()}`,
      from: "tim",
      text,
      sentAt: new Date().toISOString(),
      senderName: "Tim MobilJuragan",
    };

    // Balasan tampil lebih dulu, lalu dikirim ke Express lewat Server Action.
    setMessages((current) => [...current, optimisticMessage]);
    setDraft("");

    startTransition(async () => {
      const result = await replyToTicketAction(activeTicket.id, text);
      if (result.success) {
        setNotice(result.message ?? "Balasan terkirim.");
      } else {
        // Gagal kirim: tarik kembali pesan optimistis supaya tidak menyesatkan.
        setMessages((current) => current.filter((message) => message.id !== optimisticMessage.id));
        setDraft(text);
        setDraftError(result.message ?? "Balasan gagal dikirim ke server.");
      }
    });
  }

  return (
    <>
      <DataNotice label="Meja kerja tiket">
        Balasan yang dikirim dari sini tersimpan pada tiketnya dan mengubah status tiket menjadi
        menunggu pelanggan.
      </DataNotice>

      {notice ? (
        <p className="mt-3 rounded-sm border border-rule bg-surface px-3 py-2 text-meta text-ink">
          {notice}
        </p>
      ) : null}

      <div className="mt-3 grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="min-w-0">
          <Panel title="Tiket masuk">
            <label htmlFor="ticket-search" className="sr-only">
              Cari tiket
            </label>
            <input
              id="ticket-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari tiket"
              className="h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
            />

            <ul className="mt-3 space-y-1.5">
              {filteredTickets.map((ticket) => {
                const active = ticket.id === activeId;
                const status = TICKET_STATUS[ticket.status as SupportTicketStatus];
                return (
                  <li key={ticket.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(ticket.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-start gap-2.5 rounded-sm border px-2.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
                        active ? "border-teal bg-canvas" : "border-rule hover:bg-canvas"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-body font-semibold text-white"
                      >
                        {initialOf(ticket.customerLabel)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-body font-semibold text-ink">
                            {ticket.customerLabel}
                          </span>
                          <StatusChip tone={status.tone}>{status.label}</StatusChip>
                        </span>
                        <span className="mt-1 block truncate text-meta text-ink-soft">
                          {ticket.title}
                        </span>
                        <span className="mt-1 block text-meta text-ink-soft">
                          {ticket.category} · {ticket.messageCount} pesan
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {filteredTickets.length === 0 ? (
              <p className="mt-3 text-meta text-ink-soft">
                {initialTickets.length === 0
                  ? "Belum ada tiket yang masuk dari pelanggan."
                  : "Tidak ada tiket yang cocok dengan kata kunci itu."}
              </p>
            ) : null}
          </Panel>
        </div>

        <div className="min-w-0">
          <section className="flex min-h-[460px] flex-col rounded-md border border-rule bg-surface">
            {activeTicket ? (
              <>
                <div className="flex flex-wrap items-center gap-2.5 border-b border-rule px-4 py-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-body font-semibold text-white"
                  >
                    {initialOf(activeTicket.customerLabel)}
                  </span>
                  <span className="text-body font-semibold text-ink">
                    {activeTicket.customerLabel}
                  </span>
                  <StatusChip tone={TICKET_STATUS[activeTicket.status as SupportTicketStatus].tone}>
                    {TICKET_STATUS[activeTicket.status as SupportTicketStatus].label}
                  </StatusChip>
                </div>

                <div className="border-b border-rule px-4 py-3">
                  <h3 className="text-body font-semibold text-ink">Informasi tiket</h3>
                  <dl className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <dt className="text-micro font-bold uppercase text-ink-soft">Judul tiket</dt>
                      <dd className="mt-1 text-meta text-ink">{activeTicket.title}</dd>
                    </div>
                    <div>
                      <dt className="text-micro font-bold uppercase text-ink-soft">
                        Jenis bantuan
                      </dt>
                      <dd className="mt-1 text-meta text-ink">{activeTicket.category}</dd>
                    </div>
                    <div>
                      <dt className="text-micro font-bold uppercase text-ink-soft">Nomor tiket</dt>
                      <dd className="mt-1 text-meta text-ink">{activeTicket.ticketNumber}</dd>
                    </div>
                  </dl>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                  {messages.length === 0 ? (
                    <div className="rounded-sm border border-rule bg-canvas px-4 py-6 text-center">
                      <p className="text-body font-semibold text-ink">Belum ada pesan</p>
                      <p className="mt-2 text-body text-ink-soft">
                        Pesan pelanggan dan balasan tim akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {messages.map((message) => (
                        <li
                          key={message.id}
                          className={`max-w-[80%] rounded-md border px-4 py-3 text-body ${
                            message.from === "tim"
                              ? "ml-auto border-teal/40 bg-canvas text-ink"
                              : "border-rule bg-surface text-ink"
                          }`}
                        >
                          <span className="block text-micro font-semibold uppercase text-ink-soft">
                            {message.from === "tim" ? "Tim MobilJuragan" : "Pelanggan"}
                          </span>
                          <span className="mt-1 block">{message.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-rule px-4 py-3">
                  <label htmlFor="ticket-reply" className="sr-only">
                    Tulis balasan
                  </label>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      id="ticket-reply"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Tulis balasan..."
                      aria-invalid={Boolean(draftError)}
                      aria-describedby={draftError ? "ticket-reply-error" : undefined}
                      className="h-11 min-w-0 flex-1 rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                    <Button variant="confirm" size="md" onClick={sendReply} disabled={isSending}>
                      {isSending ? "Mengirim..." : "Kirim Balasan"}
                    </Button>
                  </div>
                  {draftError ? (
                    <p id="ticket-reply-error" className="mt-2 text-meta text-danger">
                      {draftError}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="px-4 py-6">
                <p className="text-body font-semibold text-ink">Belum ada tiket dipilih</p>
                <p className="mt-2 text-body text-ink-soft">
                  Pilih tiket di daftar kiri untuk membaca percakapan dan membalas.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
