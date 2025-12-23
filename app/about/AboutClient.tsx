"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AboutClient() {
  return (
    <main className="bg-background text-foreground pt-32">
      <div className="mx-auto max-w-4xl px-6 space-y-10">

        {/* ================= HERO (ALWAYS OPEN) ================= */}
        <section className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Built to Simplify Business Operations
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            TalawangPOS is a modern point of sale platform designed to help
            restaurants and cafés run faster, smarter, and more efficiently.
          </p>
        </section>

        {/* ================= ACCORDION SECTIONS ================= */}
        <Accordion title="PROBLEM">
          <p className="text-muted-foreground leading-relaxed">
            Running a food & beverage business isn’t easy. Many owners struggle
            with slow cashier systems, messy sales reports, and tools that are
            too complicated to use.
            <br /><br />
            TalawangPOS was created to solve these problems by making POS systems
            simple, fast, and reliable.
          </p>
        </Accordion>

        <Accordion title="MISSION">
          <p className="text-muted-foreground leading-relaxed">
            To empower local businesses with a point of sale system that is easy
            to use, secure, and built for daily operations—without unnecessary
            complexity.
          </p>
        </Accordion>

        <Accordion title="WHY TALAWANGPOS">
          <ul className="space-y-3 text-muted-foreground">
            <li>• Built specifically for restaurants & cafés</li>
            <li>• Easy to use for non-technical staff</li>
            <li>• Cloud-based and secure</li>
            <li>• Real-time sales and reporting</li>
            <li>• Works on any modern device</li>
          </ul>
        </Accordion>

        <Accordion title="HOW IT WORKS">
          <ol className="space-y-3 text-muted-foreground">
            <li>1. Create your business account</li>
            <li>2. Add products and staff</li>
            <li>3. Start selling instantly</li>
            <li>4. Track sales and reports in real time</li>
          </ol>
        </Accordion>

        {/* ================= SOFT CTA (NO ACCORDION) ================= */}
        <div className="rounded-xl bg-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-primary">
            Ready to simplify your business operations?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Discover how TalawangPOS can help your business grow.
          </p>
        </div>

      </div>
    </main>
  );
}

/* ================= ACCORDION COMPONENT ================= */

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
