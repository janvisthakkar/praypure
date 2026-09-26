/**
 * Upload catalogue front images to S3 and upsert categories, products,
 * and homepage collection cards.
 *
 * Usage (from backend/):
 *   node scripts/seedCatalogue2026.js
 *
 * Reads MONGODB_URI, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * and AWS_BUCKET_NAME from the environment or backend/.env.
 * Catalogue PNGs default to CATALOGUE_ASSETS.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mongoose = require('mongoose');

const Product = require('../models/Product');
const Category = require('../models/Category');
const HomeSection = require('../models/HomeSection');
const { categories, products } = require('./data/catalogue2026');

const ASSETS = process.env.CATALOGUE_ASSETS
    || 'C:\\Users\\Janvi Thakkar\\praypure-catalogue-2026\\assets';
const bucket = process.env.AWS_BUCKET_NAME || 'praypure-images';
const region = process.env.AWS_REGION;

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const publicUrl = (key) => `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

async function uploadFrontImage(filename, key) {
    const filePath = path.join(ASSETS, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing catalogue image: ${filePath}`);
    }

    const body = await sharp(filePath)
        .resize({ width: 1200, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

    await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable'
    }));
    console.log(`  uploaded ${key} (${Math.round(body.length / 1024)} KB)`);
    return publicUrl(key);
}

async function seed() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }
    if (!region || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS credentials are not set');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    const imageCache = new Map();
    const imageFor = async (filename, key) => {
        if (imageCache.has(key)) return imageCache.get(key);
        const url = await uploadFrontImage(filename, key);
        imageCache.set(key, url);
        return url;
    };

    console.log(`Uploading ${categories.length} category images`);
    for (const category of categories) {
        category.image = await imageFor(
            category.imageFile,
            `catalogue/2026/categories/${category.slug}.webp`
        );
        await Category.findOneAndUpdate(
            { slug: category.slug },
            {
                $set: {
                    name: category.name,
                    title: category.title,
                    subtitle: category.subtitle,
                    description: category.description,
                    image: category.image,
                    slug: category.slug,
                    status: category.status,
                    isActive: category.status !== 'Invisible',
                    order: category.order
                }
            },
            { upsert: true, new: true }
        );
        console.log(`  category ${category.slug}`);
    }

    console.log(`Upserting ${products.length} products`);
    for (const product of products) {
        const url = await imageFor(product.imageFile, `catalogue/2026/${product.sku}.webp`);
        const imageDoc = {
            url,
            altText: product.name,
            isPrimary: true
        };
        await Product.findOneAndUpdate(
            { sku: product.sku },
            {
                $set: {
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    mrp: product.mrp,
                    image: url,
                    images: [imageDoc],
                    slug: product.slug,
                    fragrance: product.fragrance,
                    fragranceLine: product.fragranceLine,
                    sku: product.sku,
                    gtin: product.gtin,
                    netQuantity: product.netQuantity,
                    catalogueLine: product.collection,
                    sortOrder: product.sortOrder,
                    isNew: product.isNew,
                    isActive: product.isActive,
                    seo: {
                        metaTitle: `${product.name} | Praypure`,
                        metaDescription: `${product.name}. ${product.netQuantity}. ${product.description}`.trim(),
                        keywords: [product.fragrance, product.collection, 'Praypure'].filter(Boolean)
                    }
                },
                $setOnInsert: {
                    stock: 0,
                    marketplaces: []
                }
            },
            { upsert: true, new: true }
        );
        console.log(`  product ${product.sku}`);
    }

    const existing = await HomeSection.find({ sectionType: 'collection' }).sort({ order: 1, createdAt: 1 });
    const keptIds = [];
    for (let i = 0; i < categories.length; i += 1) {
        const category = categories[i];
        const payload = {
            sectionType: 'collection',
            title: category.title,
            description: category.subtitle,
            image: category.image,
            link: `/${category.slug}`,
            order: category.order,
            isActive: true
        };
        if (existing[i]) {
            await HomeSection.findByIdAndUpdate(existing[i]._id, payload);
            keptIds.push(existing[i]._id);
        } else {
            const created = await HomeSection.create(payload);
            keptIds.push(created._id);
        }
    }
    await HomeSection.updateMany(
        { sectionType: 'collection', _id: { $nin: keptIds } },
        { $set: { isActive: false } }
    );
    console.log(`Homepage collections: ${categories.length}`);

    const counts = {
        products: await Product.countDocuments({ sku: /^PP-/ }),
        categories: await Category.countDocuments({ slug: { $in: categories.map((c) => c.slug) } })
    };
    console.log('Done', counts);
    await mongoose.disconnect();
}

seed().catch(async (error) => {
    console.error(String(error.message || error).replace(/\/\/[^@\s]+@/g, '//***@'));
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
