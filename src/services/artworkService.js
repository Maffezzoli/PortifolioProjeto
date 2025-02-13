import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const COLLECTION_NAME = 'artworks';

export const artworkService = {
  async getAllArtworks() {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getArtwork(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Arte não encontrada');
    }
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  async addArtwork(artwork, imageFile) {
    // Upload da imagem
    const imageRef = ref(storage, `artworks/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Salvar no Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...artwork,
      imageUrl,
      imagePath: imageRef.fullPath,
      createdAt: new Date()
    });

    return docRef.id;
  },

  async updateArtwork(id, artwork, newImageFile) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const oldArtwork = await getDoc(docRef);
    const updateData = { ...artwork };

    // Se houver uma nova imagem
    if (newImageFile) {
      // Deletar imagem antiga
      if (oldArtwork.data().imagePath) {
        const oldImageRef = ref(storage, oldArtwork.data().imagePath);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Erro ao deletar imagem antiga:', error);
        }
      }

      // Upload da nova imagem
      const imageRef = ref(storage, `artworks/${Date.now()}_${newImageFile.name}`);
      await uploadBytes(imageRef, newImageFile);
      const imageUrl = await getDownloadURL(imageRef);

      updateData.imageUrl = imageUrl;
      updateData.imagePath = imageRef.fullPath;
    }

    await updateDoc(docRef, updateData);
  },

  async deleteArtwork(id) {
    // Pegar referência do documento
    const docRef = doc(db, COLLECTION_NAME, id);
    const artwork = await getDoc(docRef);

    // Deletar imagem do Storage
    if (artwork.data().imagePath) {
      const imageRef = ref(storage, artwork.data().imagePath);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Erro ao deletar imagem:', error);
      }
    }

    // Deletar documento do Firestore
    await deleteDoc(docRef);
  }
}; 