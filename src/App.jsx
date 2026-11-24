import { useState } from "react";
import { Network } from "lucide-react";
import Ipv4Calculator from "./components/Ipv4Calculator";
import Footer from "./components/Footer";

const TABS = [
  { id: "ipv4", label: "IPv4 Subnetting" },
  { id: "vlsm", label: "VLSM Planner (Next)" },
  { id: "supernet", label: "CIDR Summary (Next)" },
  { id: "ipv6", label: "IPv6 Toolkit (Next)" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("ipv4");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col">
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          <header className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                IP Concepting Toolkit
              </h1>
              <p className="text-xs text-slate-400">
                Subnetting, VLSM, Route Summarization & IPv6 Calculator
              </p>
            </div>
          </header>

          <nav className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-sky-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <main>
            {activeTab === "ipv4" && <Ipv4Calculator />}
            {activeTab !== "ipv4" && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 text-sm">
                Modul ini siap kita bangun di tahap berikutnya.
              </div>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
