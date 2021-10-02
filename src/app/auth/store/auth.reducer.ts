import { AuthListActionTypes, LOGIN_START } from './auth.action';
import { User } from '../user.model';
import * as AuthActions from './auth.action'

export interface AuthState {
  user : User;
  authError : string;
  loading : boolean;
  userSignup : User;
}

const initialState : AuthState = {
  user : null,
  authError : null,
  loading : false,
  userSignup : null
};

export function authReducer(
  state = initialState,
  action : AuthActions.AuthListActionTypes
  ) {
    switch (action.type){
        case AuthActions.LOGIN :
          console.log('Token recebido na store> ' + action.payload.token);
        const userLoged = new User(
          action.payload.email,
          action.payload.userId,
          action.payload.token,
          action.payload.tokenExpirationDate
          );
          console.log('Token atualizado na store: ' + userLoged.token);
        return{
          ...state,
          user : userLoged,
          authError : null,
          loading : false
        };

        case AuthActions.LOGOUT :
        return{
          ...state,
          user : null,
          authError : null,
          loading : false
        };
        case AuthActions.LOGIN_START :
          return {
            ...state,
            authError: null,
            loading : true
          }
        case AuthActions.LOGIN_FAIL :
          return {
            ...state,
            user : null,
            authError : action.payload,
            loading : false
          }

        case AuthActions.SIGNUP_START :
          return {
            ...state,
            loading : true
          }

        case AuthActions.CLEAR_ERROR :
        return {
          ...state,
          authError : null
        }

        case AuthActions.SIGNUP_SUCCESS :
          console.log('Token recebido na store logo após SIGNUP> ' + action.payload.token);
          const userSignuped = new User(
            action.payload.email,
            action.payload.userId,
            action.payload.token,
            action.payload.tokenExpirationDate
            );
        return {
          ...state,
          loading : false,

        }


        default : return state;

    }

  }
