import React, { useState } from 'react';

function ArtworkCard({ artwork }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Overlay com informações */}
      <div
        className={`absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-6 text-white transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-2xl font-bold mb-3 text-center">
          {artwork.title}
        </h2>
        <p className="text-gray-200 text-center line-clamp-3">
          {artwork.description}
        </p>
        <div className="mt-4 text-sm text-gray-300">
          {new Date(artwork.createdAt?.toDate()).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
}

export default ArtworkCard; 