import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import * as fromAppGlobal from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private store : Store<fromAppGlobal.AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ) {
     // return this.authService.user.pipe(
      return this.store.select('auth')
      .pipe(
      take(1),
      map(authState => {
       return authState.user;
      }),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          console.log('usuário já logou!')
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })

      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    );
  }
}
