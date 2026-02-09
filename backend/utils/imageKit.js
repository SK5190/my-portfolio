/**
 * Resolve project image URL for ImageKit.
 * - If `image` is already a full URL (starts with http), return as-is.
 * - Otherwise treat as ImageKit path and prepend IMAGEKIT_URL_ENDPOINT.
 */
export function getImageUrl(image) {
  if (!image) return '';
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image;
  }
  const endpoint = (process.env.IMAGEKIT_URL_ENDPOINT || '').replace(/\/$/, '');
  return endpoint ? `${endpoint}/${image.replace(/^\//, '')}` : image;
}
