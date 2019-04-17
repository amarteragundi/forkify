import { elements } from './base';

export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
console.log(recipe);
const markUp = `<li>
    <a class="likes__link" href="#${recipe.recipe_id}">
        <figure class="likes__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${recipe.title}</h4>
            <p class="likes__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`

elements.searchResultList.insertAdjacentHTML('beforeend', markUp);
}

export const renderResults = recipes => {
	console.log(recipes);
	recipes.forEach(renderRecipe)
}
