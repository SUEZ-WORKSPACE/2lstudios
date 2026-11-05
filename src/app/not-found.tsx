import type { Metadata } from "next";
import { LostScene } from "@/components/LostScene";

export const metadata: Metadata = {
  title: "Cena não encontrada | 2L Studio",
  robots: { index: false },
};

export default function NotFound() {
  return <LostScene />;
}
