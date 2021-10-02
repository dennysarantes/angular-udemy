import { Action } from "@ngrx/store";

export const SIGNUP_START = '[Auth] Signup start'
export const SIGNUP_SUCCESS = '[Auth] Signup success'
export const SIGNUP_FAIL = '[Auth] Signup fail'
export const LOGIN_START = '[Auth] Login_Start';
export const LOGIN = 'LOGIN'; //Esse seria o login success, mas o instrutor ficou com preguiça de renomear
export const LOGIN_FAIL = '[Auth] Login fail'
export const LOGOUT = 'LOGOUT';
export const CLEAR_ERROR = '[Auth] Clear error'

export class Login implements Action {
  readonly type : string = LOGIN;

  constructor (public payload : {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date
  }) {}
}

export class Logout implements Action {
  readonly type : string = LOGOUT;
}

export class LoginFail implements Action {
  readonly type : string = LOGIN_FAIL;

  constructor(public payload : string){}
}

export class LoginStart implements Action {
  readonly type : string = LOGIN_START;

  constructor (public payload : {
    email: string,
    password: string
  }){}
}

export class SignupStart implements Action {
  readonly type : string = SIGNUP_START;

  constructor(public payload : {
    email : string;
    password : string;
  }) {}
}

export class SignupSuccess implements Action {
  readonly type : string = SIGNUP_SUCCESS;

  constructor(public payload : {
    email : string;
    userId: string;
    token : string;
    expirationDate : Date;
  }){}
}

export class SignupFail implements Action {
  readonly type : string = SIGNUP_FAIL;

  constructor(public payload : string){}
}

export class ClearError implements Action {
  readonly type : string = CLEAR_ERROR;
}


export type AuthListActionTypes = Login
                                  | Logout
                                  | LoginFail
                                  | LoginStart
                                  | SignupStart
                                  | SignupSuccess
                                  | SignupFail
                                  | ClearError
                                  | any;
