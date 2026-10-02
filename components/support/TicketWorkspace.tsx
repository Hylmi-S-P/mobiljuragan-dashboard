"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataNotice } from "@/components/ui/DataNotice";
import { Panel } from "@/components/ui/ScreenHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { TICKET_STATUS } from "@/lib/labels";
import { SAMPLE_DATA_LABEL, SUPPORT_TICKETS, TICKET_MESSAGES } from "@/lib/mockData";
import type { TicketMessage } from "@/lib/types";

function initialOf(label: string): string {
  return label.trim().charAt(0).toUpperCase() || "?";
}

export function TicketWorkspace() {
  const firstTicketId = SUPPORT_TICKETS[0]?.id ?? "";
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(firstTicketId);
  const [messages, setMessages] = useState<Record<string, TicketMessage[]>>({
    [firstTicketId]: TICKET_MESSAGES,
  });
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword.length === 0) return SUPPORT_TICKETS;
    return SUPPORT_TICKETS.filter((ticket) =>
      [ticket.customerLabel, ticket.title, ticket.category].some((field) =>
        field.toLowerCase().includes(keyword),
      ),
    );
  }, [query]);

  const activeTicket = SUPPORT_TICKETS.find((ticket) => ticket.id === activeId) ?? null;
  const activeMessages = activeTicket ? (messages[activeTicket.id] ?? []) : [];

  function sendReply() {
    if (!activeTicket) return;
    const text = draft.trim();
    if (text.length === 0) {
      setDraftError("Balasan tidak boleh kosong.");
      return;
    }
    setDraftError(null);
    setMessages((current) => ({
      ...current,
      [activeTicket.id]: [
        ...(current[activeTicket.id] ?? []),
        { id: `m-${Date.now()}`, from: "tim", text },
      ],
    }));
    setDraft("");
  }

  return (
    <>
      <DataNotice label={SAMPLE_DATA_LABEL}>
        Belum ada tiket sungguhan, jadi daftar memakai penanda dari layar contoh. Balasan yang kamu
        kirim hanya tersimpan di sesi ini.
      </DataNotice>

      <div className="mt-4 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
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
              className="h-11 w-full rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink"
            />

            <ul className="mt-4 space-y-2">
              {filteredTickets.map((ticket) => {
                const active = ticket.id === activeId;
                return (
                  <li key={ticket.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(ticket.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-start gap-3 rounded-sm border px-3 py-3 text-left ${
                        active ? "border-teal bg-canvas" : "border-rule hover:bg-canvas"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-body font-semibold text-white"
                      >
                        {initialOf(ticket.customerLabel)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-body font-semibold text-ink">
                            {ticket.customerLabel}
                          </span>
                          <StatusChip tone={TICKET_STATUS[ticket.status].tone}>
                            {TICKET_STATUS[ticket.status].label}
                          </StatusChip>
                        </span>
                        <span className="mt-1 block truncate text-meta text-ink-soft">
                          {ticket.title}
                        </span>
                        <span className="mt-1 block text-meta text-ink-soft">{ticket.category}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {filteredTickets.length === 0 ? (
              <p className="mt-4 text-meta text-ink-soft">
                {SUPPORT_TICKETS.length === 0
                  ? "Ticket lain akan muncul di sini."
                  : "Tidak ada tiket yang cocok dengan kata kunci itu."}
              </p>
            ) : null}
          </Panel>
        </div>

        <div className="min-w-0">
          <section className="flex min-h-[520px] flex-col rounded-md border border-rule bg-surface">
            {activeTicket ? (
              <>
                <div className="flex flex-wrap items-center gap-3 border-b border-rule px-5 py-4">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-body font-semibold text-white"
                  >
                    {initialOf(activeTicket.customerLabel)}
                  </span>
                  <span className="text-body font-semibold text-ink">{activeTicket.customerLabel}</span>
                  <StatusChip tone={TICKET_STATUS[activeTicket.status].tone}>
                    {TICKET_STATUS[activeTicket.status].label}
                  </StatusChip>
                </div>

                <div className="border-b border-rule px-5 py-4">
                  <h3 className="text-body font-semibold text-ink">Informasi tiket</h3>
                  <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-micro font-bold uppercase text-ink-soft">Judul tiket</dt>
                      <dd className="mt-1 text-meta text-ink">{activeTicket.title}</dd>
                    </div>
                    <div>
                      <dt className="text-micro font-bold uppercase text-ink-soft">Jenis bantuan</dt>
                      <dd className="mt-1 text-meta text-ink">{activeTicket.category}</dd>
                    </div>
                  </dl>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  {activeMessages.length === 0 ? (
                    <div className="rounded-sm border border-rule bg-canvas px-4 py-8 text-center">
                      <p className="text-body font-semibold text-ink">Belum ada pesan</p>
                      <p className="mt-2 text-body text-ink-soft">
                        Pesan pelanggan dan balasan tim akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {activeMessages.map((message) => (
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

                <div className="border-t border-rule px-5 py-4">
                  <label htmlFor="ticket-reply" className="sr-only">
                    Tulis balasan
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="ticket-reply"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Tulis balasan..."
                      aria-invalid={Boolean(draftError)}
                      aria-describedby={draftError ? "ticket-reply-error" : undefined}
                      className="h-12 min-w-0 flex-1 rounded-sm border border-rule-strong bg-canvas px-3 text-body text-ink"
                    />
                    <Button variant="confirm" size="md" onClick={sendReply}>
                      Kirim Balasan
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
              <div className="px-5 py-8">
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
