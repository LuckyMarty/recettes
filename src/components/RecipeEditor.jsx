import React from 'react'
import PhotoUploader from './PhotoUploader'
import IngredientsList from './IngredientsList'
import StepsList from './StepsList'
import TitleAndMeta from './TitleAndMeta'
import PrintSettings from './PrintSettings'
import { useAutoResize, useReorder } from '../hooks'

export default function RecipeEditor({ recipe, onChange, globalPrintDefaults, setGlobalPrintDefaults, onViewRecipe }) {
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

  // Image handling moved to PhotoUploader component

  const presetTags = [
    "Entrée",
    "Plat",
    "Dessert",
    "Végétarien",
    "Vegan",
    "Sucré",
    "Salé",
  ];

  const autoResize = useAutoResize([recipe.ingredients, recipe.steps, recipe.subtitle]);

  const {
    dragOverIndex,
    onDragStart: onStepDragStart,
    onDragEnd: onStepDragEnd,
    onDragOver: onStepDragOver,
    onDrop: onStepDrop,
    move: moveStep,
  } = useReorder(recipe.steps, (next) => onChange({ steps: next }));

  const {
    dragOverIndex: ingDragOverIndex,
    onDragStart: onIngredientDragStart,
    onDragEnd: onIngredientDragEnd,
    onDragOver: onIngredientDragOver,
    onDrop: onIngredientDrop,
    move: moveIngredient,
  } = useReorder(recipe.ingredients, (next) => onChange({ ingredients: next }));

  // Update print/pdf related settings stored on `recipe.print`.
  function updatePrintField(key, value) {
    const next = { ...(recipe.print || {}) };
    next[key] = value;
    onChange({ print: next });
  }

  return (
    <div className="editor">
      <TitleAndMeta
        recipe={recipe}
        updateField={updateField}
        onChangeTags={(next) => onChange({ tags: next })}
        autoResize={autoResize}
        presetTags={presetTags}
      />

      <PhotoUploader image={recipe.image} onChange={onChange} dataTutorial="image" />

      <IngredientsList
        ingredients={recipe.ingredients}
        ingDragOverIndex={ingDragOverIndex}
        onIngredientDragOver={onIngredientDragOver}
        onIngredientDrop={onIngredientDrop}
        onIngredientDragStart={onIngredientDragStart}
        onIngredientDragEnd={onIngredientDragEnd}
        moveIngredient={moveIngredient}
        updateIngredient={updateIngredient}
        removeIngredient={removeIngredient}
        addIngredient={addIngredient}
        autoResize={autoResize}
      />

      <StepsList
        steps={recipe.steps}
        dragOverIndex={dragOverIndex}
        onStepDragOver={onStepDragOver}
        onStepDrop={onStepDrop}
        onStepDragStart={onStepDragStart}
        onStepDragEnd={onStepDragEnd}
        moveStep={moveStep}
        updateStep={updateStep}
        removeStep={removeStep}
        addStep={addStep}
        autoResize={autoResize}
      />
      <PrintSettings
        recipe={recipe}
        globalPrintDefaults={globalPrintDefaults}
        updatePrintField={updatePrintField}
        setGlobalPrintDefaults={setGlobalPrintDefaults}
      />
    </div>
  );
}
