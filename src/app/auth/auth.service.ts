import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAuthActions from './store/auth.action'
import * as fromAppGlobal from '../store/app.reducer'


export interface AuthResponseData {
  kind : string;
  idToken : string;
  email : string;
  refreshToken : string;
  expiresIn : string;
  localId : string;
  registered? : boolean
}

@Injectable({ providedIn: 'root' })
export class AuthService {


  private tokenExpirationTimer: any;

  constructor(private store : Store<fromAppGlobal.AppState>) {}



  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new fromAuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}

