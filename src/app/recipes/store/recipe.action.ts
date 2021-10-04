import { Action } from "@ngrx/store";

import { Recipe } from './../recipe.model';

export const SET_RECIPES = '[Recipe] Set Recipes'




export class SetRecipes implements Action {
  readonly type : string = SET_RECIPES;

  constructor (public payload : {
    recipes : Recipe[];
  }) {}
}


export type RecipeListActions = SetRecipes
                               // | any;
