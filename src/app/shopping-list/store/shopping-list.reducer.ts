import { Ingredient } from './../../shared/ingredient.model';
//import { ADD_INGREDIENT, AddIngredient } from './shopping-list.actions';
import * as ShoppingListActions from './shopping-list.actions';

import { Action } from "@ngrx/store";

export interface IngredientsState {
  ingredients : Ingredient[];
  editedIngredient : Ingredient;
  editedIngredientIndex : number;
}



const initialState : IngredientsState = {
  ingredients:[
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ],
  editedIngredient : null,
  editedIngredientIndex : -1
};


export function shoppingListReducer(
  state : IngredientsState = initialState,
  action : ShoppingListActions.ShoppingListTypeActions
  ) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT :
        return {
          ...state,
          ingredients : [...state.ingredients , action.payload]
        };
    case ShoppingListActions.ADD_INGREDIENTS :
      return {
        ...state,
        ingredients : [...state.ingredients , ...action.payload]
      };
      /* case ShoppingListActions.DELETE_INGREDIENT :
        //let newShoppingList = state.ingredients.splice(action.payload.index, 1);
        //console.log(newShoppingList[0].name);
      return {
          ...state,
          ingredients : [...state.ingredients, state.ingredients.splice(action.payload.index, 1)]

        } */

      case ShoppingListActions.UPDATE_INGREDIENT :
          const ingredient = state.ingredients[state.editedIngredientIndex]; //Estado antigo do ingrediente
          const updatedIngredient = {
            ...ingredient, //Caso quisesse manter alguma parte do estado antigo
            ...action.payload.ingredient
          };

          const updatedIngredients = [ ...state.ingredients ]; //copia todos os ingredientes
          updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

         return {
          ...state,
          ingredients : updatedIngredients
        };

      case ShoppingListActions.DELETE_INGREDIENT :
         let index = state.editedIngredientIndex;
      return {
          ...state,
          ingredients : state.ingredients.filter((ingredientElement, indexElement) => {
             return indexElement !== index //Retorna tudo o que não é igual ao index;

          })
        };

      case ShoppingListActions.FETCH_INGREDIENTS :
        return {
          ...state
        };

      case ShoppingListActions.START_EDIT :
        let indice = action.payload.index;
        return {
            ...state,
            editedIngredient : {...state.ingredients[indice]},
            editedIngredientIndex : indice
          };

      case ShoppingListActions.STOP_EDIT :
      return {
          ...state,
          editedIngredient : null,
          editedIngredientIndex : -1
      };

    default : return state;
  }
}
