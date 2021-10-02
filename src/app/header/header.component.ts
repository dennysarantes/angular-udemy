import { User } from './../auth/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromAppGlobal from '../store/app.reducer'
import * as fromAuthActions from '../auth/store/auth.action'
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  userName: any;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store : Store<fromAppGlobal.AppState>
  ) {}

  ngOnInit() {
    console.log('iniciando header!!')
    //this.userSub = this.authService.user.subscribe(user => {
      this.userSub =  this.store.select('auth')
      .subscribe((authDados) => {
        console.log('Verificando se usuário está autenticado no header: ' + !!authDados.user)
        this.isAuthenticated = !!authDados.user;
        this.userName = authDados.user
        console.log(!authDados.user);
        console.log(!!authDados.user);
        //this.userName = authDados.user.email;
      });

  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    //this.authService.logout();
    this.store.dispatch(new fromAuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
