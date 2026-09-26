export const INCENSE_LINES = [
    { slug: 'incense-zipper-pouches', name: 'Premium Incense Zipper Pouches', label: 'Zip Pouches', pack: '90 g' },
    { slug: 'incense-sticks-100g', name: 'Premium Incense Sticks 100g', label: 'Incense Sticks', pack: '100 g' },
    { slug: 'incense-sticks-33', name: 'Premium Incense Sticks 33', label: 'Incense Sticks', pack: '33 sticks' },
    { slug: 'incense-packs-10', name: 'Premium Incense Stick Packs', label: 'Incense Packs', pack: '10 sticks' },
];

export const DHOOP_LINES = [
    { slug: 'dhoop-sticks-100g', name: 'Premium Dhoop Sticks 100g', label: 'Dhoop Sticks', pack: '100 g' },
    { slug: 'dhoop-sticks-10', name: 'Premium Dhoop Sticks 10', label: 'Dhoop Sticks', pack: '10 sticks' },
    { slug: 'dhoop-packs-90', name: 'Premium Dhoop Stick Packs 90g', label: 'Dhoop Packs', pack: '90 g' },
    { slug: 'dhoop-cups', name: 'Premium Dhoop Cups', label: 'Dhoop Cups', pack: '12 cups' },
];

export const SHOP_FAMILIES = [
    {
        key: 'incense',
        title: 'Incense',
        href: '/incense',
        description: 'Zip pouches and charcoal-free incense sticks for daily prayer.',
        slugs: INCENSE_LINES.map((line) => line.slug),
        lines: INCENSE_LINES,
        image: 'https://praypure-images.s3.us-east-1.amazonaws.com/catalogue/2026/categories/incense-zipper-pouches.webp',
    },
    {
        key: 'dhoop',
        title: 'Dhoop',
        href: '/dhoop',
        description: 'Long-lasting dhoop sticks, packs, and sambrani cups.',
        slugs: DHOOP_LINES.map((line) => line.slug),
        lines: DHOOP_LINES,
        image: 'https://praypure-images.s3.us-east-1.amazonaws.com/catalogue/2026/categories/dhoop-sticks-100g.webp',
    },
    {
        key: 'cups',
        title: 'Dhoop Cups',
        href: '/dhoop-cups',
        description: 'Twelve-cup sambrani boxes for a lasting sacred fragrance.',
        slugs: ['dhoop-cups'],
        lines: [DHOOP_LINES[3]],
        image: 'https://praypure-images.s3.us-east-1.amazonaws.com/catalogue/2026/categories/dhoop-cups.webp',
    },
    {
        key: 'soon',
        title: 'Coming Soon',
        href: '/launching-soon',
        description: 'Jars, bambooless incense, and camphor for the prayer shelf.',
        slugs: ['launching-soon'],
        lines: [{ slug: 'launching-soon', label: 'Launching Soon', pack: '' }],
        image: 'https://praypure-images.s3.us-east-1.amazonaws.com/catalogue/2026/categories/launching-soon.webp',
    },
];

export const AMAZON_SHOP = 'https://www.amazon.in/s?k=praypure';
export const FLIPKART_SHOP = 'https://www.flipkart.com/search?q=praypure';
export const CONTACT_PHONE = '+91 63556 59566';
export const CONTACT_PHONE_TEL = '+916355659566';
export const CONTACT_WHATSAPP = 'https://wa.me/916355659566';
export const CONTACT_EMAIL = 'support@praypure.com';
