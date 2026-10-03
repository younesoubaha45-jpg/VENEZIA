/**
 * Firestore Security Rules Test Suite for Venezia Shoes
 * Verifies all Dirty Dozen payloads return PERMISSION_DENIED.
 */
export const dirtyDozenPayloads = [
  { name: 'Shadow Field Injection', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', isSuperAdmin: true }, expected: 'PERMISSION_DENIED' },
  { name: 'Oversized ID', collection: 'products', id: 'a'.repeat(200), payload: { id: 'p1', category: 'bags', image: 'img.jpg' }, expected: 'PERMISSION_DENIED' },
  { name: 'Invalid ID Regex', collection: 'products', id: 'bad$id', payload: { id: 'bad$id', category: 'bags', image: 'img.jpg' }, expected: 'PERMISSION_DENIED' },
  { name: 'Invalid Category', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'cars', image: 'img.jpg' }, expected: 'PERMISSION_DENIED' },
  { name: 'Oversized Name', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', name: 'x'.repeat(500) }, expected: 'PERMISSION_DENIED' },
  { name: 'Oversized Description', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', description: 'x'.repeat(2500) }, expected: 'PERMISSION_DENIED' },
  { name: 'Negative Price', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', price: -10 }, expected: 'PERMISSION_DENIED' },
  { name: 'Unbounded Colors Array', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', colors: new Array(25).fill({ name: 'a', hex: '#000' }) }, expected: 'PERMISSION_DENIED' },
  { name: 'Unbounded Highlights Array', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', highlights: new Array(25).fill('a') }, expected: 'PERMISSION_DENIED' },
  { name: 'Immutable ID Mutation', collection: 'products', id: 'p1', payload: { id: 'p2', category: 'bags', image: 'img.jpg' }, expected: 'PERMISSION_DENIED' },
  { name: 'Value Poisoning Price Type', collection: 'products', id: 'p1', payload: { id: 'p1', category: 'bags', image: 'img.jpg', price: 'invalid' }, expected: 'PERMISSION_DENIED' },
  { name: 'Arbitrary Collection Access', collection: 'secret', id: 'doc1', payload: { test: true }, expected: 'PERMISSION_DENIED' }
];
