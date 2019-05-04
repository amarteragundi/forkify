// Author : Amar Teragundi

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearloader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.s = state;
// * controller for search
const controlSearch = async () => {
	// 1. get query from view
	const query = searchView.getInput();
	console.log(query);

	if(query){
		// 2. New search object and add it to state
		
		state.search = new Search(query);
		console.log(state.search);

		// 3. prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		try{
			// 4. search for recipes
			await state.search.getResults();	
			clearloader();
			// 5. render results to UI
			searchView.renderResults(state.search.result);
		} catch{
			alert('something went wrong :(');
		}
	}
}

document.querySelector('.search').addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// * controller to fetch and display single recipe

const controlRecipe = async () => {
	//  get id from url
	const id = window.location.hash.replace('#', '');
	console.log(id);

	if(id){
		// prepare UI for changes
		renderLoader(elements.recipe);
		recipeView.clearRecipe();

		// highlight selected recipe
		if (state.search) searchView.highlightSelected(id)

		// create new Recipe object
		state.recipe = new Recipe(id);
		window.r = state.recipe;

		try{
			// get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients()
			console.log(state.recipe)

			// calc time and calc servings
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			clearloader();
			recipeView.renderRecipe(state.recipe)
		} catch{
			alert('Somthing went wrong :(');
		}
		
	}
}

// * controller to fetch and display ingredients in shopping list

const controlList = () => {
	// create a new list if there is none yet
	debugger;
	if(!state.list) state.list =  new List();

	// add ingredients to list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(parseFloat(el.count), el.unit, el.ingredient);
		// render item to shopping list
		listView.renderItem(item);
	})
}

// handle delete and update shopping list items
elements.shoppingList.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	// delete ingredient
	if(e.target.matches('.shopping__delete, .shopping__delete *')) {
		// delete from state
		state.list.deleteitem(id);

		// delete from UI
		listView.deleteItem(id);
	} else if(e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value);

		state.list.updateCount(id, val);
	}
});

// event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// handling recipe buttons events
elements.recipe.addEventListener('click', e => {
	if(e.target.matches('.btn-decrease, .btn-decrease *')){
		// decreas was clicked
		if(state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe)
		}
		
	} else if(e.target.matches('.btn-increase, .btn-increase *')){
		// increas was clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe)
	} else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
		controlList();
	}

	console.log(state.recipe)
})
