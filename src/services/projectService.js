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

  async getProjectForEdit(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Projeto não encontrado');
    }

    const data = docSnap.data();

    // Garantimos que todos os campos existam com valores padrão
    const project = {
      id: docSnap.id,
      title: data.title || '',
      description: data.description || '',
      content: data.content || '',
      coverUrl: data.coverUrl || '',
      coverPublicId: data.coverPublicId || '',
      images: (data.images || []).map(img => ({
        ...img,
        file: null,
        url: img.url || '',
        publicId: img.publicId || '',
        description: img.description || '',
        layout: img.layout || 'full',
        spacing: img.spacing || 'normal',
        content: img.content || ''
      })),
      textStyle: {
        fontSize: data.textStyle?.fontSize || 'normal',
        alignment: data.textStyle?.alignment || 'left',
        fontFamily: data.textStyle?.fontFamily || 'sans'
      },
      spacing: data.spacing || 'normal',
      createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
      userId: data.userId || auth.currentUser?.uid
    };

    console.log('Projeto carregado para edição:', project); // Debug
    return project;
  },

  async updateProject(id, project, newCoverImage) {
    const user = checkAuth();
    const docRef = doc(db, COLLECTION_NAME, id);
    const oldProject = await getDoc(docRef);
    const updateData = { ...project };

    try {
      if (newCoverImage) {
        const coverImageData = await uploadToCloudinary(newCoverImage);
        updateData.coverUrl = coverImageData.url;
        updateData.coverPublicId = coverImageData.publicId;
      } else {
        // Mantém a imagem de capa existente
        updateData.coverUrl = oldProject.data().coverUrl;
        updateData.coverPublicId = oldProject.data().coverPublicId;
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
        return {
          ...img,
          file: null // Garante que o campo file seja sempre null no banco
        };
      });

      const uploadedImages = await Promise.all(imagePromises);
      updateData.images = uploadedImages;

      // Mantém os metadados importantes
      updateData.userId = user.uid;
      updateData.updatedAt = Timestamp.now();
      updateData.createdAt = oldProject.data().createdAt; // Mantém a data de criação original

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  },

  async deleteProject(id) {
    checkAuth();
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    // Nota: As imagens no Cloudinary podem ser mantidas ou deletadas usando a API do Cloudinary
    // dependendo da sua necessidade
  }
}; 