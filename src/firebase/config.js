import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVA06gQKUKyryw5UArB5Jpu6ycYh3e3_A",
  authDomain: "portifolioweb-f0cb0.firebaseapp.com",
  projectId: "portifolioweb-f0cb0",
  storageBucket: "portifolioweb-f0cb0.appspot.com",
  messagingSenderId: "582514786183",
  appId: "1:582514786183:web:f7af1757269eb6fff11d22"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore com configurações especiais para desenvolvimento
const db = getFirestore(app);

// Inicializa o Auth
const auth = getAuth(app);

// Inicializa o Storage com configurações CORS
const storage = getStorage(app);

// Função para verificar se o usuário está autenticado
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Exporta todas as instâncias necessárias
export { db, auth, storage };

export default app; 