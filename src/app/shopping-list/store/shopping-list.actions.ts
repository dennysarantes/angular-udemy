import { Ingredient } from './../../shared/ingredient.model';
import { Action } from '@ngrx/store'

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const FETCH_INGREDIENTS = 'FETCH_INGREDIENTS';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export class AddIngredient implements Action {
 readonly type: string = ADD_INGREDIENT;
 constructor(public payload : Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type: string = ADD_INGREDIENTS;
  constructor(public payload : Ingredient[]) {}
 }

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload : {ingredient: Ingredient}) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class FecthIngredients implements Action {
  readonly type = FETCH_INGREDIENTS;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload : {index : number}){}
}

export class StoptEdit implements Action {
  readonly type = STOP_EDIT;

}

 export type ShoppingListTypeActions = AddIngredients
                                      | AddIngredient
                                      | DeleteIngredient
                                      | UpdateIngredient
                                      | StartEdit
                                      | StoptEdit
                                      | any;
