"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppFABProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppFAB({
  phoneNumber = "628992221537",
  defaultMessage = "Halo Dinasti Musik, saya ingin konsultasi seputar instrumen musik.",
}: WhatsAppFABProps) {
  const [isHovered, setIsHovered] = useState(false);

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <aside
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 print:hidden"
      aria-label="Kontak WhatsApp"
    >
      {/* Tooltip on hover */}
      <div
        className={`px-3 py-1.5 rounded-full bg-black/85 text-white text-[11px] font-medium tracking-wide shadow-lg border border-white/10 pointer-events-none transition-all duration-300 hidden sm:flex items-center gap-1.5 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <span>Chat Tim Musik</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
      </div>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle Online Pulse Ring */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-[#080F0F] rounded-full" />

        {/* WhatsApp Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="transition-transform group-hover:rotate-6 duration-300"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.476-.15-.677.15-.2.301-.776.98-.952 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.101-.201.051-.376-.025-.526-.075-.151-.677-1.632-.927-2.233-.244-.585-.492-.505-.676-.514l-.577-.01c-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.109.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.9.119.58-.088 1.782-.728 2.032-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z" />
          <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.928.547 3.731 1.498 5.27L2 22l4.872-1.46c1.488.887 3.218 1.396 5.132 1.396 5.518 0 10.004-4.486 10.004-10.004C22.008 6.486 17.522 2 12.004 2zm0 18.293c-1.72 0-3.32-.51-4.664-1.39l-.334-.219-2.902.87.886-2.831-.24-.356c-.982-1.455-1.542-3.197-1.542-5.063 0-4.572 3.722-8.293 8.294-8.293 4.572 0 8.294 3.721 8.294 8.293 0 4.572-3.722 8.293-8.294 8.293z" />
        </svg>
      </a>
    </aside>
  );
}

export default WhatsAppFAB;
