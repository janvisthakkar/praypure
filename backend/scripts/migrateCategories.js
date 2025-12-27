const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const initialCategories = [
    {
        name: 'Incense Sticks',
        title: 'Incense Sticks',
        subtitle: 'Traditional hand-rolled incense with authentic fragrances',
        description: 'Explore our range of spiritual incense sticks.',
        slug: 'incense-sticks',
        isActive: true
    },
    {
        name: 'Dhoop Sticks',
        title: 'Dhoop Sticks',
        subtitle: 'Premium dhoop for creating a spiritual ambiance',
        description: 'Pure dhoop sticks for your daily prayers.',
        slug: 'dhoop-sticks',
        isActive: true
    },
    {
        name: 'Dhoop Cones',
        title: 'Dhoop Cones',
        subtitle: 'Convenient cone-shaped dhoop for easy use',
        description: 'Natural dhoop cones for deep meditation.',
        slug: 'dhoop-cones',
        isActive: true
    },
    {
        name: 'Havan Cups',
        title: 'Havan Cups',
        subtitle: 'Sacred havan essentials for rituals',
        description: 'Traditional Sambrani havan cups.',
        slug: 'havan-cups',
        isActive: true
    }
];

const migrateData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Seed Categories
        for (const cat of initialCategories) {
            await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
        }
        console.log('Categories seeded successfully');

        // 2. Migrate Products
        const products = await Product.find({});
        console.log(`Checking ${products.length} products for migration...`);

        for (const product of products) {
            let updated = false;
            const marketplaces = [];

            // This is tricky because the model just changed. 
            // If the old data is still in the doc (Mongoose allows this during migration), we extract it.
            // Since I removed the fields from the schema, product.amazonLink might be undefined in the object if not using .toObject() or leak.

            const rawProduct = product.toObject({ virtuals: false });

            if (rawProduct.amazonLink && rawProduct.amazonLink !== '') {
                marketplaces.push({ platform: 'Amazon', url: rawProduct.amazonLink, isActive: true });
                updated = true;
            }
            if (rawProduct.flipkartLink && rawProduct.flipkartLink !== '') {
                marketplaces.push({ platform: 'Flipkart', url: rawProduct.flipkartLink, isActive: true });
                updated = true;
            }

            if (updated) {
                // Use updateOne to bypass schema restrictions if needed, or just set the new field
                await Product.updateOne(
                    { _id: product._id },
                    {
                        $set: { marketplaces: marketplaces },
                        $unset: { amazonLink: "", flipkartLink: "" }
                    }
                );
                console.log(`Migrated marketplaces for: ${product.name}`);
            }
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
