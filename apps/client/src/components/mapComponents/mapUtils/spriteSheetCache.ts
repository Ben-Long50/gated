export const spriteSheetCache = new Map<
  string,
  { width: number; height: number }
>();

async function preloadSpriteSheet(url: string) {
  if (spriteSheetCache.has(url)) return spriteSheetCache.get(url)!;

  const img = new Image();
  img.src = url;
  await img.decode();

  const size = {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };

  spriteSheetCache.set(url, size);
  return size;
}

type SpriteManifest = Record<string, { files?: string[] }>;

function getAllFilesFromManifest(
  manifest: SpriteManifest,
  baseUrl: string,
): string[] {
  const files: string[] = [];

  for (const key in manifest) {
    const entry = manifest[key];
    if (entry.files) {
      entry.files.forEach((file) => {
        if (file.endsWith('.png')) {
          files.push(`${baseUrl}/${key}/${file}`);
        }
      });
    }
  }

  return files;
}

export async function preloadAllSpriteSheets(manifest: SpriteManifest) {
  const baseUrl = '/assets/tiles';

  const allFiles = getAllFilesFromManifest(manifest, baseUrl);

  await Promise.all(allFiles.map(preloadSpriteSheet));
}
