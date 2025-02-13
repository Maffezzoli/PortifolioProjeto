// Configuração do Firebase
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBZhsabDexE6HhI_aqXx8v4_BkrhwLEJgc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portifolio-nath.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portifolio-nath",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portifolio-nath.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1015650833304",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1015650833304:web:c2f5e8bb602d3ed6c6a7d7"
};

// Configuração do Cloudinary
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dgtzp1ci7",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "PortifolioDb",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "643415825374823",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "b5wqE2MhdjlYSzREMQmN2f4bSJo"
}; 