import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap, map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import * as fromAppGlobal from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store : Store<fromAppGlobal.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth')
      .pipe(
      take(1),
      exhaustMap(authState => {
        if (!authState.user) {
          return next.handle(req);
        }
        var userData = JSON.parse(localStorage.getItem('userData'))
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', authState.user._token) //set('auth', userData._token) //authState.user.getToken()) //Não está pegando o Token, não sei pq
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
