const BASE_ALPHABET = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;
const MAX_AID = 1n << 51n;
const BASE = 58n;

const CHAR_INDEX = new Map<string, number>();
for (let i = 0; i < BASE_ALPHABET.length; i += 1) {
  CHAR_INDEX.set(BASE_ALPHABET[i], i);
}

const CHAR_SET = new Set(BASE_ALPHABET.split(''));

const BV_TEMPLATE = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
const SWAP_INDICES: ReadonlyArray<[number, number]> = [
  [3, 9],
  [4, 7],
];

const BV_PATTERN = /(BV[0-9A-Za-z]{10})/i;

const applySwaps = (chars: string[]) => {
  SWAP_INDICES.forEach(([left, right]) => {
    [chars[left], chars[right]] = [chars[right], chars[left]];
  });
};

const isValidBvid = (value: string) =>
  value.length === 12 &&
  value.startsWith('BV') &&
  [...value.slice(2)].every((char) => CHAR_SET.has(char));

export const extractBvid = (input: string): string | null => {
  const raw = input.trim();
  if (!raw) {
    return null;
  }

  const match = raw.match(BV_PATTERN);
  if (!match) {
    return null;
  }

  const candidate = `BV${match[0].slice(2)}`;
  return isValidBvid(candidate) ? candidate : null;
};

export const bvToAv = (bvid: string): bigint => {
  if (!isValidBvid(bvid)) {
    throw new Error('Invalid BVID');
  }

  const bvidChars = Array.from(bvid);
  applySwaps(bvidChars);
  const payloadChars = bvidChars.slice(3);

  const encoded = payloadChars.reduce((acc, char) => {
    const value = CHAR_INDEX.get(char);
    if (value === undefined) {
      throw new Error('Invalid BVID character');
    }
    return acc * BASE + BigInt(value);
  }, 0n);

  return (encoded & MASK_CODE) ^ XOR_CODE;
};

export const avToBv = (aid: bigint | number): string => {
  const normalized = typeof aid === 'bigint' ? aid : BigInt(aid);
  if (normalized < 0n) {
    throw new Error('Invalid AVID');
  }

  const bytes = [...BV_TEMPLATE];
  let cursor = bytes.length - 1;
  let remainder = (MAX_AID | normalized) ^ XOR_CODE;

  while (remainder > 0n && cursor >= 0) {
    const index = Number(remainder % BASE);
    bytes[cursor] = BASE_ALPHABET[index];
    remainder /= BASE;
    cursor -= 1;
  }

  applySwaps(bytes);
  return bytes.join('');
};

export const formatAvId = (aid: bigint | number) => `AV${aid.toString()}`;

