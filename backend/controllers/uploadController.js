const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');

// Configure AWS S3
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME || 'praypure-images';

if (!region || !accessKeyId || !secretAccessKey) {
    console.error('CRITICAL: Missing AWS Credentials in environment variables.');
    console.error('AWS_REGION:', region ? 'Set' : 'Missing');
    console.error('AWS_ACCESS_KEY_ID:', accessKeyId ? 'Set' : 'Missing');
    console.error('AWS_SECRET_ACCESS_KEY:', secretAccessKey ? 'Set' : 'Missing');
}

const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();

// File filter (allow images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.file;
        const fileExtension = path.extname(file.originalname);
        // Create unique key: timestamp-random-filename
        const key = `products/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME || 'praypure-images',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construct public URL
        // Format: https://bucket-name.s3.region.amazonaws.com/key
        const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.json({
            success: true,
            data: {
                url: url,
                key: key
            }
        });

    } catch (error) {
        console.error('Upload Error:', error);

        // Return more specific error details
        const errorMessage = error.name === 'AccessDenied'
            ? 'AWS Access Denied: Check your IAM permissions.'
            : error.message;

        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: errorMessage,
            code: error.name
        });
    }
};

exports.uploadMiddleware = upload.single('image');
