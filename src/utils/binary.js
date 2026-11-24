export const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

// 1. Hitung Biner (8-bit) -> Desimal
export function calculateBinaryToDecimal(rawInput) {
  const clean = rawInput.replace(/\s+/g, "");
  if (!/^[01]{1,8}$/.test(clean)) {
    return {
      valid: false,
      error: "Masukkan hanya angka 0 dan 1 (maksimal 8 bit).",
    };
  }

  const padded = clean.padStart(8, "0");
  const bits = padded.split("").map(Number);

  const breakdown = bits.map((bit, idx) => ({
    weight: BIT_WEIGHTS[idx],
    bit,
    taken: bit === 1 ? BIT_WEIGHTS[idx] : null,
  }));

  const activeValues = breakdown
    .filter((b) => b.taken !== null)
    .map((b) => b.taken);
  const decimal = activeValues.reduce((sum, val) => sum + val, 0);
  const formula = activeValues.length > 0 ? activeValues.join(" + ") : "0";

  return {
    valid: true,
    binary: padded,
    bits,
    breakdown,
    activeValues,
    decimal,
    formula,
  };
}

// 2. Hitung Desimal (0-255) -> Biner (Step-by-Step Pengurangan)
export function calculateDecimalToBinary(rawInput) {
  const num = Number(rawInput);
  if (
    rawInput === "" ||
    isNaN(num) ||
    !Number.isInteger(num) ||
    num < 0 ||
    num > 255
  ) {
    return {
      valid: false,
      error: "Masukkan bilangan bulat antara 0 sampai 255.",
    };
  }

  let remaining = num;
  const bits = [];
  const steps = [];
  const trailingZeros = [];

  for (const weight of BIT_WEIGHTS) {
    if (remaining === 0) {
      bits.push(0);
      trailingZeros.push(weight);
      continue;
    }

    if (remaining >= weight) {
      const next = remaining - weight;
      bits.push(1);
      steps.push({
        before: remaining,
        weight,
        fits: true,
        bit: 1,
        after: next,
      });
      remaining = next;
    } else {
      bits.push(0);
      steps.push({
        before: remaining,
        weight,
        fits: false,
        bit: 0,
        after: remaining,
      });
    }
  }

  const activeValues = BIT_WEIGHTS.filter((_, idx) => bits[idx] === 1);
  const formula = activeValues.length > 0 ? activeValues.join(" + ") : "0";

  return {
    valid: true,
    decimal: num,
    binary: bits.join(""),
    bits,
    steps,
    trailingZeros,
    activeValues,
    formula,
  };
}

// 3. Hitung Konversi IPv4 Penuh (4 Oktet: Desimal <-> Biner)
export function calculateFullIpConversion(rawInput) {
  const trimmed = rawInput.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 4) {
    return {
      valid: false,
      error: "Format harus terdiri dari 4 oktet dipisahkan titik (.).",
    };
  }

  const isBinaryIp = parts.every((p) => /^[01]{8}$/.test(p));
  if (isBinaryIp) {
    const octets = parts.map((bin, idx) => {
      const res = calculateBinaryToDecimal(bin);
      return {
        index: idx + 1,
        binary: bin,
        decimal: res.decimal,
        formula: res.formula,
      };
    });
    return {
      valid: true,
      mode: "bin-to-dec",
      result: octets.map((o) => o.decimal).join("."),
      octets,
    };
  }

  const isDecimalIp = parts.every(
    (p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255,
  );
  if (isDecimalIp) {
    const octets = parts.map((dec, idx) => {
      const res = calculateDecimalToBinary(dec);
      return {
        index: idx + 1,
        decimal: Number(dec),
        binary: res.binary,
        formula: res.formula,
      };
    });
    return {
      valid: true,
      mode: "dec-to-bin",
      result: octets.map((o) => o.binary).join("."),
      octets,
    };
  }

  return {
    valid: false,
    error:
      "Masukkan IPv4 desimal (contoh: 192.168.10.25) atau 4 oktet biner 8-bit (contoh: 11000000.10101000.00001010.00011001).",
  };
}
