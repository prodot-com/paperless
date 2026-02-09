"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";

const Landing = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* Subtle SVG Background - Refined Dot Matrix */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-white/70 border-b border-neutral-100 sticky top-0">
        <div className="flex items-center gap-3 group cursor-pointer">
          <Note className="text-3xl"/>
          <span className="text-xl font-medium tracking-tight group-hover:opacity-60 transition-opacity">paperless</span>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push("/auth")}
            className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-sm"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto pt-32 pb-20 px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now in Private Beta
          </div>

          <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[1.1] text-neutral-900">
            Thoughts, filed <br />
            <span className="font-serif italic text-neutral-400">effortlessly.</span>
          </h1>

          <p className="mt-10 max-w-2xl text-xl text-neutral-500 font-light leading-relaxed">
            A frictionless interface for your notes and documents. 
            No distractions, just a clean canvas for your digital life.
          </p>

          <div className="mt-12 group relative">
            <button 
              onClick={() => router.push("/auth")}
              className="relative z-10 bg-white border border-neutral-200 px-8 py-4 rounded-xl text-lg font-medium hover:border-neutral-900 transition-all duration-500 flex items-center gap-3 shadow-xl shadow-neutral-100"
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            {/* Experimental SVG soft glow */}
            <div className="absolute inset-0 bg-blue-400/10 blur-3xl -z-10 group-hover:bg-blue-400/20 transition-all"></div>
          </div>
        </div>

        {/* Visual Mockup - Experimental Paper Stack */}
        <div className="mt-32 relative max-w-4xl mx-auto h-[400px]">
           {/* Background Sheet */}
            <div className="absolute top-4 left-1/2 -translate-x-[48%] w-full h-full bg-white border border-neutral-100 rounded-2xl shadow-sm rotate-[-2deg]"></div>
           {/* Middle Sheet */}
            <div className="absolute top-2 left-1/2 -translate-x-[49%] w-full h-full bg-white border border-neutral-100 rounded-2xl shadow-md rotate-[1deg]"></div>
           {/* Main Focus Sheet */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 overflow-hidden">
              <div className="flex gap-4 mb-8">
                <div className="w-3 h-3 rounded-full bg-neutral-100" />
                <div className="w-3 h-3 rounded-full bg-neutral-100" />
                <div className="w-3 h-3 rounded-full bg-neutral-100" />
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-50 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-neutral-50 rounded w-full" />
                <div className="h-4 bg-neutral-50 rounded w-5/6" />
                <div className="h-4 bg-neutral-50 rounded w-4/6" />
                
                {/* File Upload Mockup */}
                <div className="mt-12 border-2 border-dashed border-neutral-100 rounded-xl p-12 flex flex-col items-center justify-center bg-neutral-50/50">
                    <svg className="w-8 h-8 text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-neutral-400 text-sm font-medium">Drop files to attach</span>
                </div>
              </div>
            </div>
        </div>
      </main>

    <footer className="relative w-full bg-white overflow-hidden">
      {/* Top links */}
      <div className="flex flex-wrap justify-center gap-3 pt-8">
        {[
          "Contact Us",
          "Shipping & Delivery",
          "Privacy Policy",
          "Cancellation & Refund Policy",
          "Terms of Conditions",
        ].map((item) => (
          <button
            key={item}
            className="rounded-full bg-gray-100 px-5 py-2 text-sm text-gray-700 hover:bg-gray-200 transition"
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        © 2026 Notes Buddy. All rights reserved.
      </p>

      <div className="pointer-events-none select-none mt-12 text-center">
        <h1 className="text-[10rem] md:text-[14rem] font-extrabold text-gray-200 leading-none">
          paperless
        </h1>
        <div className="absolute bottom-0 w-full bg-linear-to-t from-green-500 to-white h-20"></div>
      </div>

      {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-500">
        <img
          src="/avatar.png" // replace with your image
          alt="avatar"
          className="w-7 h-7 rounded-full border"
        />
        <span>
          Built with <span className="text-pink-500">❤️</span> Ram
        </span>
      </div> */}
    </footer>
    </div>
  );
};

export default Landing;


// export default function Footer() {
//   return (
//     <footer className="relative w-full bg-white overflow-hidden">
//       {/* Top links */}
//       <div className="flex flex-wrap justify-center gap-3 pt-8">
//         {[
//           "Contact Us",
//           "Shipping & Delivery",
//           "Privacy Policy",
//           "Cancellation & Refund Policy",
//           "Terms of Conditions",
//         ].map((item) => (
//           <button
//             key={item}
//             className="rounded-full bg-gray-100 px-5 py-2 text-sm text-gray-700 hover:bg-gray-200 transition"
//           >
//             {item}
//           </button>
//         ))}
//       </div>

//       {/* Copyright */}
//       <p className="mt-6 text-center text-sm text-gray-500">
//         © 2026 Notes Buddy. All rights reserved.
//       </p>

//       {/* Watermark brand */}
//       <div className="pointer-events-none select-none mt-12 text-center">
//         <h1 className="text-[10rem] md:text-[14rem] font-extrabold text-gray-200 leading-none">
//           Notes Buddy
//         </h1>
//       </div>

//       {/* Bottom credit */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-500">
//         <img
//           src="/avatar.png" // replace with your image
//           alt="avatar"
//           className="w-7 h-7 rounded-full border"
//         />
//         <span>
//           Built with <span className="text-pink-500">❤️</span> Ram
//         </span>
//       </div>
//     </footer>
//   );
// }
