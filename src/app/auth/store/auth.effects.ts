import { AuthService } from './../auth.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import * as fromAuthActionsTypes from "./auth.action";
import { User } from "./../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService : AuthService
  ) {}

  private handleAuthentication = (
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

    const user = new User(email, userId, token, expirationDate);
    this.authService.setLogoutTimer( +expiresIn * 1000);

    //this.authService.setLogoutTimer(10000);

    localStorage.setItem("userData", JSON.stringify(user));

    return new fromAuthActionsTypes.Login({
      email: user.email,
      userId: user.id,
      token: token,
      expirationDate: expirationDate,
    });
  };

  private handleError = (errorRes) => {
    let errorMessage = "An unknown error occurred!";
    if (!errorRes.error || !errorRes.error.error) {
      return of(new fromAuthActionsTypes.LoginFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exist.";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is not correct.";
        break;
    }
    return of(new fromAuthActionsTypes.LoginFail(errorMessage));
  };

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(fromAuthActionsTypes.LOGIN_START),
    switchMap((authData: fromAuthActionsTypes.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3X11kOls_nWA0cbrURwbVaWIc75ssSzc",
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((responseGetData) => {
            return this.handleAuthentication(
              responseGetData.email,
              responseGetData.localId,
              responseGetData.idToken,
              +responseGetData.expiresIn
            );
          }),
          catchError((errorRes) => {
            return this.handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(fromAuthActionsTypes.SIGNUP_START),
    switchMap((signupData: fromAuthActionsTypes.SignupStart) => {
      return this.http
        .post<any>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3X11kOls_nWA0cbrURwbVaWIc75ssSzc",
          {
            email: signupData.payload.email,
            password: signupData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            return this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorRes) => {
            return of(this.handleError(errorRes));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(fromAuthActionsTypes.LOGIN),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(fromAuthActionsTypes.LOGOUT),
    tap(() => {
      localStorage.removeItem("userData");
      this.authService.clearLogoutTimer();
      this.router.navigate(["/auth"]);
    })
  );

  @Effect({ dispatch: false })
  authSignupSuccess = this.actions$.pipe(
    ofType(fromAuthActionsTypes.SIGNUP_SUCCESS),
    tap(() => {
      this.router.navigate(["/auth"]);
    })
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(
      ofType(fromAuthActionsTypes.AUTO_LOGIN),
      tap(() => {
          const userData: {
            email: string;
            id: string;
            token: string;
            tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData'));

          if (!userData) {
            return { type : 'Qualquer coisa...'} ;
          }else{
            this.authService.setLogoutTimer( +userData.tokenExpirationDate * 1000);
            return new fromAuthActionsTypes.Login({
              email: userData.email,
              userId: userData.id,
              token: userData.token,
              expirationDate: new Date(new Date().getTime() + +userData.tokenExpirationDate * 1000)
            });
          }

         // return { type : 'Qualquer coisa...'}

          /*
          const expirationDuration =
              new Date(userData._tokenExpirationDate).getTime() -
              new Date().getTime();
            this.autoLogout(expirationDuration);

            console.log('Expiration duration = ' +  expirationDuration); */
          }

      )
    )


}
