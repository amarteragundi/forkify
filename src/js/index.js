// Author : Amar Teragundi

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearloader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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

	if(query){
		// 2. New search object and add it to state
		
		state.search = new Search(query);

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

	if(id){
		// prepare UI for changes
		renderLoader(elements.recipe);
		recipeView.clearRecipe();

		// highlight selected recipe
		if (state.search) searchView.highlightSelected(id)

		// create new Recipe object
		state.recipe = new Recipe(id);

		try{
			// get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients()

			// calc time and calc servings
			state.recipe.calcTime();
			state.recipe.calcServings();

			// render recipe
			clearloader();
			recipeView.renderRecipe(
				state.recipe,
				state.likes.isLiked(id))
		} catch{
			alert('Somthing went wrong :(');
		}
		
	}
}

// * controller to fetch and display ingredients in shopping list

const controlList = () => {
	// create a new list if there is none yet
	if(!state.list) state.list =  new List();

	// add ingredients to list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(parseFloat(el.count), el.unit, el.ingredient);
		// render item to shopping list
		listView.renderItem(item);
	})
}


// * controller to fetch and display liked recipes
const controlLike = () => {
	if(!state.likes) state.likes = new Likes();
	
	const currentID = state.recipe.id;
	if(!state.likes.isLiked(currentID)){
		// add like to state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		)
		// toggle the like button	
		likesView.toggleLikeBtn(true);

		//  add like to UI list
		likesView.renderLike(newLike)
	} else {
		// remove like to state
		state.likes.deleteLike(currentID)
		// toggle the like button
		likesView.toggleLikeBtn(false);

		//  remove like to UI list

	}

	likesView.toggleLikeMenu(state.likes.getNumLikes())
};

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

// restore liked recipes on page load
window.addEventListener('load', () => {
	state.likes = new Likes();
	state.likes.readStorage();

	// toggle like buttons
	likesView.toggleLikeMenu(state.likes.getNumLikes())

	//  render existing likes
	state.likes.likes.forEach(like => likesView.renderLike(like))
})


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
	} else if(e.target.matches('.recipe__love, .recipe__love *')){
		controlLike();
	}
})
