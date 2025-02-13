import React from 'react';

function ArtworkCard({ artwork }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{artwork.title}</h2>
        <p className="text-gray-600">{artwork.description}</p>
      </div>
    </div>
  );
}

export default ArtworkCard; 