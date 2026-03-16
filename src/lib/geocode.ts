const TOWN_COORDS: Record<string, [number, number]> = {
  'portsmouth': [43.0718, -70.7626],
  'dover': [43.1979, -70.8737],
  'kittery': [43.0881, -70.7356],
  'york': [43.1615, -70.6481],
  'rye': [43.0084, -70.7700],
  'newburyport': [42.8126, -70.8773],
  'hampton': [42.9376, -70.8389],
  'exeter': [42.9815, -70.9478],
  'newmarket': [43.0765, -70.9349],
  'durham': [43.1340, -70.9256],
  'newcastle': [43.0726, -70.7168],
  'new castle': [43.0726, -70.7168],
  'greenland': [43.0362, -70.8337],
  'stratham': [43.0201, -70.9026],
  'north hampton': [42.9730, -70.8337],
  'south berwick': [43.2348, -70.7312],
  'eliot': [43.1540, -70.7892],
  'ogunquit': [43.2488, -70.5969],
  'kennebunk': [43.3839, -70.5445],
  'kennebunkport': [43.3615, -70.4762],
  'wells': [43.3222, -70.5806],
  'saco': [43.5009, -70.4428],
  'scarborough': [43.5784, -70.3219],
  'cape neddick': [43.1942, -70.6164],
  'rochester': [43.3045, -70.9756],
  'somersworth': [43.2618, -70.8737],
  'rollinsford': [43.2340, -70.8279],
  'berwick': [43.2660, -70.8643],
  'biddeford': [43.4926, -70.4534],
  'old orchard beach': [43.5173, -70.3776],
  'salisbury': [42.8418, -70.8608],
  'amesbury': [42.8584, -70.9300],
  'newfields': [43.0402, -70.9711],
  'seabrook': [42.8954, -70.8711],
  'hampton falls': [42.9221, -70.8617],
  'lee': [43.1076, -70.9806],
  'barrington': [43.2223, -70.9506],
  'madbury': [43.1710, -70.9254],
  'raymond': [43.0345, -71.1836],
};

function jitter(): number {
  return (Math.random() - 0.5) * 0.008;
}

function extractTown(secondAddress: string): string {
  return secondAddress
    .replace(/,?\s*(NH|ME|MA|Maine|New Hampshire|Massachusetts)\s*\d*/gi, '')
    .trim()
    .toLowerCase();
}

export function geocodeLocal(
  _address: string,
  secondAddress: string
): [number, number] | null {
  const town = extractTown(secondAddress);
  const base = TOWN_COORDS[town];
  if (!base) return null;
  return [base[0] + jitter(), base[1] + jitter()];
}

export async function geocodeBatch(
  listings: { firstAddress: string; secondAddress: string }[]
): Promise<Map<string, [number, number] | null>> {
  const results = new Map<string, [number, number] | null>();

  for (const l of listings) {
    const key = `${l.firstAddress}, ${l.secondAddress}`;
    const coords = geocodeLocal(l.firstAddress, l.secondAddress);
    results.set(key, coords);
  }

  return results;
}
