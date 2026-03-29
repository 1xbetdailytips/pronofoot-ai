#!/usr/bin/env node
/**
 * Batch blog image generator using Gemini (Nano Banana 2)
 * Generates all images for 3 SEO articles with proper rate limiting
 */

const { GoogleGenAI } = require('../.claude/skills/nano-banana-2/node_modules/@google/genai');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyAoS8XB8rk0u9UAvJqa3-u-L2J_X67xoL4';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'blog');
const DELAY_MS = 20000; // 20s between requests to avoid rate limits

const IMAGES = [
  // Article 2: Pronostics football gratuits — beginner guide
  {
    name: 'art2-hero',
    prompt: 'Hyper-realistic cinematic photo of a young African man studying football statistics on a laptop computer at a modern desk, charts and data on screen, warm natural light from a window, editorial lifestyle photography'
  },
  {
    name: 'art2-types-bets',
    prompt: 'Hyper-realistic flat lay photo of a betting slip, football, pen, calculator, and tactical diagram on a wooden table, overhead shot, clean editorial style, soft studio lighting'
  },
  {
    name: 'art2-analysis',
    prompt: 'Hyper-realistic photo of a large screen displaying football match statistics with graphs, bar charts showing team performance, green and white data visualization, modern office setting, tech photography'
  },
  {
    name: 'art2-community',
    prompt: 'Hyper-realistic photo of a group of young African friends celebrating while looking at a phone showing a winning bet notification, vibrant urban setting, joyful expressions, golden hour light'
  },
  // Article 3: IA et paris sportifs
  {
    name: 'art3-hero',
    prompt: 'Hyper-realistic photo of a futuristic holographic display showing football match predictions with AI neural network visualization, glowing blue data streams, dark tech lab setting, sci-fi cinematic lighting'
  },
  {
    name: 'art3-data',
    prompt: 'Hyper-realistic photo of multiple computer monitors displaying football data dashboards with heat maps, probability charts, player statistics, dark room with blue screen glow, tech photography'
  },
  {
    name: 'art3-algorithm',
    prompt: 'Hyper-realistic photo of a robotic hand and a human hand both pointing at a football tactical board with match formations, futuristic meets traditional, dramatic lighting, conceptual photography'
  },
  {
    name: 'art3-results',
    prompt: 'Hyper-realistic photo of a smartphone displaying an AI prediction app with green checkmarks showing correct predictions, football pitch blurred in background, shallow depth of field, lifestyle tech photography'
  }
];

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function generateImage(prompt, filename) {
  console.log(`\n🎨 Generating: ${filename}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: { imageSize: '1K', aspectRatio: '16:9' }
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      console.log(`   ❌ No response parts`);
      return false;
    }

    for (const p of parts) {
      if (p.inlineData) {
        const buf = Buffer.from(p.inlineData.data, 'base64');
        const ext = (p.inlineData.mimeType || 'image/png').split('/')[1] || 'png';
        const filepath = path.join(OUTPUT_DIR, `${filename}.${ext}`);
        fs.writeFileSync(filepath, buf);
        console.log(`   ✅ Saved: ${filepath} (${(buf.length / 1024).toFixed(0)}KB)`);
        return true;
      }
    }
    console.log(`   ❌ No image in response`);
    return false;
  } catch (err) {
    console.log(`   ❌ Error: ${err.message?.substring(0, 100)}`);
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`\n🍌 Nano Banana Batch Generator`);
  console.log(`   Images to generate: ${IMAGES.length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Delay between: ${DELAY_MS / 1000}s\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < IMAGES.length; i++) {
    const img = IMAGES[i];

    // Skip if already exists
    const existing = fs.readdirSync(OUTPUT_DIR).find(f => f.startsWith(img.name));
    if (existing) {
      console.log(`\n⏭️  Skipping ${img.name} (already exists: ${existing})`);
      success++;
      continue;
    }

    const ok = await generateImage(img.prompt, img.name);
    if (ok) success++;
    else {
      // Retry once after longer delay
      console.log(`   🔄 Retrying in 30s...`);
      await sleep(30000);
      const retry = await generateImage(img.prompt, img.name);
      if (retry) success++;
      else failed++;
    }

    // Rate limit delay (skip after last image)
    if (i < IMAGES.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_MS / 1000}s...`);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n\n🏁 Done! ${success} succeeded, ${failed} failed`);
  console.log(`   Images in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
