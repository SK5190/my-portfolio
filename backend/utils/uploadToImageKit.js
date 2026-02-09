import ImageKit from 'imagekit';

let imagekit = null;

/** Returns true if ImageKit env vars are set (for optional resume storage). */
export function isImageKitConfigured() {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  return !!(urlEndpoint && privateKey && publicKey);
}

function getImageKit() {
  if (imagekit) return imagekit;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!urlEndpoint || !privateKey || !publicKey) {
    throw new Error('IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_PRIVATE_KEY must be set for uploads');
  }
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint: urlEndpoint.replace(/\/$/, '') + '/'
  });
  return imagekit;
}

/**
 * Upload a buffer to ImageKit.
 * @param {Buffer} buffer - file buffer
 * @param {string} fileName - e.g. "my-project.jpg"
 * @param {string} [folder] - optional folder path, e.g. "projects"
 * @returns {Promise<{ url: string }>}
 */
export async function uploadToImageKit(buffer, fileName, folder = 'projects') {
  const ik = getImageKit();
  const filePath = folder ? `${folder.replace(/^\//, '').replace(/\/$/, '')}/${fileName}` : fileName;
  const result = await ik.upload({
    file: buffer,
    fileName: fileName.replace(/[^a-zA-Z0-9._-]/g, '_'),
    folder: folder ? folder.replace(/^\//, '').replace(/\/$/, '') : undefined
  });
  return { url: result.url, filePath: result.filePath };
}
