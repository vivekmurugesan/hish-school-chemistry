'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface AtomPosition {
  symbol: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
}

interface Bond {
  from: number;
  to: number;
}

const ATOM_COLORS: Record<string, string> = {
  H: '#ffffff',
  O: '#ff6b6b',
  C: '#808080',
  N: '#3050f8',
  S: '#ffff30',
  P: '#ff7f00',
  Cl: '#31f031',
  Br: '#a4522d',
  I: '#940094',
  Na: '#ab5cf2',
  Ca: '#3dff00',
  Fe: '#e6cc33',
  Cu: '#c88033',
};

const ATOM_RADIUS: Record<string, number> = {
  H: 1.2,
  O: 1.5,
  C: 1.7,
  N: 1.55,
  S: 1.8,
  P: 1.8,
  Cl: 1.75,
  Br: 1.85,
  I: 1.98,
  default: 1.5,
};

interface MoleculeViewer3DProps {
  formula: string;
  atoms: string[];
  structure?: string;
}

const getMoleculeStructure = (formula: string, atoms: string[]): { positions: AtomPosition[]; bonds: Bond[] } => {
  const formula_lower = formula.toLowerCase();

  // Water (H2O)
  if (formula_lower.includes('h') && formula_lower.includes('o') && atoms.length === 2) {
    return {
      positions: [
        { symbol: 'O', x: 0, y: 0, z: 0, radius: ATOM_RADIUS.O, color: ATOM_COLORS.O },
        { symbol: 'H', x: 1.0, y: 0.7, z: 0, radius: ATOM_RADIUS.H, color: ATOM_COLORS.H },
        { symbol: 'H', x: -1.0, y: 0.7, z: 0, radius: ATOM_RADIUS.H, color: ATOM_COLORS.H },
      ],
      bonds: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
      ],
    };
  }

  // Methane (CH4)
  if (formula_lower.includes('ch') && atoms.length === 2) {
    const angle = (Math.PI * 2) / 4;
    return {
      positions: [
        { symbol: 'C', x: 0, y: 0, z: 0, radius: ATOM_RADIUS.C, color: ATOM_COLORS.C },
        ...Array.from({ length: 4 }).map((_, i) => ({
          symbol: 'H',
          x: 1.5 * Math.cos(i * angle),
          y: 1.5 * Math.sin(i * angle),
          z: 1.5 * Math.cos(i * angle * 0.5),
          radius: ATOM_RADIUS.H,
          color: ATOM_COLORS.H,
        })),
      ],
      bonds: Array.from({ length: 4 }, (_, i) => ({ from: 0, to: i + 1 })),
    };
  }

  // CO2
  if (formula_lower.includes('co2') || (formula_lower.includes('c') && formula_lower.includes('o'))) {
    return {
      positions: [
        { symbol: 'O', x: -2, y: 0, z: 0, radius: ATOM_RADIUS.O, color: ATOM_COLORS.O },
        { symbol: 'C', x: 0, y: 0, z: 0, radius: ATOM_RADIUS.C, color: ATOM_COLORS.C },
        { symbol: 'O', x: 2, y: 0, z: 0, radius: ATOM_RADIUS.O, color: ATOM_COLORS.O },
      ],
      bonds: [
        { from: 1, to: 0 },
        { from: 1, to: 2 },
      ],
    };
  }

  // NaCl
  if ((formula_lower.includes('na') && formula_lower.includes('cl')) || formula === 'NaCl') {
    return {
      positions: [
        { symbol: 'Na', x: -1.5, y: 0, z: 0, radius: ATOM_RADIUS.Na, color: ATOM_COLORS.Na },
        { symbol: 'Cl', x: 1.5, y: 0, z: 0, radius: ATOM_RADIUS.Cl, color: ATOM_COLORS.Cl },
      ],
      bonds: [{ from: 0, to: 1 }],
    };
  }

  // Default: simple linear structure
  return {
    positions: atoms.slice(0, 3).map((atom, i) => ({
      symbol: atom[0],
      x: (i - 1) * 2,
      y: 0,
      z: 0,
      radius: ATOM_RADIUS[atom[0]] || ATOM_RADIUS.default,
      color: ATOM_COLORS[atom[0]] || '#cccccc',
    })),
    bonds: atoms.slice(0, 2).map((_, i) => ({ from: i, to: i + 1 })),
  };
};

const AtomSphere = ({ position, radius, color }: { position: [number, number, number]; radius: number; color: string }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhongMaterial color={color} shininess={100} />
    </mesh>
  );
};

const Bond = ({ from, to }: { from: [number, number, number]; to: [number, number, number] }) => {
  const midpoint: [number, number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const distance = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2) + Math.pow(to[2] - from[2], 2));

  return (
    <mesh position={midpoint} rotation={[0, 0, Math.atan2(to[1] - from[1], to[0] - from[0])]}>
      <cylinderGeometry args={[0.15, 0.15, distance, 8]} />
      <meshPhongMaterial color="#cccccc" />
    </mesh>
  );
};

const MoleculeScene = ({ formula, atoms }: { formula: string; atoms: string[] }) => {
  const { positions, bonds } = getMoleculeStructure(formula, atoms);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 10]} intensity={0.4} />

      {bonds.map((bond, i) => (
        <Bond
          key={`bond-${i}`}
          from={[positions[bond.from].x, positions[bond.from].y, positions[bond.from].z]}
          to={[positions[bond.to].x, positions[bond.to].y, positions[bond.to].z]}
        />
      ))}

      {positions.map((atom, i) => (
        <AtomSphere
          key={`atom-${i}`}
          position={[atom.x, atom.y, atom.z]}
          radius={atom.radius}
          color={atom.color}
        />
      ))}

      <OrbitControls autoRotate autoRotateSpeed={4} />
    </>
  );
};

export function MoleculeViewer3D({ formula, atoms, structure }: MoleculeViewer3DProps) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
      <Canvas>
        <MoleculeScene formula={formula} atoms={atoms} />
      </Canvas>
    </div>
  );
}
