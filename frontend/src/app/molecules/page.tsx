'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Search } from 'lucide-react';

const SAMPLE_MOLECULES = [
  {
    id: 1,
    name: 'Water',
    formula: 'H₂O',
    description: 'A polar molecule essential for all known forms of life',
    atoms: 'Hydrogen, Oxygen',
    polarity: 'Polar',
  },
  {
    id: 2,
    name: 'Methane',
    formula: 'CH₄',
    description: 'A simple hydrocarbon gas used as fuel',
    atoms: 'Carbon, Hydrogen',
    polarity: 'Nonpolar',
  },
  {
    id: 3,
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    description: 'A greenhouse gas produced by burning fossil fuels',
    atoms: 'Carbon, Oxygen',
    polarity: 'Nonpolar',
  },
  {
    id: 4,
    name: 'Sodium Chloride',
    formula: 'NaCl',
    description: 'Common table salt, an ionic compound',
    atoms: 'Sodium, Chlorine',
    polarity: 'Ionic',
  },
  {
    id: 5,
    name: 'Glucose',
    formula: 'C₆H₁₂O₆',
    description: 'A simple sugar produced during photosynthesis',
    atoms: 'Carbon, Hydrogen, Oxygen',
    polarity: 'Polar',
  },
  {
    id: 6,
    name: 'Oxygen',
    formula: 'O₂',
    description: 'Diatomic molecule essential for respiration',
    atoms: 'Oxygen',
    polarity: 'Nonpolar',
  },
];

export default function MoleculesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMolecules = SAMPLE_MOLECULES.filter(
    (mol) =>
      mol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mol.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Molecular Explorer</h1>
          <p className="text-slate-400">Search and explore different molecules and their properties</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by molecule name or formula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Molecules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMolecules.map((molecule) => (
            <div
              key={molecule.id}
              className="card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{molecule.name}</h3>
                  <p className="text-purple-400 font-mono">{molecule.formula}</p>
                </div>
              </div>

              <p className="text-slate-400 mb-4">{molecule.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Atoms:</span>
                  <span className="text-slate-200">{molecule.atoms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Polarity:</span>
                  <span className="text-slate-200">{molecule.polarity}</span>
                </div>
              </div>

              <button className="w-full btn-primary text-center">
                View in 3D
              </button>
            </div>
          ))}
        </div>

        {filteredMolecules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No molecules found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </main>
  );
}
