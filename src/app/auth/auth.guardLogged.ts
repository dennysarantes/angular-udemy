import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromAppGlobal from '../store/app.reducer'
import * as fromAuthActions from '../auth/store/auth.action'

@Injectable({ providedIn: 'root' })
export class AuthGuardLogged implements CanActivate {

  constructor(
              private router: Router,
              private store : Store<fromAppGlobal.AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ) {
     // return this.authService.user.pipe(
      const userData: {
        email: string;
        userId: string;
        _token : string;
        expirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      // userData.expirationDate = exp;

      console.log('tem userData: ' + !!userData)
      if(!!userData){
        const exp = new Date(new Date().getTime() + +userData.expirationDate * 1000)
        this.store.dispatch(new fromAuthActions.Login({
          email: userData.email,
          userId: userData.userId,
          token: userData._token,
          expirationDate: exp }));
          //Nesse caso, o próprio effect de Login faz o navigate para a rota correta.

      }else{
        return true;
      }

  }
}
