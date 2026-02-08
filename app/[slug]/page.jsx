import FooterSeoPageClient from "./FooterSeoPageClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const properties = await getAllProperties();

  // 🔥 FIRESTORE TIMESTAMP SAFE CONVERT
  const safeProperties = properties.map((p) => ({
    ...p,
    timestampCreate: p.timestampCreate ?? null,
  }));

  return (
    <FooterSeoPageClient
      params={params}
      properties={safeProperties}
    />
  );
}
