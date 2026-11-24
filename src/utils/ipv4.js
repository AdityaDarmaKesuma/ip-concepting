export function isValidIpv4(ip) {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const num = Number(part);
    return num >= 0 && num <= 255 && String(num) === part;
  });
}

export function ipToInt(ip) {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

export function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

export function intToBinary(int) {
  return (int >>> 0).toString(2).padStart(32, "0");
}

export function detectIpType(ipInt) {
  const first = (ipInt >>> 24) & 255;
  const second = (ipInt >>> 16) & 255;

  if (first === 10)
    return { label: "Private (RFC 1918)", color: "text-emerald-400" };
  if (first === 172 && second >= 16 && second <= 31)
    return { label: "Private (RFC 1918)", color: "text-emerald-400" };
  if (first === 192 && second === 168)
    return { label: "Private (RFC 1918)", color: "text-emerald-400" };
  if (first === 127) return { label: "Loopback", color: "text-amber-400" };
  if (first === 169 && second === 254)
    return { label: "APIPA / Link-Local", color: "text-amber-400" };
  if (first === 100 && second >= 64 && second <= 127)
    return { label: "CGNAT (RFC 6598)", color: "text-purple-400" };
  if (first >= 224 && first <= 239)
    return { label: "Multicast", color: "text-cyan-400" };
  if (first >= 240)
    return { label: "Reserved / Experimental", color: "text-rose-400" };
  if (first === 0)
    return { label: "Current Network (RFC 1122)", color: "text-slate-400" };
  return { label: "Public IP", color: "text-sky-400" };
}

export function calculateIpv4Subnet(ip, cidrInput) {
  const cidr = Number(cidrInput);
  if (!isValidIpv4(ip) || isNaN(cidr) || cidr < 0 || cidr > 32) {
    return null;
  }

  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const wildcardInt = ~maskInt >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;
  const totalAddresses = Math.pow(2, 32 - cidr);

  let usableHosts,
    firstUsable,
    lastUsable,
    note = null;

  if (cidr === 32) {
    usableHosts = 1;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(networkInt);
    note = "Host Route (/32) — merepresentasikan 1 host tunggal.";
  } else if (cidr === 31) {
    usableHosts = 2;
    firstUsable = intToIp(networkInt);
    lastUsable = intToIp(broadcastInt);
    note =
      "Point-to-Point Link (RFC 3021) — kedua IP dapat digunakan tanpa broadcast.";
  } else {
    usableHosts = totalAddresses - 2;
    firstUsable = intToIp((networkInt + 1) >>> 0);
    lastUsable = intToIp((broadcastInt - 1) >>> 0);
  }

  return {
    ip,
    cidr,
    network: intToIp(networkInt),
    broadcast: cidr === 31 || cidr === 32 ? "N/A" : intToIp(broadcastInt),
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    firstUsable,
    lastUsable,
    totalAddresses,
    usableHosts,
    ipType: detectIpType(ipInt),
    note,
    binary: {
      ip: intToBinary(ipInt),
      mask: intToBinary(maskInt),
      network: intToBinary(networkInt),
    },
  };
}
