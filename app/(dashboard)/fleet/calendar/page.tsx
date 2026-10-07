import type { Metadata } from "next";
import { Panel } from "@/components/ui/PageLayout";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { formatDateRange } from "@/lib/format";
import { VEHICLE_STATUS } from "@/lib/labels";
import { getFleetCalendar } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Kalender Armada | MobilJuragan",
  description:
    "Riwayat ketersediaan dan jadwal sewa aktif sembilan unit armada MobilJuragan Merauke.",
};

// Jadwal sewa berubah mengikuti pemesanan aktif, jadi data diambil segar tiap request.
export const dynamic = "force-dynamic";

function countDays(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
}

export default async function FleetCalendarPage() {
  const calendar = await getFleetCalendar();

  return (
    <Panel>
      <Table caption="Kalender ketersediaan unit armada">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="w-[325px]">Kendaraan</TableHeaderCell>
            <TableHeaderCell className="w-[255px]">Tanggal</TableHeaderCell>
            <TableHeaderCell className="w-[170px]">Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calendar.fleet.map((vehicle) => {
            // Satu unit bisa punya beberapa jadwal; yang ditampilkan jadwal terdekat.
            const schedule = vehicle.schedules[0];
            return (
              <TableRow key={vehicle.id}>
                <TableCell className="text-left font-medium">
                  {vehicle.name} <span className="text-ink-soft">· {vehicle.plate}</span>
                </TableCell>
                <TableCell className={schedule ? "text-ink" : "text-ink-soft"}>
                  {schedule
                    ? formatDateRange(
                        schedule.startDateTime,
                        schedule.endDateTime,
                        countDays(schedule.startDateTime, schedule.endDateTime),
                      )
                    : "Belum ada jadwal"}
                </TableCell>
                <TableCell>
                  <StatusChip tone={VEHICLE_STATUS[vehicle.status].tone}>
                    {VEHICLE_STATUS[vehicle.status].label}
                  </StatusChip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Panel>
  );
}
