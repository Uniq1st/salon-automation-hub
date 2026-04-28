import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const PHOTOS_DIR = path.resolve('uploads/photos');
const GENERATED_DIR = path.resolve('uploads/generated');
const DB_FILE = path.resolve('uploads/photos.json');

// Simple JSON file as database for photo metadata
function readDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function getAllPhotos() {
  return readDB();
}

export function getPhoto(id) {
  return readDB().find(p => p.id === id) || null;
}

// Save uploaded photo + generate thumbnail
export async function savePhoto(file, metadata = {}) {
  const id = uuidv4();
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const filename = `${id}${ext}`;
  const thumbFilename = `${id}_thumb.jpg`;

  const filepath = path.join(PHOTOS_DIR, filename);
  const thumbPath = path.join(PHOTOS_DIR, thumbFilename);

  // Save original
  fs.writeFileSync(filepath, file.buffer);

  // Generate thumbnail (400px wide)
  await sharp(file.buffer).resize(400).jpeg({ quality: 80 }).toFile(thumbPath);

  const photo = {
    id,
    filename,
    thumbFilename,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    tags: metadata.tags || [],
    caption: null,
    hashtags: [],
    aiAnalysis: null,
    generatedImages: [],
    postedTo: [],
  };

  const db = readDB();
  db.unshift(photo);
  writeDB(db);

  return photo;
}

// Claude vision — analyze photo and generate caption + hashtags
export async function analyzePhoto(id) {
  const photo = getPhoto(id);
  if (!photo) throw new Error('Photo not found');

  const filepath = path.join(PHOTOS_DIR, photo.filename);
  const imageBuffer = fs.readFileSync(filepath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(photo.filename).slice(1).toLowerCase();
  const mediaType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `You are a social media expert for "Brows and Lashes" — a luxury beauty salon in NYC at 1240 Lexington Ave specializing in lash extensions, facials, waxing, and threading. Instagram: @browsandlashesnyc.

Analyze this salon photo and respond ONLY with valid JSON:
{
  "service": "what service or result is shown (e.g. lash extensions, facial, brow shaping)",
  "caption": "engaging Instagram caption, warm and luxurious tone, max 150 chars, no hashtags",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
  "tiktokHook": "first 3 seconds hook line for a TikTok video about this",
  "altText": "accessibility description of the image",
  "generationPrompt": "detailed DALL-E prompt to generate a similar but different salon photo in the same style"
}`,
        },
      ],
    }],
  });

  let analysis;
  try {
    analysis = JSON.parse(message.content[0].text);
  } catch {
    analysis = { caption: message.content[0].text, hashtags: [] };
  }

  // Update DB
  const db = readDB();
  const idx = db.findIndex(p => p.id === id);
  db[idx].aiAnalysis = analysis;
  db[idx].caption = analysis.caption;
  db[idx].hashtags = analysis.hashtags;
  writeDB(db);

  return analysis;
}

// DALL-E — generate new images inspired by the uploaded photo
export async function generateVariations(id, count = 2) {
  const photo = getPhoto(id);
  if (!photo) throw new Error('Photo not found');
  if (!photo.aiAnalysis?.generationPrompt) throw new Error('Analyze photo first');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const generated = [];

  for (let i = 0; i < count; i++) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${photo.aiAnalysis.generationPrompt} Professional salon photography, luxury aesthetic, clean background, Instagram-ready.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    const imageUrl = response.data[0].url;

    // Download and save generated image
    const genRes = await fetch(imageUrl);
    const buffer = Buffer.from(await genRes.arrayBuffer());
    const genFilename = `${uuidv4()}_gen.jpg`;
    fs.writeFileSync(path.join(GENERATED_DIR, genFilename), buffer);

    generated.push({ filename: genFilename, url: imageUrl, createdAt: new Date().toISOString() });
  }

  // Update DB
  const db = readDB();
  const idx = db.findIndex(p => p.id === id);
  db[idx].generatedImages.push(...generated);
  writeDB(db);

  return generated;
}

// Mark photo as posted
export function markPosted(id, platform, postId) {
  const db = readDB();
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) return;
  db[idx].postedTo.push({ platform, postId, postedAt: new Date().toISOString() });
  writeDB(db);
}
