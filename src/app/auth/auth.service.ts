import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { User } from './user.model';
import * as fromAuthActions from './store/auth.action'
import * as fromAppGlobal from '../store/app.reducer'
import { Store } from '@ngrx/store';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  //user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private store : Store<fromAppGlobal.AppState>) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3X11kOls_nWA0cbrURwbVaWIc75ssSzc'
        ,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.store.dispatch(new fromAuthActions.Login({
            email : resData.email,
            userId: resData.localId,
            token : resData.idToken,
            expirationDate : new Date(new Date().getTime() + +resData.expiresIn * 1000)
          })
          )

          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    console.log('fazendo login...')
    console.log('usuario: ' + email);
    console.log('senha: ' + password);

    const body = {
      email: email,
      password: password,
      returnSecureToken: true}

    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3X11kOls_nWA0cbrURwbVaWIc75ssSzc', body)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          console.log('passou')
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    console.log('Token no userData: ' + userData._token)

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );



    if (userData._token) {
      console.log('Token reconhecido!')
      this.store.dispatch(new fromAuthActions.Login({
        email: loadedUser.email,
        userId: loadedUser.id,
        token:  userData._token,
        expirationDate:  new Date(userData._tokenExpirationDate)
        }));

      //this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);

      console.log('Expiration duration = ' +  expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new fromAuthActions.Logout());
    //this.user.next(null);
    //this.router.navigate(['/auth']);
   // let userTest : User;
   // userTest = JSON.parse(localStorage.getItem('userData').slice());
    //console.log(userTest.email);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log('fazendo autoLogout')
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }


  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {

    console.log('Token recebido imediatamente após login: ' + token)
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    console.log('Verificando o token na criação do objeto user: ' + user.token);
    this.store.dispatch(new fromAuthActions.Login({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
     }));

    //this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorRes);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorRes);
  }
}

