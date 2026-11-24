import { useState } from "react";
import { Copy, Check, Info } from "lucide-react";
import { calculateIpv4Subnet } from "../utils/ipv4";

function BinaryRow({ label, bits, cidr }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-800 last:border-0">
      <span className="text-xs font-medium text-slate-400 w-28">{label}</span>
      <div className="font-mono text-sm tracking-wider flex flex-wrap gap-x-1">
        {[0, 8, 16, 24].map((startIdx, octetIdx) => (
          <span key={octetIdx} className="inline-flex">
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
                        ? "text-sky-400 font-semibold"
                        : "text-emerald-400"
                    }
                  >
                    {bit}
                  </span>
                );
              })}
            {octetIdx < 3 && <span className="text-slate-600 mx-0.5">.</span>}
          </span>
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

  const metrics = result
    ? [
        {
          key: "network",
          label: "Network ID",
          value: `${result.network}/${result.cidr}`,
        },
        {
          key: "broadcast",
          label: "Broadcast Address",
          value: result.broadcast,
        },
        {
          key: "range",
          label: "Usable Host Range",
          value: `${result.firstUsable} – ${result.lastUsable}`,
        },
        { key: "mask", label: "Subnet Mask", value: result.subnetMask },
        {
          key: "wildcard",
          label: "Wildcard Mask (ACL/OSPF)",
          value: result.wildcardMask,
        },
        {
          key: "hosts",
          label: "Usable / Total IP",
          value: `${result.usableHosts.toLocaleString()} / ${result.totalAddresses.toLocaleString()}`,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            IPv4 Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Contoh: 10.10.10.1"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 font-mono text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Prefix CIDR (/{cidr})
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="32"
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="32"
              value={cidr}
              onChange={(e) =>
                setCidr(Math.min(32, Math.max(0, Number(e.target.value))))
              }
              className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 font-mono text-center text-slate-100"
            />
          </div>
        </div>
      </div>

      {!result ? (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl p-4 text-sm">
          Format IPv4 tidak valid. Pastikan terdiri dari 4 oktet bernilai 0–255
          (contoh: 192.168.1.1).
        </div>
      ) : (
        <>
          {/* Status & Notes */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-xs text-slate-400">
              Kategori IP:{" "}
              <strong className={result.ipType.color}>
                {result.ipType.label}
              </strong>
            </span>
            {result.note && (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/50 border border-amber-800/60 px-3 py-1 rounded-full">
                <Info className="w-3.5 h-3.5" /> {result.note}
              </span>
            )}
          </div>

          {/* Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((item) => (
              <div
                key={item.key}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-2"
              >
                <div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="font-mono text-base font-semibold text-slate-100 mt-1 break-all">
                    {item.value}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition"
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
          </div>

          {/* Binary Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-200">
                32-Bit Binary Visualizer
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />{" "}
                  Network ({result.cidr} bit)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />{" "}
                  Host ({32 - result.cidr} bit)
                </span>
              </div>
            </div>
            <BinaryRow
              label="IP Address"
              bits={result.binary.ip}
              cidr={result.cidr}
            />
            <BinaryRow
              label="Subnet Mask"
              bits={result.binary.mask}
              cidr={result.cidr}
            />
            <BinaryRow
              label="Network ID"
              bits={result.binary.network}
              cidr={result.cidr}
            />
          </div>
        </>
      )}
    </div>
  );
}
