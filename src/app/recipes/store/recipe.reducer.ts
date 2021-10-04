import { Recipe } from './../recipe.model';

import * as fromRecipeActions from './recipe.action'

export interface RecipeState {
  recipes : Recipe[];
  loading : boolean;
  recipeEditing : Recipe;
}

const initialState : RecipeState = {
  recipes : null,
  loading : false,
  recipeEditing : null
};

export function recipeReducer (
  state = initialState,
  action : fromRecipeActions.RecipeListActions
){
  switch (action.type){
    case fromRecipeActions.SET_RECIPES :
      return{
        ...state,
        recipes : [...action.payload.recipes]
      }
      default :
      return state;

  }
}
