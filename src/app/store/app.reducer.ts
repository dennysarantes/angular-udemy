import { ActionReducerMap } from '@ngrx/store'

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import * as fromRecipe from '../recipes/store/recipe.reducer'

  export interface AppState {
    shoppingListCriadoPorMim : fromShoppingList.IngredientsState,
    auth : fromAuth.AuthState,
    recipe : fromRecipe.RecipeState
  }

  export const appReducer : ActionReducerMap<AppState> = {
      shoppingListCriadoPorMim : fromShoppingList.shoppingListReducer,
      auth : fromAuth.authReducer,
      recipe : fromRecipe.recipeReducer
  }
