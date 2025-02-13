const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgtzp1ci7/image/upload";
const UPLOAD_PRESET = "PortifolioDb"; // Crie um unsigned upload preset no Cloudinary

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};

export { uploadImage }; 