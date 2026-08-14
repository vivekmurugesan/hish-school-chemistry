'use client';

import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';

const MOLECULE_DETAILS: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Water',
    formula: 'H₂O',
    description: 'Essential for all known forms of life',
    atoms: ['Hydrogen', 'Oxygen'],
    structure: 'Bent molecular geometry',
    polarity: 'Polar',
    bondType: 'Covalent',
    molecularWeight: '18.015 g/mol',
    uses: ['Solvent', 'Coolant', 'Life essence', 'Universal solvent'],
    properties: [
      'Boiling Point: 100°C',
      'Melting Point: 0°C',
      'Density: 1 g/cm³',
      'pH: 7 (neutral)',
    ],
    equation: '2H₂ + O₂ → 2H₂O',
    facts: [
      'Water covers about 71% of Earth\'s surface',
      'The human body is about 60% water',
      'Water is the only substance that exists in all three states at Earth temperatures',
    ],
  },
  '2': {
    id: 2,
    name: 'Methane',
    formula: 'CH₄',
    description: 'Simple hydrocarbon',
    atoms: ['Carbon', 'Hydrogen'],
    structure: 'Tetrahedral',
    polarity: 'Nonpolar',
    bondType: 'Covalent',
    molecularWeight: '16.043 g/mol',
    uses: ['Fuel', 'Energy', 'Chemical feedstock'],
    properties: [
      'Boiling Point: -161.5°C',
      'Melting Point: -182.5°C',
      'Gas at room temperature',
    ],
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    facts: [
      'Methane is the primary component of natural gas',
      'It\'s 25 times more potent than CO₂ as a greenhouse gas',
      'Produced in wetlands, ruminant stomachs, and landfills',
    ],
  },
  '3': {
    id: 3,
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    description: 'Greenhouse gas',
    atoms: ['Carbon', 'Oxygen'],
    structure: 'Linear molecular geometry',
    polarity: 'Nonpolar',
    bondType: 'Covalent',
    molecularWeight: '44.009 g/mol',
    uses: ['Photosynthesis', 'Beverages', 'Industrial'],
    properties: [
      'Sublimes at -78.5°C',
      'Gas at room temperature',
      'Odorless and colorless',
    ],
    equation: '2C + O₂ → 2CO',
    facts: [
      'Plants convert CO₂ into oxygen during photosynthesis',
      'Used in fire extinguishers',
      'Dry ice is solid CO₂',
    ],
  },
  '4': {
    id: 4,
    name: 'Sodium Chloride',
    formula: 'NaCl',
    description: 'Table salt',
    atoms: ['Sodium', 'Chlorine'],
    structure: 'Cubic crystal lattice',
    polarity: 'Ionic',
    bondType: 'Ionic',
    molecularWeight: '58.443 g/mol',
    uses: ['Seasoning', 'Preservative', 'Chemical industry'],
    properties: [
      'Boiling Point: 1465°C',
      'Melting Point: 801°C',
      'Soluble in water',
    ],
    equation: 'Na + Cl₂ → 2NaCl',
    facts: [
      'Salt is essential for human health and body functions',
      'Ancient civilizations traded salt as currency',
      'The Dead Sea has exceptionally high salt concentration',
    ],
  },
};

export default function MoleculeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const molecule = MOLECULE_DETAILS[id];

  if (!molecule) {
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
            <p className="text-slate-400 text-lg">Molecule not found</p>
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
          Back to Molecules
        </button>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="card p-8">
              <div className="mb-8">
                <h1 className="text-5xl font-bold mb-2 gradient-text">{molecule.name}</h1>
                <h2 className="text-3xl font-semibold text-slate-300 mb-4 font-mono">{molecule.formula}</h2>
                <p className="text-slate-300 text-lg">{molecule.description}</p>
              </div>

              {/* Chemical Equation */}
              <div className="bg-slate-700/50 p-6 rounded-lg mb-8 border border-slate-600">
                <h3 className="font-semibold mb-3 text-purple-300">Chemical Reaction</h3>
                <p className="font-mono text-lg text-center text-slate-200">{molecule.equation}</p>
              </div>

              {/* Structure Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Molecular Structure</p>
                  <p className="text-lg font-semibold">{molecule.structure}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Molecular Weight</p>
                  <p className="text-lg font-semibold">{molecule.molecularWeight}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Bond Type</p>
                  <p className="text-lg font-semibold">{molecule.bondType}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Polarity</p>
                  <p className="text-lg font-semibold">{molecule.polarity}</p>
                </div>
              </div>

              {/* Properties */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Physical Properties</h3>
                <div className="space-y-2">
                  {molecule.properties.map((prop: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-slate-300">{prop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uses */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Common Uses</h3>
                <div className="flex flex-wrap gap-2">
                  {molecule.uses.map((use: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-blue-600/30 border border-blue-500/50 rounded-lg text-sm">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interesting Facts */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Interesting Facts</h3>
                <div className="space-y-3">
                  {molecule.facts.map((fact: string, i: number) => (
                    <div key={i} className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                      <p className="text-slate-300">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Atoms Involved */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Atoms Involved</h3>
              <div className="space-y-2">
                {molecule.atoms.map((atom: string, i: number) => (
                  <div key={i} className="px-3 py-2 bg-slate-700/50 rounded-lg text-sm">
                    {atom}
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Model Placeholder */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">3D Structure</h3>
              <div className="w-full aspect-square relative bg-slate-700/30 rounded-lg flex items-center justify-center">
                <div className="text-sm text-slate-400 text-center">
                  3D visualization coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
