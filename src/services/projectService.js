import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { cloudinaryConfig } from '../config/cloudinary';

const COLLECTION_NAME = 'projects';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

const checkAuth = () => {
  if (!auth.currentUser) {
    throw new Error('Usuário não autenticado');
  }
  return auth.currentUser;
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('api_key', cloudinaryConfig.apiKey);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro Cloudinary:', errorData);
      throw new Error(errorData.error?.message || 'Erro ao fazer upload da imagem');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw error;
  }
};

export const projectService = {
  async addProject(project, coverImage) {
    const user = checkAuth();

    try {
      // Upload da imagem de capa
      const coverImageData = await uploadToCloudinary(coverImage);

      // Upload das imagens adicionais
      const imagePromises = project.images.map(async (img) => {
        if (img.file) {
          const imageData = await uploadToCloudinary(img.file);
          return {
            ...img,
            url: imageData.url,
            publicId: imageData.publicId,
            file: null
          };
        }
        return img;
      });

      const uploadedImages = await Promise.all(imagePromises);

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...project,
        userId: user.uid,
        coverUrl: coverImageData.url,
        coverPublicId: coverImageData.publicId,
        images: uploadedImages,
        createdAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      throw error;
    }
  },

  async getAllProjects() {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(doc.data().createdAt)
    }));
  },

  async getProject(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Projeto não encontrado');
    }
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(data.createdAt)
    };
  },

  async updateProject(id, project, newCoverImage) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...project };

    if (newCoverImage) {
      const coverImageData = await uploadToCloudinary(newCoverImage);
      updateData.coverUrl = coverImageData.url;
      updateData.coverPublicId = coverImageData.publicId;
    }

    const imagePromises = project.images.map(async (img) => {
      if (img.file) {
        const imageData = await uploadToCloudinary(img.file);
        return {
          ...img,
          url: imageData.url,
          publicId: imageData.publicId,
          file: null
        };
      }
      return img;
    });

    const uploadedImages = await Promise.all(imagePromises);
    updateData.images = uploadedImages;

    await updateDoc(docRef, updateData);
  },

  async deleteProject(id) {
    checkAuth();
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    // Nota: As imagens no Cloudinary podem ser mantidas ou deletadas usando a API do Cloudinary
    // dependendo da sua necessidade
  }
}; 