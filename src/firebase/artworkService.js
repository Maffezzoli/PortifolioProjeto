import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { uploadImage } from '../services/imageService';

export const artworkService = {
  // Adicionar nova arte
  async addArtwork(artwork, imageFile) {
    try {
      // Upload da imagem para o serviço de hospedagem
      const imageUrl = await uploadImage(imageFile);

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
        const imageUrl = await uploadImage(newImageFile);
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
  },

  async createArtwork(artworkData, imageFile) {
    try {
      // Upload da imagem
      const storageRef = ref(storage, `artworks/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Salva no Firestore
      const docRef = await addDoc(collection(db, 'artworks'), {
        ...artworkData,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      return {
        id: docRef.id,
        ...artworkData,
        imageUrl
      };
    } catch (error) {
      console.error('Erro ao criar artwork:', error);
      throw error;
    }
  },

  async updateArtwork(id, artworkData) {
    try {
      const artworkRef = doc(db, 'artworks', id);
      await updateDoc(artworkRef, {
        ...artworkData,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar artwork:', error);
      throw error;
    }
  },

  async deleteArtwork(id) {
    try {
      await deleteDoc(doc(db, 'artworks', id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar artwork:', error);
      throw error;
    }
  }
}; 