import { useState } from "react";
import { CheckCircle2, Copy, Check, ArrowRightLeft } from "lucide-react";
import {
  BIT_WEIGHTS,
  calculateBinaryToDecimal,
  calculateDecimalToBinary,
  calculateFullIpConversion,
} from "../utils/binary";

export default function BinaryLab() {
  const [mode, setMode] = useState("bin2dec");
  const [binInput, setBinInput] = useState("10101000");
  const [decInput, setDecInput] = useState("168");
  const [ipInput, setIpInput] = useState("192.168.10.25");
  const [copied, setCopied] = useState(false);

  const binResult = calculateBinaryToDecimal(binInput);
  const decResult = calculateDecimalToBinary(decInput);
  const ipResult = calculateFullIpConversion(ipInput);

  const toggleBitInInput = (idx) => {
    const base = binResult.valid
      ? [...binResult.bits]
      : [0, 0, 0, 0, 0, 0, 0, 0];
    base[idx] = base[idx] === 1 ? 0 : 1;
    setBinInput(base.join(""));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Pilihan Mode Kalkulator */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "bin2dec", label: "Hitung Biner → Desimal" },
          { id: "dec2bin", label: "Hitung Desimal → Biner" },
          { id: "fullip", label: "Konversi IPv4 Penuh (4 Oktet)" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition cursor-pointer ${
              mode === item.id
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                : "bg-zinc-900/60 text-zinc-400 border-white/[0.07] hover:text-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* MODE 1: BINER -> DESIMAL */}
      {mode === "bin2dec" && (
        <section className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                Kalkulator Biner → Desimal
              </p>
              <h2 className="text-lg font-bold text-zinc-100">
                Ketik angka biner (maks. 8 bit) atau klik kotak bit
              </h2>
            </div>

            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                Input Biner (0 / 1)
              </label>
              <input
                type="text"
                maxLength={8}
                value={binInput}
                onChange={(e) =>
                  setBinInput(e.target.value.replace(/[^01]/g, ""))
                }
                placeholder="Contoh: 10101000"
                className="w-full bg-[#09090c] border border-white/[0.1] rounded-xl px-4 py-2.5 font-mono text-base tracking-[0.2em] text-zinc-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          {!binResult.valid ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 p-4 text-xs font-mono">
              {binResult.error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto pb-1">
                <div className="min-w-[540px] space-y-2.5">
                  <div className="grid grid-cols-[84px_repeat(8,1fr)] gap-2 items-center">
                    <span className="text-[11px] font-mono text-zinc-500">
                      NILAI
                    </span>
                    {BIT_WEIGHTS.map((w) => (
                      <div
                        key={w}
                        className="py-2 rounded-lg bg-zinc-950 border border-white/[0.07] text-center font-mono text-sm font-semibold text-zinc-300"
                      >
                        {w}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[84px_repeat(8,1fr)] gap-2 items-center">
                    <span className="text-[11px] font-mono text-zinc-500">
                      BIT
                    </span>
                    {binResult.bits.map((bit, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleBitInInput(idx)}
                        className={`py-2.5 rounded-lg font-mono text-base font-bold border transition cursor-pointer ${
                          bit === 1
                            ? "bg-emerald-600 text-white border-emerald-400/60"
                            : "bg-[#0c0c0f] text-zinc-500 border-white/[0.07] hover:border-zinc-500"
                        }`}
                      >
                        {bit}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-[84px_repeat(8,1fr)] gap-2 items-center">
                    <span className="text-[11px] font-mono text-zinc-500">
                      DIAMBIL
                    </span>
                    {binResult.breakdown.map((b, idx) => (
                      <div
                        key={idx}
                        className={`py-2 rounded-lg text-center font-mono text-sm font-semibold border ${
                          b.taken !== null
                            ? "bg-amber-400/15 text-amber-300 border-amber-400/40"
                            : "text-zinc-600 border-transparent"
                        }`}
                      >
                        {b.taken !== null ? b.taken : "—"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#09090c] border border-white/[0.08] px-4 py-3.5 font-mono text-sm sm:text-base flex flex-wrap items-center justify-between gap-3">
                <span className="text-zinc-300">
                  {binResult.formula} ={" "}
                  <strong className="text-amber-400 text-xl">
                    {binResult.decimal}
                  </strong>
                </span>
                <span className="text-xs text-zinc-500">
                  Biner 8-bit:{" "}
                  <strong className="text-emerald-400">
                    {binResult.binary}
                  </strong>
                </span>
              </div>
            </>
          )}
        </section>
      )}

      {/* MODE 2: DESIMAL -> BINER */}
      {mode === "dec2bin" && (
        <section className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                Kalkulator Desimal → Biner
              </p>
              <h2 className="text-lg font-bold text-zinc-100">
                Pengurangan bertahap dari nilai bit terbesar
              </h2>
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                Input Desimal (0–255)
              </label>
              <input
                type="number"
                min="0"
                max="255"
                value={decInput}
                onChange={(e) => setDecInput(e.target.value)}
                placeholder="168"
                className="w-full bg-[#09090c] border border-white/[0.1] rounded-xl px-4 py-2.5 font-mono text-base text-zinc-100 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          {!decResult.valid ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 p-4 text-xs font-mono">
              {decResult.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
                <div className="lg:col-span-3 space-y-2.5">
                  {decResult.decimal === 0 ? (
                    <div className="rounded-xl bg-[#09090c] border border-white/[0.06] p-4 text-sm text-zinc-400">
                      Nilai 0 tidak muat di posisi mana pun, semua bit bernilai{" "}
                      <strong className="font-mono text-zinc-100">0</strong>.
                    </div>
                  ) : (
                    <>
                      {decResult.steps.map((s, idx) => (
                        <div
                          key={s.weight}
                          className="flex items-start gap-3 rounded-xl bg-[#09090c] border border-white/[0.06] px-4 py-3 text-xs sm:text-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="font-mono text-zinc-300">
                            {s.before} ≥ {s.weight}?{" "}
                            {s.fits ? (
                              <>
                                <strong className="text-emerald-400">
                                  Ya → 1
                                </strong>
                                . Sisa {s.before} − {s.weight} ={" "}
                                <strong className="text-zinc-100">
                                  {s.after}
                                </strong>
                              </>
                            ) : (
                              <>
                                <strong className="text-rose-400">
                                  Tidak → 0
                                </strong>
                                . Sisa tetap{" "}
                                <strong className="text-zinc-100">
                                  {s.after}
                                </strong>
                              </>
                            )}
                          </p>
                        </div>
                      ))}

                      {decResult.trailingZeros.length > 0 && (
                        <div className="flex items-start gap-3 rounded-xl bg-[#09090c] border border-white/[0.06] px-4 py-3 text-xs sm:text-sm">
                          <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {decResult.steps.length + 1}
                          </span>
                          <p className="font-mono text-zinc-300">
                            Sisa sudah{" "}
                            <strong className="text-zinc-100">0</strong> →
                            posisi{" "}
                            <span className="text-zinc-400">
                              {decResult.trailingZeros.join(", ")}
                            </span>{" "}
                            diisi <strong className="text-zinc-100">0</strong>.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0b0f0e] to-zinc-900/70 border border-emerald-500/25 p-5 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    Hasil Biner
                  </span>
                  <p className="font-mono text-2xl font-bold text-zinc-100">
                    {decResult.decimal} =
                  </p>
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 tracking-[0.18em]">
                    {decResult.binary}
                  </p>
                  <p className="text-xs text-zinc-400 pt-2 border-t border-white/[0.07]">
                    Posisi bit 1:{" "}
                    <span className="font-mono text-zinc-200">
                      {decResult.activeValues.length > 0
                        ? decResult.activeValues.join(", ")
                        : "Tidak ada"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#09090c] border border-white/[0.08] px-4 py-3 flex items-center gap-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="font-mono text-zinc-300">
                  Cek balik: {decResult.formula} ={" "}
                  <strong className="text-amber-400">
                    {decResult.decimal}
                  </strong>
                </p>
              </div>
            </>
          )}
        </section>
      )}

      {/* MODE 3: KONVERSI IPv4 PENUH (4 OKTET) */}
      {mode === "fullip" && (
        <section className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 sm:p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
              Auto-Detect Desimal ↔ Biner (32-Bit)
            </p>
            <h2 className="text-lg font-bold text-zinc-100">
              Konversi IPv4 Penuh 4 Oktet
            </h2>
          </div>

          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="192.168.10.25 atau 11000000.10101000.00001010.00011001"
            className="w-full bg-[#09090c] border border-white/[0.1] rounded-xl px-4 py-3 font-mono text-sm sm:text-base text-zinc-100 focus:outline-none focus:border-emerald-500/60"
          />

          {!ipResult.valid ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 p-4 text-xs font-mono">
              {ipResult.error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#09090c] border border-emerald-500/25 p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-zinc-500 uppercase flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                    {ipResult.mode === "dec-to-bin"
                      ? "Hasil Biner 32-Bit"
                      : "Hasil IPv4 Desimal"}
                  </p>
                  <p className="font-mono text-sm sm:text-lg font-bold text-emerald-400 mt-1 break-all">
                    {ipResult.result}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(ipResult.result)}
                  className="p-2 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white shrink-0 cursor-pointer"
                  title="Copy hasil"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ipResult.octets.map((o) => (
                  <div
                    key={o.index}
                    className="rounded-xl bg-[#09090c] border border-white/[0.07] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Oktet {o.index}</span>
                      <strong className="text-zinc-100 text-sm">
                        {o.decimal}
                      </strong>
                    </div>
                    <p className="font-mono text-sm text-emerald-400 tracking-wider">
                      {o.binary}
                    </p>
                    <p
                      className="font-mono text-[11px] text-zinc-500 truncate"
                      title={o.formula}
                    >
                      = {o.formula}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
