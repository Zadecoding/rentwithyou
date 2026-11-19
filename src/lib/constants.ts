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
    return `Rs. ${price.toLocaleString('en-IN')} / month`;
  }
  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2).replace(/\.00$/, '');
    return `Rs. ${cr} Cr onwards`;
  }
  if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
    return `Rs. ${lakh} Lakh onwards`;
  }
  return `Rs. ${price.toLocaleString('en-IN')}`;
}
