const isMobile = window.location.href.includes('192.168.4.23');

const apiUrl = isMobile
  ? import.meta.env.VITE_LOCAL_BACKEND_URL
  : import.meta.env.VITE_API_URL;

export default apiUrl;
