db.createCollection('elements');
db.createCollection('quiz_scores');
db.createCollection('notes');

db.elements.insertMany([
  {
    atomic_number: 1,
    symbol: 'H',
    name: 'Hydrogen',
    atomic_mass: 1.008,
    category: 'Nonmetal',
    electron_configuration: '1s¹',
    valence_electrons: 1,
    electronegativity: 2.20,
    melting_point: '-259.14°C',
    boiling_point: '-252.87°C',
    density: '0.08988 g/L',
    description: 'Hydrogen is the lightest element and most abundant in the universe.',
    reacts_with: ['O', 'N', 'C', 'S', 'Cl'],
    interesting_facts: [
      'Hydrogen gas is combustible and produces only water as a byproduct',
      'Used in fuel cells for clean energy',
      'Makes up about 75% of all ordinary matter',
    ],
  },
  {
    atomic_number: 6,
    symbol: 'C',
    name: 'Carbon',
    atomic_mass: 12.011,
    category: 'Nonmetal',
    electron_configuration: '1s² 2s² 2p²',
    valence_electrons: 4,
    electronegativity: 2.55,
    melting_point: '3,550°C',
    boiling_point: '3,727°C (sublimation)',
    density: '2.26 g/cm³ (graphite)',
    description: 'Carbon is the basis for all known life and forms the backbone of organic molecules.',
    reacts_with: ['H', 'O', 'N', 'S', 'P', 'Cl'],
    interesting_facts: [
      'Carbon has multiple allotropes: diamond, graphite, and fullerenes',
      'Diamond is the hardest known natural substance',
      'Carbon dating is used to determine the age of ancient objects',
    ],
  },
  {
    atomic_number: 8,
    symbol: 'O',
    name: 'Oxygen',
    atomic_mass: 15.999,
    category: 'Nonmetal',
    electron_configuration: '1s² 2s² 2p⁴',
    valence_electrons: 6,
    electronegativity: 3.44,
    melting_point: '-218.79°C',
    boiling_point: '-183.34°C',
    density: '1.429 g/L',
    description: 'Oxygen is essential for respiration and is highly reactive with most elements.',
    reacts_with: ['H', 'C', 'N', 'S', 'P'],
    interesting_facts: [
      'Oxygen is the most abundant element in Earth\'s crust',
      'Ozone (O₃) protects Earth from harmful UV radiation',
      'Makes up about 21% of Earth\'s atmosphere',
    ],
  },
]);

print('MongoDB initialization complete!');
