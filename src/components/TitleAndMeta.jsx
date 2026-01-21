import React from 'react'
import TagManager from './TagManager'

export default function TitleAndMeta({ recipe, updateField, onChangeTags, autoResize, presetTags }) {
  return (
    <>
      <section>
        <h3 style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span>📝 Nom de la recette</span>
          <input
            data-tutorial="title"
            value={recipe.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="ex: Tarte aux pommes"
            style={{flex: 1}}
          />
        </h3>
      </section>

      <TagManager
        tags={recipe.tags}
        presetTags={presetTags}
        onChangeTags={(next) => onChangeTags(next)}
      />

      <section>
        <h3>💬 Description</h3>
        <textarea
          className="auto-resize"
          rows={1}
          value={recipe.subtitle}
          onChange={(e) => updateField('subtitle', e.target.value)}
          onInput={autoResize}
          placeholder="ex: Dessert familial traditionnel"
        />
      </section>

      <section>
        <h3>🍽️ Portions & temps</h3>
        <div className="row">
          <label>
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z" fill="currentColor" />
            </svg>
            Personnes
            <input
              value={recipe.servings}
              onChange={(e) => updateField('servings', e.target.value)}
              placeholder="ex: 4"
            />
          </label>

          <label>
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            Préparation
            <input
              value={recipe.prepTime}
              onChange={(e) => updateField('prepTime', e.target.value)}
              placeholder="ex: 20 min"
            />
          </label>

          <label>
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cuisson
            <input
              value={recipe.cookTime}
              onChange={(e) => updateField('cookTime', e.target.value)}
              placeholder="ex: 45 min"
            />
          </label>
        </div>
      </section>
    </>
  )
}
