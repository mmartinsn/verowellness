/**
 * Builds the social-sharing image (Open Graph / Twitter), 1200 × 630, from the studio photo.
 * Run once after changing the photo: `node scripts/og-image.mjs` → public/og/veronica-wellness.jpg
 */
import sharp from 'sharp';

await sharp('src/assets/fotos/veronica-bata-horizontal.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og/veronica-wellness.jpg');
console.log('public/og/veronica-wellness.jpg');
