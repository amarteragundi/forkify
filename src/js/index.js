// Author : Amar Teragundi

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearloader } from './views/base';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

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
		renderLoader(elements.recipe)
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

// event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));