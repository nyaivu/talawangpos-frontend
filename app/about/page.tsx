import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About TalawangPOS – Modern POS for Restaurants & Cafés",
  description:
    "Learn more about TalawangPOS, a modern point of sale platform built to simplify business operations for restaurants and cafés.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutClient />
    </>
  );
}
