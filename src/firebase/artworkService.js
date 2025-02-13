import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

export const artworkService = {
  // Adicionar nova arte
  async addArtwork(artwork, imageFile) {
    try {
      // Upload da imagem para o Storage
      const storageRef = ref(storage, `artworks/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Adicionar documento ao Firestore
      const docRef = await addDoc(collection(db, 'artworks'), {
        ...artwork,
        imageUrl,
        createdAt: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar artwork:', error);
      throw error;
    }
  },

  // Buscar todas as artes
  async getAllArtworks() {
    try {
      const querySnapshot = await getDocs(collection(db, 'artworks'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar artworks:', error);
      throw error;
    }
  },

  // Deletar uma arte
  async deleteArtwork(id, imageUrl) {
    try {
      // Deletar imagem do Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Deletar documento do Firestore
      await deleteDoc(doc(db, 'artworks', id));
    } catch (error) {
      console.error('Erro ao deletar artwork:', error);
      throw error;
    }
  },

  // Atualizar uma arte
  async updateArtwork(id, updatedData, newImageFile = null) {
    try {
      let imageUrl = updatedData.imageUrl;

      if (newImageFile) {
        // Upload da nova imagem
        const storageRef = ref(storage, `artworks/${newImageFile.name}`);
        await uploadBytes(storageRef, newImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Atualizar documento no Firestore
      await updateDoc(doc(db, 'artworks', id), {
        ...updatedData,
        imageUrl,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar artwork:', error);
      throw error;
    }
  }
}; 