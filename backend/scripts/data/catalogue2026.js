/**
 * PrayPure Product Catalogue 2026 v18
 * Source: PrayPure_Product_Catalogue_2026_v18.pdf
 *
 * Each live line is its own category so a category page stays within
 * the storefront's page size. Pack size, SKU, and GTIN live on the product.
 */

const group = (shared, items) =>
    items.map((item, index) => ({
        price: shared.mrp,
        isNew: false,
        isActive: true,
        ...shared,
        ...item,
        sortOrder: shared.sortBase + index,
        slug: item.sku.toLowerCase(),
        gtin: item.gtin || ''
    }));

const categories = [
    {
        name: 'Premium Incense Zipper Pouches',
        title: 'Premium Incense Zipper Pouches',
        subtitle: 'Luxury incense sticks in resealable freshness packs, charcoal-free, stand inside',
        description: '90 g zipper pouches. MRP ₹70.',
        slug: 'incense-zipper-pouches',
        status: 'Live',
        order: 1,
        imageFile: 'pouch-amber-hero.png',
        navLabel: 'Zip Pouches'
    },
    {
        name: 'Premium Incense Sticks 100g',
        title: 'Premium Incense Sticks',
        subtitle: 'Pure incense sticks crafted with sacred cow dung, charcoal-free',
        description: '100 g packs. MRP ₹85.',
        slug: 'incense-sticks-100g',
        status: 'Live',
        order: 2,
        imageFile: 'agarbatti100-rose-hero.png',
        navLabel: 'Incense 100g'
    },
    {
        name: 'Premium Incense Sticks 33',
        title: 'Premium Incense Sticks',
        subtitle: 'Thirty-three stick packs of charcoal-free GauNirmal incense, stand inside',
        description: '33 sticks. MRP ₹35.',
        slug: 'incense-sticks-33',
        status: 'Live',
        order: 3,
        imageFile: 'incense33-rose-hero.png',
        navLabel: 'Incense 33'
    },
    {
        name: 'Premium Incense Stick Packs',
        title: 'Premium Incense Stick Packs',
        subtitle: 'Ten charcoal-free incense sticks',
        description: '10 sticks. MRP ₹15.',
        slug: 'incense-packs-10',
        status: 'Live',
        order: 4,
        imageFile: 'pack-incense-rose.png',
        navLabel: 'Incense 10'
    },
    {
        name: 'Premium Dhoop Sticks 100g',
        title: 'Premium Dhoop Sticks',
        subtitle: 'Rich, long-lasting dhoop sticks rolled with sacred cow dung, charcoal-free',
        description: '100 g packs. MRP ₹85.',
        slug: 'dhoop-sticks-100g',
        status: 'Live',
        order: 5,
        imageFile: 'dhoop100-chandan-hero.png',
        navLabel: 'Dhoop 100g'
    },
    {
        name: 'Premium Dhoop Sticks 10',
        title: 'Premium Dhoop Sticks',
        subtitle: 'Ten-stick packs of charcoal-free dhoop, stand inside',
        description: '10 sticks. MRP ₹15.',
        slug: 'dhoop-sticks-10',
        status: 'Live',
        order: 6,
        imageFile: 'dhoop10-chandan-hero.png',
        navLabel: 'Dhoop 10'
    },
    {
        name: 'Premium Dhoop Stick Packs 90g',
        title: 'Premium Dhoop Stick Packs',
        subtitle: 'Charcoal-free dhoop sticks',
        description: '90 g packs. MRP ₹60.',
        slug: 'dhoop-packs-90',
        status: 'Live',
        order: 7,
        imageFile: 'pack-dhoop-chandan.png',
        navLabel: 'Dhoop 90g'
    },
    {
        name: 'Premium Dhoop Cups',
        title: 'Premium Dhoop Cups',
        subtitle: 'Rich sambrani cups for a lasting sacred fragrance, charcoal-free',
        description: '12 cups. MRP ₹84.',
        slug: 'dhoop-cups',
        status: 'Live',
        order: 8,
        imageFile: 'box-kapur-card.png',
        navLabel: 'Dhoop Cups'
    },
    {
        name: 'Launching Soon',
        title: 'Launching Soon',
        subtitle: 'Jar formats for the prayer shelf — charcoal-free, ready to display',
        description: 'Dhoop stick jars, dhoop cone jars, bambooless incense, and camphor jars.',
        slug: 'launching-soon',
        status: 'Coming Soon',
        order: 9,
        imageFile: 'soon-jar-dhoop-stick.png',
        navLabel: 'Coming Soon'
    }
];

