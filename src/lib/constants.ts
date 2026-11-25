export const BRAND = {
  name: 'Rent With You',
  shortName: 'Rent With You',
  tagline: 'RENT | BUY | MOVE',
  subTagline: 'Rent, buy and move - all in one place',
  description:
    'Rent With You helps you find homes, rooms and commercial spaces from owners and trusted dealers. Search, save your favourites, and chat with us on WhatsApp.',
  phone: '+91 9911169115',
  phoneClean: '919911169115',
  email: 'rentwithyou.gurgaon@gmail.com',
  instagram: '@rent.withyou',
  instagramUrl: 'https://instagram.com/rent.withyou',
  address: 'Golf Course Extension Road, Sector 65, Gurgaon, Haryana 122001',
  copyright: '© 2026 Rent With You. All rights reserved.',
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'rentwithyou.gurgaon@gmail.com',
  adminEmails: [
    'satya2me2@gmail.com',
    'rentwithyou.gurgaon@gmail.com',
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase().trim(),
  ].filter(Boolean),
  defaultVisitorCount: 12480,
};

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return BRAND.adminEmails.some((e) => e.toLowerCase().trim() === lower);
}

export const COLORS = {
  primaryDark: '#1B2A4A',
  primaryNavy: '#1E2E48',
  accentGold: '#E59A38',
  accentAmber: '#F59E0B',
  surfaceCream: '#F4EFEA',
  surfaceBeige: '#FAF8F5',
  whatsappGreen: '#1F8A5B',
};

export function getWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BRAND.phoneClean}?text=${encoded}`;
}

export function formatPrice(price: number, category: string): string {
  if (category === 'rent' || category === 'commercial') {
    return `₹${price.toLocaleString('en-IN')} / month`;
  }
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr onwards`;
  }
  if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh onwards`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatRupeeLabel(label?: string | null): string {
  if (!label) return 'Price on request';
  return label.replace(/Rs\.\s*/gi, '₹');
}

export interface PropertySpecs {
  area_sqft?: string;
  floor?: string;
  deposit?: string;
  no_brokerage?: boolean;
}

const SPECS_REGEX = /\n?<!--specs:(\{[\s\S]*?\})-->/i;

export function parsePropertySpecs(property: {
  description?: string;
  area_sqft?: string;
  floor?: string;
  deposit?: string;
  no_brokerage?: boolean;
}): PropertySpecs & { cleanDescription: string } {
  const rawDesc = property.description || '';
  let parsed: PropertySpecs = {};

  const match = rawDesc.match(SPECS_REGEX);
  if (match && match[1]) {
    try {
      parsed = JSON.parse(match[1]) as PropertySpecs;
    } catch {
      // ignore malformed specs
    }
  }

  const cleanDescription = rawDesc
    .replace(SPECS_REGEX, '')
    .replace(/Listed by:\s*[^|\n]+(\s*\|\s*)?/gi, '')
    .replace(/Property ID:\s*[^\n|]+/gi, '')
    .trim();

  return {
    area_sqft: property.area_sqft || parsed.area_sqft || undefined,
    floor: property.floor || parsed.floor || undefined,
    deposit: property.deposit || parsed.deposit || undefined,
    no_brokerage:
      property.no_brokerage !== undefined ? property.no_brokerage : parsed.no_brokerage,
    cleanDescription,
  };
}

export function attachPropertySpecs(description: string, specs: PropertySpecs): string {
  const clean = (description || '').replace(SPECS_REGEX, '').trim();
  const payload: PropertySpecs = {};
  if (specs.area_sqft?.trim()) payload.area_sqft = specs.area_sqft.trim();
  if (specs.floor?.trim()) payload.floor = specs.floor.trim();
  if (specs.deposit?.trim()) payload.deposit = specs.deposit.trim();
  if (specs.no_brokerage) payload.no_brokerage = true;

  if (Object.keys(payload).length === 0) return clean;
  return `${clean}\n<!--specs:${JSON.stringify(payload)}-->`;
}
