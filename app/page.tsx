"use client";

import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

/* ================= HERO DATA ================= */

const heroSlides = [
  {
    title: "Modern POS System",
    highlight: "for Restaurants & Cafés",
    desc: "A fast, secure, and flexible point of sale solution to manage your daily operations.",
    bgImage: "/hero-pos.jpg",
    textColor: "text-white",
    highlightClass: "text-white",
  },
  {
    title: "Secure & Reliable",
    highlight: "Business Platform",
    desc: (
      <>
        Protect your sales data with cloud-based <br />
        security and controlled user access.
      </>
    ),
    bgImage: "/geometri-pos.jpg",
    textColor: "text-white",
    highlightClass: "text-accent",
  },
  {
    title: "Run Your Business",
    highlight: "Faster & Smarter",
    desc: "Process transactions quickly and monitor reports in real time from anywhere.",
    bgImage: "/bisnis-pos.jpg",
    textColor: "text-white",
    highlightClass: "text-white",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        {/* ================= HERO ================= */}
        <section className="relative">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".hero-prev",
              nextEl: ".hero-next",
            }}
            loop
            className="h-screen"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <HeroContent {...slide} />
              </SwiperSlide>
            ))}

            <button className="hero-prev absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur md:flex">
              <ChevronLeft />
            </button>
            <button className="hero-next absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur md:flex">
              <ChevronRight />
            </button>
          </Swiper>
        </section>

        {/* ================= VALUE (ZIG ZAG + IMAGE) ================= */}
        <section className="bg-muted py-28">
          <div className="mx-auto flex max-w-6xl flex-col gap-28 px-6">
            <ZigZagCard
              title="Secure"
              desc="Your business data is protected with enterprise-grade cloud security, encrypted transactions, and controlled user access—ensuring every sale and report stays safe."
              image="/secure.png"
              imagePosition="right"
            />

            <ZigZagCard
              title="Flexible"
              desc="Designed for restaurants and cafés of all sizes, with customizable menus, multi-outlet support, and role-based access that adapts to your workflow."
              image="/flexible.png"
              imagePosition="left"
            />

            <ZigZagCard
              title="Fast"
              desc="Lightning-fast transactions, instant order processing, and real-time analytics help your team serve customers faster and make smarter decisions."
              image="/fast.png"
              imagePosition="right"
            />
          </div>
        </section>
      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */

function HeroContent({
  title,
  highlight,
  desc,
  bgImage,
  textColor,
  highlightClass,
}: any) {
  return (
    <div
      className="relative flex h-full items-center px-6 pt-20"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className={`relative z-10 mx-auto w-full max-w-7xl ${textColor}`}>
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            {title} <span className={highlightClass}>{highlight}</span>
          </h1>

          <p className="mt-6 text-lg opacity-90">{desc}</p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-lg bg-primary px-8 py-3 font-semibold text-white">
              Request Demo
            </button>
            <button className="rounded-lg border border-white/40 px-8 py-3 font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZigZagCard({
  title,
  desc,
  image,
  imagePosition,
}: {
  title: string;
  desc: string;
  image: string;
  imagePosition: "left" | "right";
}) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2">
      {imagePosition === "left" && (
        <Image
          src={image}
          alt={title}
          width={420}
          height={320}
          className="mx-auto"
        />
      )}

      <div className="rounded-xl bg-background p-8 shadow-sm">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>
      </div>

      {imagePosition === "right" && (
        <Image
          src={image}
          alt={title}
          width={420}
          height={320}
          className="mx-auto"
        />
      )}
    </div>
  );
}
