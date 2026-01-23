export async function createFaviconIco(pngDataUrls: string[]): Promise<Blob> {
  const pngBuffers = await Promise.all(
    pngDataUrls.map(async (url) => {
      const res = await fetch(url);
      return new Uint8Array(await res.arrayBuffer());
    }),
  );

  const headerSize = 6;
  const entrySize = 16;
  const imageOffset = headerSize + entrySize * pngBuffers.length;

  let offset = imageOffset;

  const iconDir = new Uint8Array(headerSize);
  const view = new DataView(iconDir.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = icon
  view.setUint16(4, pngBuffers.length, true); // count

  const entries: Uint8Array[] = [];
  const images: Uint8Array[] = [];

  for (const png of pngBuffers) {
    const width = png[16];
    const height = png[20];

    const entry = new Uint8Array(entrySize);
    const dv = new DataView(entry.buffer);

    entry[0] = width === 256 ? 0 : width;
    entry[1] = height === 256 ? 0 : height;
    entry[2] = 0; // colors
    entry[3] = 0; // reserved

    dv.setUint16(4, 1, true); // planes
    dv.setUint16(6, 32, true); // bit count
    dv.setUint32(8, png.length, true);
    dv.setUint32(12, offset, true);

    offset += png.length;

    entries.push(entry);
    images.push(png);
  }

  const totalSize =
    headerSize +
    entrySize * entries.length +
    images.reduce((s, i) => s + i.length, 0);

  const result = new Uint8Array(totalSize);
  let pos = 0;

  result.set(iconDir, pos);
  pos += headerSize;

  for (const e of entries) {
    result.set(e, pos);
    pos += entrySize;
  }

  for (const img of images) {
    result.set(img, pos);
    pos += img.length;
  }

  return new Blob([result], { type: "image/x-icon" });
}
