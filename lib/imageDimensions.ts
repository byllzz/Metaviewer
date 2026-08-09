/**
 * Minimal, dependency-free image dimension probing from raw bytes.
 * Supports PNG, GIF, JPEG, WebP (VP8/VP8L/VP8X), BMP, and ICO (first entry).
 * Only reads header bytes — never decodes full image contents.
 */

export interface ProbedImage {
  width: number;
  height: number;
  format: string;
}

export function probeImageDimensions(buf: Buffer): ProbedImage | null {
  if (buf.length < 24) return trySmall(buf);

  // PNG: 8-byte signature, then IHDR chunk with width/height at fixed offsets.
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: "png" };
  }

  // GIF: "GIF87a" or "GIF89a", width/height as little-endian uint16 at offset 6.
  if (buf.toString("ascii", 0, 3) === "GIF") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8), format: "gif" };
  }

  // JPEG: scan markers for the first SOF (start of frame) segment.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length - 9) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1] ?? 0;
      const isSOF =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSOF) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return { width, height, format: "jpeg" };
      }
      const segmentLength = buf.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
    }
    return null; // SOF wasn't within the bytes we fetched
  }

  // WebP: "RIFF....WEBP" then a chunk (VP8 , VP8L, or VP8X).
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height, format: "webp" };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      const width = (b & 0x3fff) + 1;
      const height = ((b >> 14) & 0x3fff) + 1;
      return { width, height, format: "webp" };
    }
    if (chunk === "VP8X") {
      const width = ((buf[24] ?? 0) | ((buf[25] ?? 0) << 8) | ((buf[26] ?? 0) << 16)) + 1;
      const height = ((buf[27] ?? 0) | ((buf[28] ?? 0) << 8) | ((buf[29] ?? 0) << 16)) + 1;
      return { width, height, format: "webp" };
    }
  }

  // BMP: width/height as little-endian int32 at offset 18/22.
  if (buf[0] === 0x42 && buf[1] === 0x4d) {
    return { width: buf.readInt32LE(18), height: Math.abs(buf.readInt32LE(22)), format: "bmp" };
  }

  // ICO: use the first embedded image's directory entry (offsets 6/7, 0 means 256).
  if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0) {
    const w = (buf[6] ?? 0) === 0 ? 256 : (buf[6] ?? 0);
    const h = (buf[7] ?? 0) === 0 ? 256 : (buf[7] ?? 0);
    return { width: w, height: h, format: "ico" };
  }

  return null;
}

function trySmall(buf: Buffer): ProbedImage | null {
  if (buf.length >= 4 && buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0 && buf.length >= 8) {
    const w = (buf[6] ?? 0) === 0 ? 256 : (buf[6] ?? 0);
    const h = (buf[7] ?? 0) === 0 ? 256 : (buf[7] ?? 0);
    return { width: w, height: h, format: "ico" };
  }
  return null;
}
