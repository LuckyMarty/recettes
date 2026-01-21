import React from 'react';

export default function PhotoUploader({ image, onChange, dataTutorial }) {
  function handleImageFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ image: reader.result });
    reader.readAsDataURL(file);
  }

  function removeImage() {
    onChange({ image: null });
  }

  return (
    <section>
      <h3>📷 Photo de la recette</h3>
      <div className="image-controls">
        <input data-tutorial={dataTutorial || "image"} type="file" accept="image/*" onChange={handleImageFile} />
        {image && (
          <div className="image-preview-row">
            <img src={image} alt="Aperçu" className="thumb" />
            <button
              className="btn btn-ghost"
              onClick={removeImage}
              title="Supprimer la photo"
            >
              🗑️ Supprimer
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
