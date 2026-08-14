'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PERIODIC_TABLE_DATA } from '@/data/periodicTable';

interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
  row: number;
  col: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Nonmetal': 'bg-green-600/40 border-green-500/50',
  'Noble Gas': 'bg-cyan-600/40 border-cyan-500/50',
  'Alkali Metal': 'bg-red-600/40 border-red-500/50',
  'Alkaline Earth': 'bg-orange-600/40 border-orange-500/50',
  'Transition Metal': 'bg-blue-600/40 border-blue-500/50',
  'Lanthanide': 'bg-purple-600/40 border-purple-500/50',
  'Actinide': 'bg-pink-600/40 border-pink-500/50',
  'Metalloid': 'bg-yellow-600/40 border-yellow-500/50',
  'Metal': 'bg-indigo-600/40 border-indigo-500/50',
  'Halogen': 'bg-teal-600/40 border-teal-500/50',
};

export function PeriodicTable() {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setElements(PERIODIC_TABLE_DATA);
    setLoading(false);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading periodic table...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div
        className="inline-block gap-2 p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(18, minmax(60px, 1fr))',
          gridAutoRows: 'minmax(60px, auto)',
          gridAutoFlow: 'dense',
        }}
      >
        {elements.map((element) => (
          <Link
            key={element.atomicNumber}
            href={`/element/${element.symbol}`}
            className={`card-hover cursor-pointer flex flex-col items-center justify-center text-center border transition-all duration-300 hover:scale-110 ${
              CATEGORY_COLORS[element.category] || 'bg-slate-700/40 border-slate-600/50'
            }`}
            style={{
              gridColumn: element.col,
              gridRow: element.row,
            }}
          >
            <div className="text-xs text-slate-400">{element.atomicNumber}</div>
            <div className="text-sm font-bold">{element.symbol}</div>
            <div className="text-xs text-slate-300">{element.name}</div>
            <div className="text-xs text-slate-400">{element.atomicMass.toFixed(2)}</div>
          </Link>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${color}`} />
            <span className="text-sm text-slate-400">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
