import "server-only";

/**
 * Server-side validation for product image uploads.
 *
 * The extension is derived from the VALIDATED MIME type, never from the
 * uploaded filename. That is deliberate: the extension is interpolated into a
 * Supabase Storage path, and trusting `file.name` there allows path traversal
 * (a name like `x.foo/../../evil.html` would escape the product folder).
 * Client-side `accept="..."` is a hint for the file picker, not a control.
 */

const ALLOWED_TYPES: ReadonlyMap<string, string> = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_LABEL = "JPEG, PNG or WebP";

export type ValidatedImage = {
  /** Safe, allowlisted extension — never attacker-controlled. */
  extension: string;
  /** Allowlisted MIME type, safe to pass to Storage as contentType. */
  contentType: string;
  buffer: Buffer;
};

export type ImageValidation =
  | { ok: true; image: ValidatedImage | null }
  | { ok: false; error: string };

/**
 * Validates an optional uploaded image from a multipart form.
 *
 * Returns `{ ok: true, image: null }` when no file was supplied — an absent
 * image is valid (products may have no photo yet).
 */
export async function validateProductImage(
  value: FormDataEntryValue | null,
): Promise<ImageValidation> {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: true, image: null };
  }

  if (value.size > MAX_IMAGE_BYTES) {
    const limitMb = Math.floor(MAX_IMAGE_BYTES / (1024 * 1024));
    return {
      ok: false,
      error: `Image must be ${limitMb} MB or smaller.`,
    };
  }

  const contentType = value.type.trim().toLowerCase();
  const extension = ALLOWED_TYPES.get(contentType);

  if (!extension) {
    return {
      ok: false,
      error: `Image must be a ${ALLOWED_LABEL} file.`,
    };
  }

  const buffer = Buffer.from(await value.arrayBuffer());

  // Magic-byte check: the browser-declared MIME type is attacker-controlled, so
  // confirm the bytes actually match the format we were told to expect.
  if (!matchesSignature(buffer, contentType)) {
    return {
      ok: false,
      error: `That file is not a valid ${ALLOWED_LABEL} image.`,
    };
  }

  return { ok: true, image: { extension, contentType, buffer } };
}

function matchesSignature(buffer: Buffer, contentType: string): boolean {
  if (buffer.length < 12) return false;

  switch (contentType) {
    case "image/jpeg":
      // SOI marker
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case "image/webp":
      // "RIFF" .... "WEBP"
      return (
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
      );
    default:
      return false;
  }
}
