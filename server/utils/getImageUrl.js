export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${serverUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};