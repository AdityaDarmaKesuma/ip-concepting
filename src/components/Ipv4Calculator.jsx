import { useState } from "react";
import {
  Copy,
  Check,
  Info,
  ArrowRight,
  Minus,
  Plus,
  Layers,
  Binary,
  FileText,
} from "lucide-react";
import { calculateIpv4Subnet } from "../utils/ipv4";

const QUICK_PREFIXES = [8, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32];

function OctetMatrix({ label, ipString, bits, cidr }) {
  const octets =
    ipString && ipString !== "N/A" ? ipString.split(".") : ["0", "0", "0", "0"];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="text-xs font-mono text-zinc-500">{ipString}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[0, 8, 16, 24].map((startIdx, octetIdx) => (
          <div
            key={octetIdx}
            className="rounded-xl bg-[#0c0c0f] border border-white/[0.06] px-3 py-2.5 flex flex-col items-center justify-between gap-1.5"
          >
            <span className="text-[11px] font-mono text-zinc-500">
              Octet {octetIdx + 1} ·{" "}
              <strong className="text-zinc-200">{octets[octetIdx]}</strong>
            </span>
            <div className="font-mono text-xs sm:text-[13px] tracking-widest">
              {bits
                .slice(startIdx, startIdx + 8)
                .split("")
                .map((bit, bitIdx) => {
                  const globalIdx = startIdx + bitIdx;
                  const isNetworkBit = globalIdx < cidr;
                  return (
                    <span
                      key={globalIdx}
                      className={
                        isNetworkBit
                          ? "text-zinc-100 font-semibold"
                          : "text-emerald-400 font-medium"
                      }
                    >
                      {bit}
                    </span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Ipv4Calculator() {
  const [ip, setIp] = useState("192.168.10.25");
  const [cidr, setCidr] = useState(26);
  const [copiedKey, setCopiedKey] = useState(null);

  const result = calculateIpv4Subnet(ip, cidr);

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(String(value));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summary = [
      `Target      : ${result.ip}/${result.cidr} (${result.ipType.label})`,
      `Network ID  : ${result.network}/${result.cidr}`,
      `Broadcast   : ${result.broadcast}`,
      `Usable Range: ${result.firstUsable} - ${result.lastUsable}`,
      `Subnet Mask : ${result.subnetMask}`,
      `Wildcard    : ${result.wildcardMask}`,
      `Usable Hosts: ${result.usableHosts.toLocaleString()} / ${result.totalAddresses.toLocaleString()}`,
    ].join("\n");
    handleCopy("summary", summary);
  };

  const stepCidr = (delta) => {
    setCidr((prev) => Math.min(32, Math.max(0, prev + delta)));
  };

  const networkPercent = (cidr / 32) * 100;

  return (
    <div className="space-y-6">
      {/* 1. Command Input Deck */}
      <section className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              IPv4 Address & Prefix Control
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-950 border border-white/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className={result.ipType.color}>
                  {result.ipType.label}
                </span>
              </span>
            )}
            {result && (
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition cursor-pointer"
              >
                {copiedKey === "summary" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main Input + Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div className="flex items-center bg-[#09090c] border border-white/[0.09] rounded-xl px-4 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/15 transition">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.10.25"
              className="w-full bg-transparent py-3.5 font-mono text-lg sm:text-xl font-medium text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
            />
            <span className="font-mono text-xl text-zinc-600 select-none pl-2">
              /{cidr}
            </span>
          </div>

          <div className="flex items-center justify-between md:justify-center gap-2 bg-[#09090c] border border-white/[0.09] rounded-xl px-2.5 py-2">
            <button
              onClick={() => stepCidr(-1)}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] transition cursor-pointer"
              title="Kurangi Prefix"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="0"
              max="32"
              value={cidr}
              onChange={(e) =>
                setCidr(Math.min(32, Math.max(0, Number(e.target.value))))
              }
              className="w-12 bg-transparent font-mono text-lg font-semibold text-center text-zinc-100 focus:outline-none"
            />
            <button
              onClick={() => stepCidr(1)}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.06] transition cursor-pointer"
              title="Tambah Prefix"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider & Visual 32-bit Allocation Bar */}
        <div className="space-y-3 pt-1">
          <input
            type="range"
            min="0"
            max="32"
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full custom-slider"
          />

          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full overflow-hidden bg-zinc-950 border border-white/[0.06] flex">
              <div
                style={{ width: `${networkPercent}%` }}
                className="bg-zinc-200 transition-all duration-200"
              />
              <div
                style={{ width: `${100 - networkPercent}%` }}
                className="bg-emerald-500 transition-all duration-200"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-300">
                Network Portion: {cidr} bits
              </span>
              <span className="text-emerald-400">
                Host Portion: {32 - cidr} bits
              </span>
            </div>
          </div>
        </div>

        {/* Quick Prefix Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/[0.06]">
          <span className="text-[11px] text-zinc-500 mr-1 pt-2">Preset:</span>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {QUICK_PREFIXES.map((p) => (
              <button
                key={p}
                onClick={() => setCidr(p)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition cursor-pointer border ${
                  cidr === p
                    ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold"
                    : "bg-zinc-950/80 text-zinc-400 border-white/[0.07] hover:border-zinc-500 hover:text-zinc-200"
                }`}
              >
                /{p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error State */}
      {!result ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 p-4 text-sm font-mono">
          Format IPv4 tidak valid. Masukkan 4 oktet bernilai 0–255 (contoh:
          10.10.10.1).
        </div>
      ) : (
        <>
          {result.note && (
            <div className="flex items-center gap-2.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl">
              <Info className="w-4 h-4 shrink-0" />
              <span>{result.note}</span>
            </div>
          )}

          {/* 2. Bento Result Grid */}
          <section className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Hero Card: Usable Host Range (Span 4 cols) */}
            <div className="md:col-span-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-emerald-950/20 border border-white/[0.09] p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                  Usable Host Range
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      "range",
                      `${result.firstUsable} - ${result.lastUsable}`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-100 bg-zinc-950/80 border border-white/[0.08] px-2.5 py-1 rounded-md transition cursor-pointer"
                >
                  {copiedKey === "range" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Range</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono">
                <div className="px-3.5 py-2 rounded-xl bg-[#09090c] border border-white/[0.07]">
                  <p className="text-[10px] text-zinc-500 uppercase">
                    First Host
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-zinc-100">
                    {result.firstUsable}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />

                <div className="px-3.5 py-2 rounded-xl bg-[#09090c] border border-white/[0.07]">
                  <p className="text-[10px] text-zinc-500 uppercase">
                    Last Host
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-zinc-100">
                    {result.lastUsable}
                  </p>
                </div>
              </div>
            </div>

            {/* Capacity Highlight Card (Span 2 cols) */}
            <div className="md:col-span-2 rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                Host Capacity
              </span>
              <div className="mt-3">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                  {result.usableHosts.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  usable of {result.totalAddresses.toLocaleString()} total IPs
                </p>
              </div>
            </div>

            {/* 4 Technical Metric Cards */}
            {[
              {
                key: "network",
                label: "Network ID",
                sub: "Alamat blok subnet",
                value: `${result.network}/${result.cidr}`,
              },
              {
                key: "broadcast",
                label: "Broadcast Address",
                sub: "Alamat akhir subnet",
                value: result.broadcast,
              },
              {
                key: "mask",
                label: "Subnet Mask",
                sub: "Dotted-decimal mask",
                value: result.subnetMask,
              },
              {
                key: "wildcard",
                label: "Wildcard Mask",
                sub: "Inverse mask (ACL / OSPF)",
                value: result.wildcardMask,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="md:col-span-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/[0.07] hover:border-white/[0.14] p-4 sm:p-5 transition group flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    {item.label}
                  </p>
                  <p className="font-mono text-base sm:text-lg font-semibold text-zinc-100 mt-1 break-all">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{item.sub}</p>
                </div>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent hover:border-white/[0.08] transition shrink-0 cursor-pointer"
                  title="Copy"
                >
                  {copiedKey === item.key ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </section>

          {/* 3. Octet & 32-Bit Binary Matrix */}
          <section className="rounded-2xl bg-zinc-900/50 border border-white/[0.08] p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Binary className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Octet & 32-Bit Binary Matrix
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-zinc-100" /> Network
                  ({result.cidr}b)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Host
                  ({32 - result.cidr}b)
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <OctetMatrix
                label="IP Address"
                ipString={result.ip}
                bits={result.binary.ip}
                cidr={result.cidr}
              />
              <OctetMatrix
                label="Subnet Mask"
                ipString={result.subnetMask}
                bits={result.binary.mask}
                cidr={result.cidr}
              />
              <OctetMatrix
                label="Network ID"
                ipString={result.network}
                bits={result.binary.network}
                cidr={result.cidr}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
