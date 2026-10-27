export interface SubnetRequirement {
  id: string;
  name: string;
  hosts: number;
}

export interface SubnetAllocation {
  name: string;
  hostsNeeded: number;
  usableHosts: number;
  allocatedSize: number;
  prefix: number;
  subnetMask: string;
  networkAddress: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
}

export interface VlsmResult {
  allocations: SubnetAllocation[];
  totalAddressesNeeded: number;
  totalAddressesAvailable: number;
  unusedAddresses: number;
  unusedRange?: { start: string; end: string; count: number };
  error?: string;
}

export function ipToInt(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');
}

export function getSubnetMask(prefix: number): string {
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return intToIp(mask);
}

export function calculateVlsm(
  baseCidr: string,
  requirements: SubnetRequirement[]
): VlsmResult {
  const [baseIpStr, prefixStr] = baseCidr.trim().split('/');
  const basePrefix = parseInt(prefixStr, 10);

  if (!baseIpStr || isNaN(basePrefix) || basePrefix < 0 || basePrefix > 30) {
    return {
      allocations: [],
      totalAddressesNeeded: 0,
      totalAddressesAvailable: 0,
      unusedAddresses: 0,
      error: 'Invalid base network CIDR (e.g. 192.168.1.0/24)',
    };
  }

  const baseIp = ipToInt(baseIpStr);
  const totalAddressesAvailable = Math.pow(2, 32 - basePrefix);

  const validReqs = requirements.filter((r) => r.hosts > 0);
  if (validReqs.length === 0) {
    return {
      allocations: [],
      totalAddressesNeeded: 0,
      totalAddressesAvailable,
      unusedAddresses: totalAddressesAvailable,
      error: 'Please add at least one subnet requirement with hosts > 0',
    };
  }

  // Sort descending by host requirements
  const sorted = [...validReqs].sort((a, b) => b.hosts - a.hosts);

  const allocations: SubnetAllocation[] = [];
  let currentIp = baseIp;
  let totalAddressesNeeded = 0;

  for (const req of sorted) {
    // find smallest h with 2^h - 2 >= hosts
    let h = 2;
    while (Math.pow(2, h) - 2 < req.hosts) {
      h++;
    }
    const blockSize = Math.pow(2, h);
    const prefix = 32 - h;
    totalAddressesNeeded += blockSize;

    // Align currentIp to block size boundary if not already aligned
    const remainder = currentIp % blockSize;
    if (remainder !== 0) {
      currentIp += blockSize - remainder;
    }

    const networkAddressInt = currentIp;
    const broadcastAddressInt = networkAddressInt + blockSize - 1;
    const firstHostInt = networkAddressInt + 1;
    const lastHostInt = broadcastAddressInt - 1;

    allocations.push({
      name: req.name,
      hostsNeeded: req.hosts,
      usableHosts: blockSize - 2,
      allocatedSize: blockSize,
      prefix,
      subnetMask: getSubnetMask(prefix),
      networkAddress: `${intToIp(networkAddressInt)}/${prefix}`,
      firstHost: intToIp(firstHostInt),
      lastHost: intToIp(lastHostInt),
      broadcastAddress: intToIp(broadcastAddressInt),
    });

    currentIp = broadcastAddressInt + 1;
  }

  const maxIpAllowed = baseIp + totalAddressesAvailable;
  if (currentIp > maxIpAllowed) {
    return {
      allocations,
      totalAddressesNeeded,
      totalAddressesAvailable,
      unusedAddresses: 0,
      error: `Not enough addresses: needs ${totalAddressesNeeded}, block has ${totalAddressesAvailable}`,
    };
  }

  const unusedAddresses = maxIpAllowed - currentIp;
  const unusedRange =
    unusedAddresses > 0
      ? {
          start: intToIp(currentIp),
          end: intToIp(maxIpAllowed - 1),
          count: unusedAddresses,
        }
      : undefined;

  return {
    allocations,
    totalAddressesNeeded,
    totalAddressesAvailable,
    unusedAddresses,
    unusedRange,
  };
}
