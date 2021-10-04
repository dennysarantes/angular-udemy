import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';

import { RecipeService } from '../recipe.service';
import { Recipe } from './../recipe.model';
import * as fromApp from '../../store/app.reducer'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private store : Store<fromApp.AppState> ) {
  }

  ngOnInit() {
    //this.subscription = this.recipeService.recipesChanged
    this.subscription = this.store.select('recipe')
    .pipe(
      map(dataRecipeState => dataRecipeState.recipes))
      .subscribe((recipes : Recipe[]) => {
        this.recipes = recipes;
      })


    //this.recipes = this.recipeService.getRecipes();

   /*  this.store.select('recipe').subscribe(dataStore => {
      this.recipes = dataStore.recipes;
    }) */


  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
