'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { MoleculeViewer3D } from '@/components/MoleculeViewer3D';
import { ArrowLeft } from 'lucide-react';

const SAMPLE_MOLECULES: Record<string, any> = {
  '1': { name: 'Water' },
  '2': { name: 'Methane' },
  '3': { name: 'Carbon Dioxide' },
  '4': { name: 'Sodium Chloride' },
  '5': { name: 'Glucose' },
  '6': { name: 'Oxygen' },
  '7': { name: 'Ammonia' },
  '8': { name: 'Ethanol' },
  '9': { name: 'Sulfuric Acid' },
  '10': { name: 'Hydrogen' },
};

export default function MoleculeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [molecule, setMolecule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMoleculeDetails();
  }, [id]);

  const fetchMoleculeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const moleculeName = SAMPLE_MOLECULES[id]?.name;
      if (!moleculeName) {
        setError('Molecule not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/molecules/generate/${moleculeName}`);

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to load molecule details');
        setLoading(false);
        return;
      }

      const moleculeData = await response.json();
      const normalizedMolecule = normalizeMoleculeData(moleculeData);
      setMolecule(normalizedMolecule);
    } catch (err) {
      console.error('Error fetching molecule:', err);
      setError('Failed to load molecule details');
    } finally {
      setLoading(false);
    }
  };

  const normalizeMoleculeData = (data: any) => {
    return {
      name: data.name,
      formula: data.formula,
      description: data.description,
      atoms: data.atoms,
      structure: data.structure,
      polarity: data.polarity,
      bondType: data.bond_type,
      molecularWeight: data.molecular_weight,
      uses: data.uses,
      properties: data.properties,
      equation: data.equation,
      facts: data.interesting_facts,
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-slate-400">Loading molecule details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !molecule) {
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
            <p className="text-slate-400 text-lg">{error || 'Molecule not found'}</p>
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

            {/* 3D Model */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">3D Structure</h3>
              <MoleculeViewer3D
                formula={molecule.formula}
                atoms={molecule.atoms}
                structure={molecule.structure}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
