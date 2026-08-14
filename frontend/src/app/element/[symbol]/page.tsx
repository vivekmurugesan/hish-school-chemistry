'use client';

import { useState, useEffect } from 'react';
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
  const router = useRouter();
  const [element, setElement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchElementDetails();
  }, [symbol]);

  const fetchElementDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8000/api/elements/generate/${symbol}`);

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Element not found');
        return;
      }

      const elementData = await response.json();
      const normalizedElement = normalizeElementData(elementData);
      setElement(normalizedElement);
    } catch (err) {
      console.error('Error fetching element:', err);
      const fallbackElement = ELEMENT_DATA[symbol.toUpperCase()];
      if (fallbackElement) {
        setElement(fallbackElement);
      } else {
        setError('Failed to load element details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const normalizeElementData = (data: any) => {
    return {
      atomicNumber: data.atomic_number,
      symbol: data.symbol,
      name: data.name,
      atomicMass: data.atomic_mass,
      category: data.category,
      electronegativity: data.electronegativity,
      boilingPoint: data.boiling_point,
      meltingPoint: data.melting_point,
      density: data.density,
      electronConfiguration: data.electron_configuration,
      valenceElectrons: data.valence_electrons,
      description: data.description,
      interactsWith: data.reacts_with,
      facts: data.interesting_facts,
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-slate-400">Loading element details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !element) {
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
          <div className="card p-8 text-center">
            <p className="text-slate-300 text-lg mb-4">
              {error || `Element ${symbol.toUpperCase()} not found.`}
            </p>
            <p className="text-slate-400 mb-6">
              Please try one of these elements or search the periodic table:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['H', 'He', 'Li', 'C', 'N', 'O', 'F', 'Na', 'K', 'Ca', 'Fe', 'Cu', 'Ag', 'Au', 'U'].map((el) => (
                <button
                  key={el}
                  onClick={() => router.push(`/element/${el}`)}
                  className="px-3 py-1 bg-purple-600/50 hover:bg-purple-600 rounded border border-purple-500/50 text-sm"
                >
                  {el}
                </button>
              ))}
            </div>
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
              <svg viewBox="0 0 200 200" className="w-full aspect-square">
                {/* Nucleus */}
                <circle cx="100" cy="100" r="12" fill="#EC4899" />
                <text x="100" y="105" textAnchor="middle" fontSize="10" fill="white" className="font-bold">
                  {element.atomicNumber}
                </text>

                {/* Electron orbitals */}
                <circle cx="100" cy="100" r="40" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
                <circle cx="100" cy="100" r="95" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />

                {/* Electrons on first shell (max 2) */}
                {element.atomicNumber >= 1 && (
                  <circle cx="140" cy="100" r="5" fill="#3B82F6" />
                )}
                {element.atomicNumber >= 2 && (
                  <circle cx="60" cy="100" r="5" fill="#3B82F6" />
                )}

                {/* Electrons on second shell (max 8) */}
                {element.atomicNumber >= 3 && Array.from({ length: Math.min(element.atomicNumber - 2, 8) }).map((_, i) => (
                  <circle
                    key={`e2-${i}`}
                    cx={100 + 70 * Math.cos((i / 8) * Math.PI * 2)}
                    cy={100 + 70 * Math.sin((i / 8) * Math.PI * 2)}
                    r="4"
                    fill="#06B6D4"
                  />
                ))}
              </svg>
              <p className="text-xs text-slate-400 mt-2 text-center">
                {element.electronConfiguration}
              </p>
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
