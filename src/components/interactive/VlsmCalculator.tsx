import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Calculator, AlertCircle } from 'lucide-react';
import {
  calculateVlsm,
  SubnetRequirement,
  VlsmResult,
} from '../../lib/vlsm';

const DEFAULT_BASE_CIDR = '192.168.1.0/24';

const DEFAULT_REQUIREMENTS: SubnetRequirement[] = [
  { id: '1', name: 'LAN A', hosts: 100 },
  { id: '2', name: 'LAN B', hosts: 50 },
  { id: '3', name: 'LAN C', hosts: 25 },
  { id: '4', name: 'LAN D (WAN Link)', hosts: 2 },
];

export const VlsmCalculator: React.FC = () => {
  const [baseCidr, setBaseCidr] = useState(DEFAULT_BASE_CIDR);
  const [requirements, setRequirements] = useState<SubnetRequirement[]>(
    DEFAULT_REQUIREMENTS
  );
  const [result, setResult] = useState<VlsmResult>(() =>
    calculateVlsm(DEFAULT_BASE_CIDR, DEFAULT_REQUIREMENTS)
  );
  const [showPractice, setShowPractice] = useState(false);

  const handleCalculate = () => {
    const res = calculateVlsm(baseCidr, requirements);
    setResult(res);
  };

  const handleReset = () => {
    setBaseCidr(DEFAULT_BASE_CIDR);
    setRequirements(DEFAULT_REQUIREMENTS);
    setResult(calculateVlsm(DEFAULT_BASE_CIDR, DEFAULT_REQUIREMENTS));
  };

  const loadPractice = () => {
    const practiceBase = '10.0.0.0/24';
    const practiceReqs: SubnetRequirement[] = [
      { id: 'p1', name: 'LAN 1', hosts: 60 },
      { id: 'p2', name: 'LAN 2', hosts: 30 },
      { id: 'p3', name: 'LAN 3', hosts: 10 },
      { id: 'p4', name: 'Point-to-Point WAN', hosts: 2 },
    ];
    setBaseCidr(practiceBase);
    setRequirements(practiceReqs);
    setResult(calculateVlsm(practiceBase, practiceReqs));
  };

  const updateHost = (id: string, hosts: number) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hosts: Math.max(1, hosts) } : r))
    );
  };

  const updateName = (id: string, name: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name } : r))
    );
  };

  const addRow = () => {
    const nextChar = String.fromCharCode(65 + requirements.length);
    setRequirements((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `LAN ${nextChar}`,
        hosts: 10,
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (requirements.length <= 1) return;
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)] flex items-center gap-2">
            <Calculator size={18} className="text-[var(--packet)]" />
            <span>Interactive VLSM Subnet Calculator</span>
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Test any base block and subnet requirements against exam formulas
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPractice}
            className="px-2.5 py-1 rounded text-xs font-sans border border-[var(--rule)] hover:border-[var(--packet)] text-[var(--packet)] transition-colors"
          >
            Load 10.0.0.0/24 Practice
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-sans border border-[var(--rule)] hover:bg-[var(--paper)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Exam Defaults</span>
          </button>
        </div>
      </div>

      {/* Input section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-1">
            Base Network (CIDR)
          </label>
          <input
            type="text"
            value={baseCidr}
            onChange={(e) => setBaseCidr(e.target.value)}
            className="w-full px-3 py-1.5 rounded border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] font-mono text-sm focus:border-[var(--packet)]"
            placeholder="192.168.1.0/24"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
              Subnet Requirements ({requirements.length})
            </label>
            <button
              onClick={addRow}
              className="text-xs text-[var(--packet)] font-sans flex items-center gap-1 hover:underline"
            >
              <Plus size={13} /> Add Subnet
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {requirements.map((req) => (
              <div key={req.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={req.name}
                  onChange={(e) => updateName(req.id, e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] text-xs text-[var(--ink)] font-sans"
                  placeholder="Subnet Name"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={req.hosts}
                    onChange={(e) => updateHost(req.id, parseInt(e.target.value, 10) || 1)}
                    className="w-20 px-2.5 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink)]"
                  />
                  <span className="text-xs text-[var(--muted)]">hosts</span>
                </div>
                <button
                  onClick={() => removeRow(req.id)}
                  disabled={requirements.length <= 1}
                  className="p-1 text-[var(--muted)] hover:text-[var(--alert)] disabled:opacity-20"
                  title="Remove row"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 rounded bg-[var(--packet)] text-white font-sans font-semibold text-xs tracking-wide hover:opacity-95 transition-opacity shadow-sm flex items-center gap-2"
        >
          <Calculator size={15} />
          <span>Compute Subnet Allocation</span>
        </button>
      </div>

      {/* Error state */}
      {result.error && (
        <div className="p-3 mb-4 rounded bg-[var(--alert)]/10 border border-[var(--alert)]/30 text-[var(--alert)] text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {/* Results table */}
      {result.allocations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
              Calculated Subnet Plan (Sorted Descending)
            </div>
            <div className="text-xs font-mono text-[var(--signal)]">
              {result.totalAddressesNeeded} / {result.totalAddressesAvailable} addresses used
            </div>
          </div>

          <div className="table-scroll-container">
            <table className="w-full text-left text-xs border-collapse bg-[var(--surface)]">
              <thead>
                <tr className="bg-[var(--paper)] border-b border-[var(--rule)] text-[var(--ink)]">
                  <th className="px-3 py-2">Subnet Name</th>
                  <th className="px-3 py-2">Hosts Needed</th>
                  <th className="px-3 py-2">Network ID</th>
                  <th className="px-3 py-2">Subnet Mask</th>
                  <th className="px-3 py-2">First Usable Host</th>
                  <th className="px-3 py-2">Last Usable Host</th>
                  <th className="px-3 py-2">Broadcast Address</th>
                  <th className="px-3 py-2">Usable Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)]/60 font-mono">
                {result.allocations.map((alloc, idx) => (
                  <tr key={idx} className="hover:bg-[var(--paper)]/60 transition-colors">
                    <td className="px-3 py-2 font-sans font-bold text-[var(--ink)]">
                      {alloc.name}
                    </td>
                    <td className="px-3 py-2 text-[var(--muted)]">{alloc.hostsNeeded}</td>
                    <td className="px-3 py-2 font-bold text-[var(--packet)]">
                      {alloc.networkAddress}
                    </td>
                    <td className="px-3 py-2">{alloc.subnetMask}</td>
                    <td className="px-3 py-2 text-[var(--signal)]">{alloc.firstHost}</td>
                    <td className="px-3 py-2 text-[var(--signal)]">{alloc.lastHost}</td>
                    <td className="px-3 py-2 text-[var(--alert)]">{alloc.broadcastAddress}</td>
                    <td className="px-3 py-2 font-bold">{alloc.usableHosts} hosts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.unusedRange && (
            <div className="mt-2.5 p-2.5 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono text-[var(--muted)] flex items-center justify-between">
              <span>
                Unallocated Growth Space: {result.unusedRange.start} – {result.unusedRange.end}
              </span>
              <span className="text-[var(--ink)] font-bold">
                {result.unusedRange.count} addresses remaining
              </span>
            </div>
          )}
        </div>
      )}

      {/* Practice question accordion */}
      <div className="mt-4 pt-3 border-t border-[var(--rule)]">
        <button
          onClick={() => setShowPractice(!showPractice)}
          className="text-xs text-[var(--packet)] font-sans font-semibold hover:underline flex items-center gap-1.5"
        >
          <span>{showPractice ? '▲ Hide' : '▼ Try It Yourself: Exam Practice Question'}</span>
        </button>

        {showPractice && (
          <div className="mt-2.5 p-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink)] font-sans space-y-1.5">
            <div className="font-bold">
              Practice Question: Subnet 10.0.0.0/24 for LANs needing 60, 30, 10, and 2 hosts.
            </div>
            <div className="text-[var(--muted)]">
              Click the "Load 10.0.0.0/24 Practice" button at the top to simulate the solution, or check the answer:
            </div>
            <ul className="list-disc pl-5 font-mono space-y-1 text-[11px]">
              <li>60 hosts → /26: 10.0.0.0/26 (hosts .1 to .62, broadcast .63)</li>
              <li>30 hosts → /27: 10.0.0.64/27 (hosts .65 to .94, broadcast .95)</li>
              <li>10 hosts → /28: 10.0.0.96/28 (hosts .97 to .110, broadcast .111)</li>
              <li>2 hosts → /30: 10.0.0.112/30 (hosts .113 to .114, broadcast .115)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
