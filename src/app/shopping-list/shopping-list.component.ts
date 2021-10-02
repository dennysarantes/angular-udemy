import { Ingredient } from './../shared/ingredient.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import * as fromShoppingListActions from './store/shopping-list.actions'
import * as fromAppGlobal from '../store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients : Ingredient[]}>;
  //private subscription: Subscription;

  constructor(
    //A injeção do Store tem a seguinte sintaxe:
    //Store<{NOME_COLOCADO_NO_APP_MODULE : {atributo do objeto}
    private store : Store<fromAppGlobal.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingListCriadoPorMim');
    /* this.ingredients = this.slService.getIngredients();
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      ); */
  }

  onEditItem(index: number) {
    //this.slService.startedEditing.next(index);
    this.store.dispatch(new fromShoppingListActions.StartEdit({index}));
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
