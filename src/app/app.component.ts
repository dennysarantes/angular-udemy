import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import * as AppStore from './store/app.reducer'
import * as fromAuthActions from '../app/auth/store/auth.action'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    //private authService: AuthService
    private store : Store<AppStore.AppState>
    ) {}

  ngOnInit() {
    //this.authService.autoLogin();
    //this.store.dispatch(new fromAuthActions.AutoLogin());
  }
}
