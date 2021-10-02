import { map } from 'rxjs/operators';
import { AppState } from './../store/app.reducer';
import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromAppState from '../store/app.reducer'
import * as fromAuthActionsTypes from './store/auth.action'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub : Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store : Store<fromAppState.AppState>
  ) {}

  ngOnInit(): void {

     this.storeSub = this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;

        if(this.error){
          this.showErrorAlert(this.error);
        }

      })

  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      //authObs = this.authService.login(email, password);
      this.store.dispatch(new fromAuthActionsTypes.LoginStart({email: email  , password: password}));
    } else {
      //authObs = this.authService.signup(email, password);
      this.store.dispatch(new fromAuthActionsTypes.SignupStart({
        email : email,
        password: password
      }))
    }



/*     authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    ); */

    form.reset();
  }


  onHandleError() {
    //this.error = null;
    this.store.dispatch(new fromAuthActionsTypes.ClearError());
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if(this.storeSub) this.storeSub.unsubscribe();
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}