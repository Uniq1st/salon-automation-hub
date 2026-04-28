import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = path.resolve('uploads/photos');
const GENERATED_DIR = path.resolve('uploads/generated');

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

// Upload local file to Cloudinary, get public URL
async function uploadToCloudinary(filepath) {
  const cld = getCloudinary();
  const result = await cld.uploader.upload(filepath, {
    folder: 'brows-and-lashes',
    transformation: [{ width: 1080, height: 1080, crop: 'fill', quality: 'auto' }],
  });
  return result.secure_url;
}

// Post image to Instagram Business account
export async function postToInstagram({ filename, caption, hashtags, isGenerated = false }) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!accessToken || !businessId) throw new Error('Instagram credentials not set');

  const dir = isGenerated ? GENERATED_DIR : PHOTOS_DIR;
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) throw new Error('Image file not found');

  // Upload to Cloudinary to get a public URL
  const imageUrl = await uploadToCloudinary(filepath);

  const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;

  // Step 1 — create media container
  const containerRes = await axios.post(
    `https://graph.facebook.com/v19.0/${businessId}/media`,
    {
      image_url: imageUrl,
      caption: fullCaption,
      access_token: accessToken,
    }
  );

  const creationId = containerRes.data.id;

  // Step 2 — publish
  const publishRes = await axios.post(
    `https://graph.facebook.com/v19.0/${businessId}/media_publish`,
    {
      creation_id: creationId,
      access_token: accessToken,
    }
  );

  return {
    platform: 'instagram',
    postId: publishRes.data.id,
    imageUrl,
    caption: fullCaption,
    url: `https://www.instagram.com/p/${publishRes.data.id}`,
    postedAt: new Date().toISOString(),
  };
}

// Get basic Instagram account info
export async function getInstagramAccount() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;

  if (!accessToken || !businessId) throw new Error('Instagram credentials not set');

  const res = await axios.get(
    `https://graph.facebook.com/v19.0/${businessId}`,
    {
      params: {
        fields: 'name,biography,followers_count,media_count,profile_picture_url,username',
        access_token: accessToken,
      },
    }
  );

  return res.data;
}
