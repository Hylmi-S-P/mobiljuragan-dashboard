import type { Metadata } from "next";
import { VehicleCatalogTable } from "@/components/fleet/VehicleCatalogTable";
import { getAllVehicles } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Katalog Armada | MobilJuragan",
  description:
    "Katalog resmi armada MobilJuragan Merauke beserta spesifikasi, plat nomor, dan ketersediaan unit.",
};

// Daftar armada harus mengikuti kondisi terkini di MariaDB, jadi dirender ulang tiap request.
export const dynamic = "force-dynamic";

export default async function FleetCatalogPage() {
  const vehicles = await getAllVehicles();

  return <VehicleCatalogTable initialVehicles={vehicles} />;
}
