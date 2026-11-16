import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'banners');
const extensions = ['webp', 'jpg', 'jpeg', 'png', 'avif'];

// Returns the public URL of public/banners/<name>.<ext>, or null while no image
// has been supplied. Sections fall back to their CSS background in that case.
export function bannerImage(name) {
  for (const ext of extensions) {
    if (fs.existsSync(path.join(dir, `${name}.${ext}`))) return `/banners/${name}.${ext}`;
  }
  return null;
}

// Same idea for a video: public/banners/<name>.mp4 (or .webm), or null.
export function bannerVideo(name) {
  for (const ext of ['mp4', 'webm']) {
    if (fs.existsSync(path.join(dir, `${name}.${ext}`))) return `/banners/${name}.${ext}`;
  }
  return null;
}
