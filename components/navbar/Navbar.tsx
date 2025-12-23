"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-black/10 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="/"
          className={`text-xl font-bold ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          Talawang<span className="text-primary">POS</span>
        </Link>

        {/* Menu */}
        <nav className="hidden gap-8 md:flex">
          {["Home", "Pricing", "About"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`text-sm font-medium transition ${
                scrolled
                  ? "text-black/70 hover:text-black"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Login */}
        <Link
          href="/login"
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            scrolled
              ? "bg-primary text-white"
              : "border border-white/40 text-white hover:bg-white/10"
          }`}
        >
          Login
        </Link>
      </div>
    </header>
  );
}
