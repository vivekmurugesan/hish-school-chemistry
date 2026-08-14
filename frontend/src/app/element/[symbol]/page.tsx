'use client';

import { Navigation } from '@/components/Navigation';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Atom, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Sample element data
const ELEMENT_DATA: Record<string, any> = {
  H: {
    name: 'Hydrogen',
    atomicNumber: 1,
    symbol: 'H',
    atomicMass: 1.008,
    category: 'Nonmetal',
    electronegativity: 2.20,
    boilingPoint: '-252.87°C',
    meltingPoint: '-259.14°C',
    density: '0.08988 g/L',
    electronConfiguration: '1s¹',
    valenceElectrons: 1,
    description:
      'Hydrogen is the lightest and most abundant element in the universe. It is a gas at room temperature.',
    interactsWith: ['O', 'N', 'C', 'S', 'Cl'],
    facts: [
      'Hydrogen gas can be combustible and produce water as the only byproduct',
      'Used in fuel cells for clean energy',
      'Makes up about 75% of all ordinary matter in the universe',
    ],
  },
  O: {
    name: 'Oxygen',
    atomicNumber: 8,
    symbol: 'O',
    atomicMass: 15.999,
    category: 'Nonmetal',
    electronegativity: 3.44,
    boilingPoint: '-183.34°C',
    meltingPoint: '-218.79°C',
    density: '1.429 g/L',
    electronConfiguration: '1s² 2s² 2p⁴',
    valenceElectrons: 6,
    description:
      'Oxygen is essential for respiration in most organisms. It is highly reactive and forms compounds with almost all elements.',
    interactsWith: ['H', 'C', 'N', 'S', 'P'],
    facts: [
      'Oxygen is the most abundant element in Earth\'s crust',
      'Ozone (O₃) is a form of oxygen that protects Earth from UV radiation',
      'Makes up about 21% of Earth\'s atmosphere',
    ],
  },
  C: {
    name: 'Carbon',
    atomicNumber: 6,
    symbol: 'C',
    atomicMass: 12.011,
    category: 'Nonmetal',
    electronegativity: 2.55,
    boilingPoint: '3,727°C (sublimation)',
    meltingPoint: '3,550°C',
    density: '2.26 g/cm³ (graphite)',
    electronConfiguration: '1s² 2s² 2p²',
    valenceElectrons: 4,
    description:
      'Carbon is the basis for all known life. It forms the backbone of all organic molecules and can bond with almost any element.',
    interactsWith: ['H', 'O', 'N', 'S', 'P', 'Cl'],
    facts: [
      'Carbon has multiple allotropes: diamond, graphite, and fullerenes',
      'Diamond is the hardest known natural substance',
      'Carbon forms the backbone of all biological molecules',
    ],
  },
};

export default function ElementPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const element = ELEMENT_DATA[symbol.toUpperCase()];
  const router = useRouter();

  if (!element) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <div className="text-center">
            <p className="text-slate-400 text-lg">Element not found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Periodic Table
        </button>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Element Card */}
          <div className="md:col-span-2">
            <div className="card p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-slate-400 mb-2">Atomic Number: {element.atomicNumber}</p>
                  <h1 className="text-5xl font-bold mb-2 gradient-text">{element.symbol}</h1>
                  <h2 className="text-3xl font-semibold text-slate-200">{element.name}</h2>
                </div>
                <Atom className="w-16 h-16 text-purple-400 opacity-50" />
              </div>

              <p className="text-slate-300 mb-8">{element.description}</p>

              {/* Key Properties */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Atomic Mass</p>
                  <p className="text-lg font-semibold">{element.atomicMass}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Category</p>
                  <p className="text-lg font-semibold">{element.category}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Electronegativity</p>
                  <p className="text-lg font-semibold">{element.electronegativity}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Valence Electrons</p>
                  <p className="text-lg font-semibold">{element.valenceElectrons}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Melting Point</p>
                  <p className="text-lg font-semibold">{element.meltingPoint}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Boiling Point</p>
                  <p className="text-lg font-semibold">{element.boilingPoint}</p>
                </div>
              </div>

              {/* Electron Configuration */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Electron Configuration</h3>
                <div className="bg-slate-700/50 p-4 rounded-lg font-mono text-purple-300">
                  {element.electronConfiguration}
                </div>
              </div>

              {/* Interesting Facts */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Interesting Facts
                </h3>
                <div className="space-y-3">
                  {element.facts.map((fact: string, i: number) => (
                    <div
                      key={i}
                      className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bohr Model */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Bohr Model</h3>
              <div className="w-full aspect-square relative bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-sm text-slate-400 text-center">
                  3D visualization coming soon
                </div>
              </div>
            </div>

            {/* Reacts With */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Commonly Reacts With</h3>
              <div className="space-y-2">
                {element.interactsWith.map((el: string, i: number) => (
                  <Link
                    key={i}
                    href={`/element/${el}`}
                    className="block px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors text-sm font-semibold"
                  >
                    {el}
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <button className="w-full btn-primary">
              Add to Notes
            </button>
            <button className="w-full btn-secondary">
              Find Molecules
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
