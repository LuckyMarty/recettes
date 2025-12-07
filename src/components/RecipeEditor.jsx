import React, { useRef, useState, useEffect } from "react";
import toast from 'react-hot-toast'

export default function RecipeEditor({ recipe, onChange, globalPrintDefaults, setGlobalPrintDefaults }) {
  function updateField(key, value) {
    onChange({ [key]: value });
  }

  function updateIngredient(idx, value) {
    const next = [...recipe.ingredients];
    next[idx] = value;
    onChange({ ingredients: next });
  }

  function addIngredient() {
    onChange({ ingredients: [...recipe.ingredients, ""] });
  }

  function removeIngredient(idx) {
    const next = recipe.ingredients.filter((_, i) => i !== idx);
    onChange({ ingredients: next });
  }

  function updateStep(idx, value) {
    const next = [...recipe.steps];
    next[idx] = value;
    onChange({ steps: next });
  }

  function addStep() {
    onChange({ steps: [...recipe.steps, ""] });
  }

  function removeStep(idx) {
    const next = recipe.steps.filter((_, i) => i !== idx);
    onChange({ steps: next });
  }

  function handleImageFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ image: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    onChange({ image: null });
  }

  // Tags management
  const presetTags = [
    "Entrée",
    "Plat",
    "Dessert",
    "Végétarien",
    "Vegan",
    "Sucré",
    "Salé",
  ];
  const [newTag, setNewTag] = useState("");

  // Drag & drop state for tag reordering
  const tagDragIndex = useRef(null);
  const [tagDragOverIndex, setTagDragOverIndex] = useState(null);

  function onTagDragStart(e, idx) {
    tagDragIndex.current = idx;
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch (err) {}
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList && e.currentTarget.classList.add("dragging");
  }

  function onTagDragEnd(e) {
    tagDragIndex.current = null;
    setTagDragOverIndex(null);
    e.currentTarget.classList && e.currentTarget.classList.remove("dragging");
  }

  function onTagDragOver(e, idx) {
    e.preventDefault();
    if (tagDragOverIndex !== idx) setTagDragOverIndex(idx);
  }

  function onTagDrop(e, idx) {
    e.preventDefault();
    const from =
      tagDragIndex.current != null
        ? tagDragIndex.current
        : Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    if (from == null || from === to) {
      setTagDragOverIndex(null);
      return;
    }
    const next = [...(recipe.tags || [])];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange({ tags: next });
    setTagDragOverIndex(null);
  }

  function moveTag(idx, delta) {
    const to = idx + delta;
    if (to < 0 || to >= (recipe.tags || []).length) return;
    const next = [...(recipe.tags || [])];
    const [moved] = next.splice(idx, 1);
    next.splice(to, 0, moved);
    onChange({ tags: next });
  }

  function toggleTag(tag) {
    const has = recipe.tags && recipe.tags.includes(tag);
    const next = has
      ? recipe.tags.filter((t) => t !== tag)
      : [...(recipe.tags || []), tag];
    onChange({ tags: next });
  }

  function addNewTag() {
    const tag = newTag.trim();
    if (!tag) return;
    const next = [...(recipe.tags || [])];
    if (!next.includes(tag)) next.push(tag);
    onChange({ tags: next });
    setNewTag("");
  }

  function removeTag(tag) {
    const next = (recipe.tags || []).filter((t) => t !== tag);
    onChange({ tags: next });
  }

  function autoResize(e) {
    const el = e.target;
    // reset height to allow shrinking
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // Resize all auto-resize textareas after DOM updates (e.g., after reordering)
  function resizeAllTextareas() {
    if (typeof document === "undefined") return;
    const els = document.querySelectorAll(".auto-resize");
    els.forEach((el) => {
      // reset and set to scrollHeight so multi-line entries show fully
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    });
  }

  useEffect(() => {
    // run after every change to ingredients or steps so heights stay correct
    resizeAllTextareas();
    // also run when subtitle changes (multiline)
  }, [recipe.ingredients, recipe.steps, recipe.subtitle]);

  // Drag & drop state for reordering steps
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function onStepDragStart(e, idx) {
    dragIndex.current = idx;
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch (err) {}
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("dragging");
  }

  function onStepDragEnd(e) {
    dragIndex.current = null;
    setDragOverIndex(null);
    e.currentTarget.classList.remove("dragging");
  }

  function onStepDragOver(e, idx) {
    e.preventDefault();
    if (dragOverIndex !== idx) setDragOverIndex(idx);
  }

  function onStepDrop(e, idx) {
    e.preventDefault();
    const from =
      dragIndex.current != null
        ? dragIndex.current
        : Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    if (from === to || from == null) {
      setDragOverIndex(null);
      return;
    }
    const next = [...recipe.steps];
    const [moved] = next.splice(from, 1);
    // if dropping after original index, adjust target
    next.splice(to, 0, moved);
    onChange({ steps: next });
    setDragOverIndex(null);
  }

  function moveStep(idx, delta) {
    const to = idx + delta;
    if (to < 0 || to >= recipe.steps.length) return;
    const next = [...recipe.steps];
    const [moved] = next.splice(idx, 1);
    next.splice(to, 0, moved);
    onChange({ steps: next });
  }

  // --- Ingredients drag & reorder (same pattern as steps) ---
  const ingDragIndex = useRef(null);
  const [ingDragOverIndex, setIngDragOverIndex] = useState(null);

  function onIngredientDragStart(e, idx) {
    ingDragIndex.current = idx;
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch (err) {}
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList && e.currentTarget.classList.add("dragging");
  }

  function onIngredientDragEnd(e) {
    ingDragIndex.current = null;
    setIngDragOverIndex(null);
    e.currentTarget.classList && e.currentTarget.classList.remove("dragging");
  }

  function onIngredientDragOver(e, idx) {
    e.preventDefault();
    if (ingDragOverIndex !== idx) setIngDragOverIndex(idx);
  }

  function onIngredientDrop(e, idx) {
    e.preventDefault();
    const from =
      ingDragIndex.current != null
        ? ingDragIndex.current
        : Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    if (from === to || from == null) {
      setIngDragOverIndex(null);
      return;
    }
    const next = [...recipe.ingredients];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange({ ingredients: next });
    setIngDragOverIndex(null);
  }

  function moveIngredient(idx, delta) {
    const to = idx + delta;
    if (to < 0 || to >= recipe.ingredients.length) return;
    const next = [...recipe.ingredients];
    const [moved] = next.splice(idx, 1);
    next.splice(to, 0, moved);
    onChange({ ingredients: next });
  }

  // Update print/pdf related settings stored on `recipe.print`.
  function updatePrintField(key, value) {
    const next = { ...(recipe.print || {}) };
    next[key] = value;
    onChange({ print: next });
  }

  return (
    <div className="editor">
      <section>
          <h3>
          📝 Nom de la recette
          <input
            data-tutorial="title"
            value={recipe.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="ex: Tarte aux pommes"
          />
        </h3>
      </section>
      {/* Tags - moved under title */}
      <section>
        <h3 style={{ marginTop: 8 }}>🏷️ Catégories</h3>
        <div className="tags-row">
          {presetTags.map((t) => {
            const active = recipe.tags && recipe.tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                className={`btn small ${active ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggleTag(t)}
                aria-pressed={active}
                title={t}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="tag-add-row">
          <input
            placeholder="Ajouter une catégorie personnalisée"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNewTag();
              }
            }}
          />
          <button
            className="btn"
            type="button"
            onClick={addNewTag}
            title="Ajouter la catégorie"
          >
            ➕ Ajouter
          </button>
        </div>
        <div className="tags-list">
          {(recipe.tags || []).map((t, idx) => (
            <span
              key={t}
              className={`tag-chip ${
                tagDragOverIndex === idx ? "drag-over" : ""
              }`}
              draggable
              onDragStart={(e) => onTagDragStart(e, idx)}
              onDragOver={(e) => onTagDragOver(e, idx)}
              onDrop={(e) => onTagDrop(e, idx)}
              onDragEnd={onTagDragEnd}
              tabIndex={0}
              title={t}
              onKeyDown={(e) => {
                // keyboard reorder: Ctrl+ArrowLeft / Ctrl+ArrowRight or Up/Down
                if (!e.ctrlKey) return;
                if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                  moveTag(idx, -1);
                if (e.key === "ArrowRight" || e.key === "ArrowDown")
                  moveTag(idx, 1);
              }}
            >
              {t}
              <button
                className="icon-btn"
                onClick={() => removeTag(t)}
                aria-label={`Supprimer tag ${t}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <p className="muted-text">
          💡 Cliquez sur une catégorie pour la sélectionner
        </p>
      </section>

      <section>
        <h3>💬 Description</h3>
        <textarea
          className="auto-resize"
          rows={1}
          value={recipe.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          onInput={autoResize}
          placeholder="ex: Dessert familial traditionnel"
        />
      </section>

      <section>
        <h3>🍽️ Portions & temps</h3>
        <div className="row">
          <label>
            <svg
              className="field-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                fill="currentColor"
              />
              <path
                d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z"
                fill="currentColor"
              />
            </svg>
            Personnes
            <input
              value={recipe.servings}
              onChange={(e) => updateField("servings", e.target.value)}
              placeholder="ex: 4"
            />
          </label>

          <label>
            <svg
              className="field-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 8v5l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Préparation
            <input
              value={recipe.prepTime}
              onChange={(e) => updateField("prepTime", e.target.value)}
              placeholder="ex: 20 min"
            />
          </label>

          <label>
            <svg
              className="field-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7 7h10M7 11h10M7 15h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Cuisson
            <input
              value={recipe.cookTime}
              onChange={(e) => updateField("cookTime", e.target.value)}
              placeholder="ex: 45 min"
            />
          </label>
        </div>
      </section>

      <section>
        <h3>📷 Photo de la recette</h3>
        <div className="image-controls">
          <input data-tutorial="image" type="file" accept="image/*" onChange={handleImageFile} />
          {recipe.image && (
            <div className="image-preview-row">
              <img src={recipe.image} alt="Aperçu" className="thumb" />
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

      <section>
        <h3>🥕 Ingrédients</h3>
        <p className="muted-text">
          Utilisez les flèches <strong>▲</strong> et <strong>▼</strong> pour
          changer l'ordre.
        </p>
        {(recipe.ingredients || []).map((ing, idx) => (
          <div
            key={idx}
            className={`list-row ${
              ingDragOverIndex === idx ? "drag-over" : ""
            }`}
            onDragOver={(e) => onIngredientDragOver(e, idx)}
            onDrop={(e) => onIngredientDrop(e, idx)}
          >
            <div className="step-controls">
              <span
                className="drag-handle"
                title="Déplacer ingrédient"
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => onIngredientDragStart(e, idx)}
                onDragEnd={onIngredientDragEnd}
                onKeyDown={(e) => {
                  if (!e.ctrlKey) return;
                  if (e.key === "ArrowUp" && idx > 0) moveIngredient(idx, -1);
                  if (
                    e.key === "ArrowDown" &&
                    idx < recipe.ingredients.length - 1
                  )
                    moveIngredient(idx, 1);
                }}
              >
                ≡
              </span>
              <button
                type="button"
                className="btn small"
                onClick={() => moveIngredient(idx, -1)}
                aria-label={`Déplacer ingrédient ${idx + 1} vers le haut`}
                disabled={idx === 0}
                title="Monter cet ingrédient"
              >
                ▲
              </button>
              <button
                type="button"
                className="btn small"
                onClick={() => moveIngredient(idx, 1)}
                aria-label={`Déplacer ingrédient ${idx + 1} vers le bas`}
                disabled={idx === recipe.ingredients.length - 1}
                title="Descendre cet ingrédient"
              >
                ▼
              </button>
            </div>
            <textarea
              className="ingredient-input auto-resize"
              rows={1}
              value={ing}
              onChange={(e) => {
                updateIngredient(idx, e.target.value);
                autoResize(e);
              }}
              onInput={autoResize}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="ex: 250g de farine"
            />
            <button
              className="btn btn-icon"
              onClick={() => removeIngredient(idx)}
              aria-label={`Supprimer ingrédient ${idx}`}
              title="Supprimer cet ingrédient"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={addIngredient}
          title="Ajouter un ingrédient"
        >
          ➕ Ajouter un ingrédient
        </button>
      </section>

      <section>
        <h3>👩‍🍳 Étapes de préparation</h3>
        <p className="muted-text">
          Utilisez les flèches <strong>▲</strong> et <strong>▼</strong> pour
          changer l'ordre.
        </p>
        {(recipe.steps || []).map((s, idx) => (
          <div
            key={idx}
            className={`list-row ${dragOverIndex === idx ? "drag-over" : ""}`}
            onDragOver={(e) => onStepDragOver(e, idx)}
            onDrop={(e) => onStepDrop(e, idx)}
          >
            <div className="step-controls">
              <span
                className="drag-handle"
                title="Déplacer étape"
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(e) => onStepDragStart(e, idx)}
                onDragEnd={onStepDragEnd}
                onKeyDown={(e) => {
                  // allow keyboard reordering: Ctrl+ArrowUp / Ctrl+ArrowDown to move
                  if (!e.ctrlKey) return;
                  if (e.key === "ArrowUp" && idx > 0) moveStep(idx, -1);
                  if (e.key === "ArrowDown" && idx < recipe.steps.length - 1)
                    moveStep(idx, 1);
                }}
              >
                ≡
              </span>
              <button
                type="button"
                className="btn small"
                onClick={() => moveStep(idx, -1)}
                aria-label={`Déplacer étape ${idx + 1} vers le haut`}
                disabled={idx === 0}
                title="Monter cette étape"
              >
                ▲
              </button>
              <button
                type="button"
                className="btn small"
                onClick={() => moveStep(idx, 1)}
                aria-label={`Déplacer étape ${idx + 1} vers le bas`}
                disabled={idx === recipe.steps.length - 1}
                title="Descendre cette étape"
              >
                ▼
              </button>
            </div>
            <textarea
              className="auto-resize"
              value={s}
              onChange={(e) => {
                updateStep(idx, e.target.value);
                autoResize(e);
              }}
              onInput={autoResize}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="ex: Préchauffer le four à 180°C..."
            />
            <button
              className="btn btn-icon"
              onClick={() => removeStep(idx)}
              aria-label={`Supprimer étape ${idx}`}
              title="Supprimer cette étape"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={addStep}
          title="Ajouter une étape"
        >
          ➕ Ajouter une étape
        </button>
      </section>
      <section>
        <h3>🖨️ Impression / PDF</h3>
        <p className="muted-text">
          Personnalisez la mise en page de votre recette pour l'impression ou l'export PDF. 
          Ces réglages sont sauvegardés avec la recette.
        </p>

        <div className="print-settings">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:14,color:'var(--text-dark)'}}>Options globales</div>
            <div>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const next = { ...(globalPrintDefaults || {}), ...(recipe.print || {}) }
                  try {
                    setGlobalPrintDefaults(next)
                    toast.success("🔖 Réglages d'impression enregistrés comme défauts")
                  } catch (e) {
                    console.error('Failed to save global print defaults', e)
                    toast.error("Erreur : impossible d'enregistrer les réglages")
                  }
                }}
                title="Enregistrer les réglages d'impression actuels comme valeurs par défaut pour les nouvelles recettes"
              >
                💾 Enregistrer comme défaut
              </button>
            </div>
          </div>
          {/* Marges Section */}
          <div className="print-section">
            <h4 className="print-section-title">📏 Marges de la page</h4>
            <div className="print-subsection">
              <label className="inline-label">
                <span>Unité de mesure</span>
                <select
                  value={recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}
                  onChange={(e) => updatePrintField("marginUnit", e.target.value)}
                  style={{width: 'auto', minWidth: '100px'}}
                >
                  <option value="mm">Millimètres (mm)</option>
                  <option value="cm">Centimètres (cm)</option>
                  <option value="in">Pouces (in)</option>
                </select>
              </label>
            </div>
            <div className="row two-columns">
              <label>
                <span className="label-icon">⬆️</span> Marge haut
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={recipe.print?.marginTop ?? globalPrintDefaults?.marginTop ?? 10}
                  onChange={(e) => updatePrintField("marginTop", Number(e.target.value))}
                  placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
                />
              </label>
              <label>
                <span className="label-icon">⬇️</span> Marge bas
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={recipe.print?.marginBottom ?? globalPrintDefaults?.marginBottom ?? 10}
                  onChange={(e) => updatePrintField("marginBottom", Number(e.target.value))}
                  placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
                />
              </label>
              <label>
                <span className="label-icon">⬅️</span> Marge gauche
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={recipe.print?.marginLeft ?? globalPrintDefaults?.marginLeft ?? 10}
                  onChange={(e) => updatePrintField("marginLeft", Number(e.target.value))}
                  placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
                />
              </label>
              <label>
                <span className="label-icon">➡️</span> Marge droite
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={recipe.print?.marginRight ?? globalPrintDefaults?.marginRight ?? 10}
                  onChange={(e) => updatePrintField("marginRight", Number(e.target.value))}
                  placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
                />
              </label>
            </div>
          </div>

          {/* Font Sizes Section */}
          <div className="print-section">
            <h4 className="print-section-title">✏️ Taille des textes</h4>
            <p className="print-hint">Ajustez la taille des polices en pixels (px) pour l'impression</p>
            
            <div className="print-subsection">
              <div className="subsection-header">En-tête de la recette</div>
              <div className="row two-columns">
                <label>
                  Titre principal
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.titleFontSize ?? globalPrintDefaults?.titleFontSize ?? 20}
                    onChange={(e) => updatePrintField("titleFontSize", Number(e.target.value))}
                    placeholder="20 px"
                  />
                </label>
                <label>
                  Description
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.subtitleFontSize ?? globalPrintDefaults?.subtitleFontSize ?? 14}
                    onChange={(e) => updatePrintField("subtitleFontSize", Number(e.target.value))}
                    placeholder="14 px"
                  />
                </label>
                <label>
                  Catégories / Tags
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.categoriesFontSize ?? globalPrintDefaults?.categoriesFontSize ?? 12}
                    onChange={(e) => updatePrintField("categoriesFontSize", Number(e.target.value))}
                    placeholder="12 px"
                  />
                </label>
                <label>
                  Portions & temps
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.metaFontSize ?? globalPrintDefaults?.metaFontSize ?? 13}
                    onChange={(e) => updatePrintField("metaFontSize", Number(e.target.value))}
                    placeholder="13 px"
                  />
                </label>
              </div>
            </div>

            <div className="print-subsection">
              <div className="subsection-header">Section Ingrédients</div>
              <div className="row two-columns">
                <label>
                  Titre "Ingrédients"
                  <input
                      type="number"
                      min="6"
                      max="72"
                      value={recipe.print?.ingredientsTitleFontSize ?? globalPrintDefaults?.ingredientsTitleFontSize ?? 16}
                      onChange={(e) => updatePrintField("ingredientsTitleFontSize", Number(e.target.value))}
                      placeholder="16 px"
                    />
                </label>
                <label>
                  Liste des ingrédients
                  <input
                    type="number"
                    min="6"
                    max="72"
                      value={recipe.print?.ingredientsBodyFontSize ?? recipe.print?.ingredientsFontSize ?? globalPrintDefaults?.ingredientsBodyFontSize ?? globalPrintDefaults?.ingredientsFontSize ?? 12}
                      onChange={(e) => updatePrintField("ingredientsBodyFontSize", Number(e.target.value))}
                    placeholder="12 px"
                  />
                </label>
              </div>
            </div>

            <div className="print-subsection">
              <div className="subsection-header">Section Préparation</div>
              <div className="row two-columns">
                <label>
                  Titre "Préparation"
                  <input
                      type="number"
                      min="6"
                      max="72"
                      value={recipe.print?.stepsTitleFontSize ?? globalPrintDefaults?.stepsTitleFontSize ?? 16}
                      onChange={(e) => updatePrintField("stepsTitleFontSize", Number(e.target.value))}
                      placeholder="16 px"
                    />
                </label>
                <label>
                  Texte des étapes
                  <input
                    type="number"
                    min="6"
                    max="72"
                      value={recipe.print?.stepsBodyFontSize ?? recipe.print?.stepsFontSize ?? globalPrintDefaults?.stepsBodyFontSize ?? globalPrintDefaults?.stepsFontSize ?? 12}
                      onChange={(e) => updatePrintField("stepsBodyFontSize", Number(e.target.value))}
                    placeholder="12 px"
                  />
                </label>
                <label>
                  Numéro d'étape
                  <input
                    type="number"
                    min="6"
                    max="72"
                      value={recipe.print?.stepNumberFontSize ?? globalPrintDefaults?.stepNumberFontSize ?? 16}
                      onChange={(e) => updatePrintField("stepNumberFontSize", Number(e.target.value))}
                    placeholder="16 px"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