const products = [
    ...group({
        category: 'Premium Incense Zipper Pouches',
        collection: 'Premium Incense Zipper Pouches',
        netQuantity: '90 g',
        mrp: 70,
        isNew: true,
        sortBase: 1,
        description: 'Luxury incense sticks in resealable freshness packs, charcoal-free, with a stand inside.'
    }, [
        { sku: 'PP-PISZ-GOLDEN-AMBER', gtin: '8906214290294', fragrance: 'Golden Amber', fragranceLine: 'Amber · Premium', name: 'Golden Amber Pouch', imageFile: 'pouch-amber-hero.png' },
        { sku: 'PP-PISZ-KASTURI-MUSK', gtin: '8906214290324', fragrance: 'Kasturi Musk', fragranceLine: 'Musk · Premium', name: 'Kasturi Musk Pouch', imageFile: 'pouch-kasturi-hero.png' },
        { sku: 'PP-PISZ-ROYAL-BLISS', gtin: '8906214290300', fragrance: 'Royal Bliss', fragranceLine: 'Bliss · Premium', name: 'Royal Bliss Pouch', imageFile: 'pouch-royal-hero.png' },
        { sku: 'PP-PISZ-KESAR-CHANDAN', gtin: '8906214290317', fragrance: 'Kesar Chandan', fragranceLine: 'Saffron Sandalwood · Premium', name: 'Kesar Chandan Pouch', imageFile: 'pouch-kesar-hero.png' }
    ]),
    ...group({
        category: 'Premium Incense Sticks 100g',
        collection: 'Premium Incense Sticks',
        netQuantity: '100 g',
        mrp: 85,
        sortBase: 10,
        description: 'Pure incense sticks crafted with sacred cow dung, charcoal-free.'
    }, [
        { sku: 'PP-PIS-GN-ROSE-100', gtin: '8906214290003', fragrance: 'Rose', fragranceLine: 'Gulab · Premium', name: 'Rose Incense · 100 g', imageFile: 'agarbatti100-rose-hero.png' },
        { sku: 'PP-PIS-GN-MOGRA-100', gtin: '8906214290010', fragrance: 'Mogra', fragranceLine: 'Jasmine · Premium', name: 'Mogra Incense · 100 g', imageFile: 'agarbatti100-mogra-hero.png' },
        { sku: 'PP-PIS-GN-OUDH-100', gtin: '8906214290027', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Incense · 100 g', imageFile: 'agarbatti100-oudh-hero.png' },
        { sku: 'PP-PIS-GN-3IN1-RO-MO-OU-100', gtin: '8906214290102', fragrance: '3 in 1', fragranceLine: 'Rose · Mogra · Oudh', name: '3 in 1 Incense · 100 g', imageFile: 'agarbatti100-3in1-hero.png' }
    ]),
    ...group({
        category: 'Premium Incense Sticks 33',
        collection: 'Premium Incense Sticks',
        netQuantity: '33 sticks',
        mrp: 35,
        sortBase: 20,
        description: 'Thirty-three stick packs of charcoal-free GauNirmal incense, with a stand inside.'
    }, [
        { sku: 'PP-PIS-GN-ROSE-45', gtin: '8906214290133', fragrance: 'Rose', fragranceLine: 'Gulab · Premium', name: 'Rose Incense · 33 sticks', imageFile: 'incense33-rose-hero.png' },
        { sku: 'PP-PIS-GN-CHANDAN-45', gtin: '8906214290140', fragrance: 'ChandanWood', fragranceLine: 'Sandalwood · Premium', name: 'ChandanWood Incense · 33 sticks', imageFile: 'incense33-chandan-hero.png' },
        { sku: 'PP-PIS-GN-OUDH-45', gtin: '8906214290157', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Incense · 33 sticks', imageFile: 'incense33-oudh-hero.png' },
        { sku: 'PP-PIS-GN-MOGRA-45', gtin: '8906214290164', fragrance: 'Mogra', fragranceLine: 'Jasmine · Premium', name: 'Mogra Incense · 33 sticks', imageFile: 'incense33-mogra-hero.png' },
        { sku: 'PP-PIS-GN-4IN1-45', gtin: '8906214290171', fragrance: '4 in 1', fragranceLine: 'Rose · Mogra · Oudh · Chandan', name: '4 in 1 Incense · 33 sticks', imageFile: 'incense33-4in1-hero.png' }
    ]),
    ...group({
        category: 'Premium Incense Stick Packs',
        collection: 'Premium Incense Stick Packs',
        netQuantity: '10 sticks',
        mrp: 15,
        sortBase: 30,
        description: 'Ten charcoal-free incense sticks.'
    }, [
        { sku: 'PP-PIS-ROSE-10', fragrance: 'Rose', fragranceLine: 'Gulab · Premium', name: 'Rose Incense · 10 sticks', imageFile: 'pack-incense-rose.png' },
        { sku: 'PP-PIS-CHANDAN-10', fragrance: 'ChandanWood', fragranceLine: 'Sandalwood · Premium', name: 'ChandanWood Incense · 10 sticks', imageFile: 'pack-incense-chandan.png' },
        { sku: 'PP-PIS-OUDH-10', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Incense · 10 sticks', imageFile: 'pack-incense-oudh.png' },
        { sku: 'PP-PIS-MUSKY-10', fragrance: 'Musky', fragranceLine: 'Musk · Premium', name: 'Musky Incense · 10 sticks', imageFile: 'pack-incense-musky.png' },
        { sku: 'PP-PIS-MOGRA-10', fragrance: 'Mogra', fragranceLine: 'Jasmine · Premium', name: 'Mogra Incense · 10 sticks', imageFile: 'pack-incense-mogra.png' },
        { sku: 'PP-PIS-GUGGAL-10', fragrance: 'Gugal', fragranceLine: 'Gugal Resin · Premium', name: 'Gugal Incense · 10 sticks', imageFile: 'pack-incense-guggal.png' }
    ]),
    ...group({
        category: 'Premium Dhoop Sticks 100g',
        collection: 'Premium Dhoop Sticks',
        netQuantity: '100 g',
        mrp: 85,
        sortBase: 40,
        description: 'Rich, long-lasting dhoop sticks rolled with sacred cow dung, charcoal-free.'
    }, [
        { sku: 'PP-PDS-GN-CHANDAN-100', gtin: '8906214290089', fragrance: 'ChandanWood', fragranceLine: 'Sandalwood · Premium', name: 'ChandanWood Dhoop · 100 g', imageFile: 'dhoop100-chandan-hero.png' },
        { sku: 'PP-PDS-GN-GUGAL-100', gtin: '8906214290065', fragrance: 'Gugal', fragranceLine: 'Gugal Resin · Premium', name: 'Gugal Dhoop · 100 g', imageFile: 'dhoop100-gugal-hero.png' },
        { sku: 'PP-PDS-GN-OUDH-100', gtin: '8906214290058', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Dhoop · 100 g', imageFile: 'dhoop100-oudh-hero.png' },
        { sku: 'PP-PDS-GN-MUSKY-100', gtin: '8906214290041', fragrance: 'Musky', fragranceLine: 'Musk · Premium', name: 'Musky Dhoop · 100 g', imageFile: 'dhoop100-musky-hero.png' },
        { sku: 'PP-PDS-GN-3IN1-MU-CH-OU-100', gtin: '8906214290096', fragrance: '3 in 1 Musky', fragranceLine: 'Musky · Chandan · Oudh', name: '3 in 1 Musky Dhoop · 100 g', imageFile: 'dhoop100-3in1-mu-hero.png' },
        { sku: 'PP-PDS-GN-3IN1-GU-CH-OU-100', gtin: '8906214290072', fragrance: '3 in 1 Gugal', fragranceLine: 'Gugal · Chandan · Oudh', name: '3 in 1 Gugal Dhoop · 100 g', imageFile: 'dhoop100-3in1-gu-hero.png' }
    ]),
    ...group({
        category: 'Premium Dhoop Sticks 10',
        collection: 'Premium Dhoop Sticks',
        netQuantity: '10 sticks',
        mrp: 15,
        sortBase: 50,
        description: 'Ten-stick packs of charcoal-free dhoop, with a stand inside.'
    }, [
        { sku: 'PP-PDS-CHANDAN-10', gtin: '8906314330131', fragrance: 'ChandanWood', fragranceLine: 'Sandalwood · Premium', name: 'ChandanWood Dhoop · 10 sticks', imageFile: 'dhoop10-chandan-hero.png' },
        { sku: 'PP-PDS-GUGAL-10', gtin: '8906314330230', fragrance: 'Gugal', fragranceLine: 'Gugal Resin · Premium', name: 'Gugal Dhoop · 10 sticks', imageFile: 'dhoop10-gugal-hero.png' },
        { sku: 'PP-PDS-OUDH-10', gtin: '8906314330155', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Dhoop · 10 sticks', imageFile: 'dhoop10-oudh-hero.png' },
        { sku: 'PP-PDS-MUSKY-10', gtin: '8906314330179', fragrance: 'Musky', fragranceLine: 'Musk · Premium', name: 'Musky Dhoop · 10 sticks', imageFile: 'dhoop10-musky-hero.png' },
        { sku: 'PP-PDS-MOGRA-10', gtin: '8906314330186', fragrance: 'Mogra', fragranceLine: 'Jasmine · Premium', name: 'Mogra Dhoop · 10 sticks', imageFile: 'dhoop10-mogra-hero.png' },
        { sku: 'PP-PDS-ROSE-10', gtin: '8906314330193', fragrance: 'Rose', fragranceLine: 'Gulab · Premium', name: 'Rose Dhoop · 10 sticks', imageFile: 'dhoop10-rose-hero.png' }
    ]),
    ...group({
        category: 'Premium Dhoop Stick Packs 90g',
        collection: 'Premium Dhoop Stick Packs',
        netQuantity: '90 g',
        mrp: 60,
        sortBase: 60,
        description: 'Charcoal-free dhoop sticks in a 90 g pack.'
    }, [
        { sku: 'PP-PDS-CHANDAN-90', fragrance: 'ChandanWood', fragranceLine: 'Sandalwood · Premium', name: 'ChandanWood Dhoop · 90 g', imageFile: 'pack-dhoop-chandan.png' },
        { sku: 'PP-PDS-GUGAL-90', fragrance: 'Gugal', fragranceLine: 'Gugal Resin · Premium', name: 'Gugal Dhoop · 90 g', imageFile: 'pack-dhoop-gugal.png' },
        { sku: 'PP-PDS-OUDH-90', fragrance: 'Oudh', fragranceLine: 'Oud · Premium', name: 'Oudh Dhoop · 90 g', imageFile: 'pack-dhoop-oudh.png' },
        { sku: 'PP-PDS-MUSKY-90', fragrance: 'Musky', fragranceLine: 'Musk · Premium', name: 'Musky Dhoop · 90 g', imageFile: 'pack-dhoop-musky.png' },
        { sku: 'PP-PDS-MOGRA-90', fragrance: 'Mogra', fragranceLine: 'Jasmine · Premium', name: 'Mogra Dhoop · 90 g', imageFile: 'pack-dhoop-mogra.png' },
        { sku: 'PP-PDS-ROSE-90', fragrance: 'Rose', fragranceLine: 'Gulab · Premium', name: 'Rose Dhoop · 90 g', imageFile: 'pack-dhoop-rose.png' }
    ]),
    ...group({
        category: 'Premium Dhoop Cups',
        collection: 'Premium Dhoop Cups',
        netQuantity: '12 cups',
        mrp: 84,
        isNew: true,
        sortBase: 70,
        description: 'Rich sambrani cups for a lasting sacred fragrance, charcoal-free.'
    }, [
        { sku: 'PP-PDC-KAPOOR-GUGAL-12N', gtin: '8906214290331', fragrance: 'Kapur Gugal', fragranceLine: 'Camphor Gugal · Premium', name: 'Kapur Gugal Cups', imageFile: 'box-kapur-card.png' },
        { sku: 'PP-PDC-AFGHANI-LOBAN-12N', gtin: '8906214290348', fragrance: 'Afghani Loban', fragranceLine: 'Loban Resin · Premium', name: 'Afghani Loban Cups', imageFile: 'box-loban-card.png' },
        { sku: 'PP-PDC-GAUNIRMAL-12N', gtin: '8906214290355', fragrance: 'Gau Nirmal', fragranceLine: 'Sacred Cow Dung · Premium', name: 'Gau Nirmal Cups', imageFile: 'box-gau-card.png' },
        { sku: 'PP-PDC-4IN1-12N', gtin: '8906214290362', fragrance: '4 in 1', fragranceLine: 'Rose · ChandanWood · Woody · Musky', name: '4 in 1 Dhoop Cups', imageFile: 'box-4in1-card.png' }
    ]),
    ...group({
        category: 'Launching Soon',
        collection: 'Launching Soon',
        netQuantity: '',
        mrp: 0,
        sortBase: 80,
        description: ''
    }, [
        { sku: 'PP-SOON-DHOOP-STICK-JAR', fragrance: 'Dhoop Stick Jar', fragranceLine: 'Short dhoop sticks · Reusable jar', name: 'Dhoop Stick Jar', imageFile: 'soon-jar-dhoop-stick.png', description: 'Thin charcoal-free dhoop sticks packed in a clear jar for counters and home puja.' },
        { sku: 'PP-SOON-DHOOP-CONE-JAR', fragrance: 'Dhoop Cone Jar', fragranceLine: 'Quick-light cones · Reusable jar', name: 'Dhoop Cone Jar', imageFile: 'soon-jar-dhoop-cone.png', description: 'Compact cones for a short, rich aarti — easy to scoop, easy to restock.' },
        { sku: 'PP-SOON-BAMBOOLESS', fragrance: 'Bambooless Incense', fragranceLine: '6–8 inch masala stick · No bamboo', name: 'Bambooless Incense Sticks', imageFile: 'soon-jar-bambooless.png', description: 'All-masala incense with no wooden core — cleaner ash and a fuller fragrance throw.' },
        { sku: 'PP-SOON-CAMPHOR-JAR', fragrance: 'Camphor', fragranceLine: 'Kapoor tablets · Daily puja', name: 'Camphor Jar', imageFile: 'soon-jar-camphor.png', description: 'A fast-moving puja staple to sit beside incense and dhoop on the same shelf.' }
    ])
];

module.exports = { categories, products };
