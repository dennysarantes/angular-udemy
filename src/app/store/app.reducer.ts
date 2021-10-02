import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import { ActionReducerMap } from '@ngrx/store'

  export interface AppState {
    shoppingListCriadoPorMim : fromShoppingList.IngredientsState,
    auth : fromAuth.AuthState
  }

  export const appReducer : ActionReducerMap<AppState> = {
      shoppingListCriadoPorMim : fromShoppingList.shoppingListReducer,
      auth : fromAuth.authReducer
  }
