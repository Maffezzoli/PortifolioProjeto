import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { uploadImage } from './imageService';

export const projectService = {
  async addProject(project, coverImage) {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      let projectData = { ...project };
      
      // Upload da imagem de capa
      if (coverImage) {
        const coverUrl = await uploadImage(coverImage);
        projectData.coverUrl = coverUrl;
      }

      // Upload das imagens adicionais
      const uploadedImages = await Promise.all(
        project.images.map(async (image) => {
          if (image.file) {
            const imageUrl = await uploadImage(image.file);
            return {
              url: imageUrl,
              description: image.description,
              layout: image.layout
            };
          }
          return null;
        })
      );

      // Remove as entradas nulas e o campo 'file'
      projectData.images = uploadedImages.filter(img => img !== null);
      
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      throw error;
    }
  },

  async getAllProjects() {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Projetos carregados:', projects); // Log para debug
      return projects;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }
  },

  async getProject(id) {
    try {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      throw error;
    }
  },

  async updateProject(id, data, newCoverImage = null) {
    try {
      let updateData = { ...data };
      
      if (newCoverImage) {
        const imageUrl = await uploadImage(newCoverImage);
        updateData.coverUrl = imageUrl;
      }

      await updateDoc(doc(db, 'projects', id), {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw error;
    }
  }
}; 