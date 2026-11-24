import { useState } from "react";
import { Terminal } from "lucide-react";
import Ipv4Calculator from "./components/Ipv4Calculator";
import BinaryLab from "./components/BinaryLab";
import Footer from "./components/Footer";

const TABS = [
  { id: "ipv4", label: "IPv4 Subnetting", ready: true },
  { id: "binary", label: "Binary Lab", ready: true },
  { id: "vlsm", label: "VLSM Planner", ready: false },
  { id: "supernet", label: "CIDR Summary", ready: false },
  { id: "ipv6", label: "IPv6 Toolkit", ready: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("ipv4");

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col relative overflow-x-hidden">
      {/* Subtle Ambient Light & Dot Grid */}
      <div className="pointer-events-none fixed inset-0 bg-dot-grid opacity-80" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[780px] h-[300px] bg-emerald-500/[0.06] blur-[120px] rounded-full" />

      {/* Sticky Topbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#070709]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Terminal className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-sm text-zinc-100">
                  IP Concepting
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Network Engineering & Addressing Toolkit
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900/70 border border-white/[0.06] px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ip-concepting.adityadarma.site</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-7 pb-10 flex-1 space-y-7">
        {/* Segmented Navigation Pill */}
        <nav className="inline-flex max-w-full overflow-x-auto p-1 rounded-xl bg-zinc-900/80 border border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                <span>{tab.label}</span>
                {!tab.ready && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-zinc-900/10 text-zinc-700"
                        : "bg-zinc-800/80 text-zinc-500"
                    }`}
                  >
                    soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Module */}
        {activeTab === "ipv4" && <Ipv4Calculator />}
        {activeTab === "binary" && <BinaryLab />}
        {activeTab !== "ipv4" && activeTab !== "binary" && (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-14 text-center">
            <p className="text-sm font-medium text-zinc-200">
              Modul sedang disiapkan
            </p>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-sm mx-auto">
              Fitur ini akan segera ditambahkan sebagai bagian dari paket
              lengkap IP Concepting.
            </p>
          </div>
        )}
      </main>

      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6">
        <Footer />
      </div>
    </div>
  );
}
