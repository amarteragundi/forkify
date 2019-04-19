import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput =() => elements.searchInput.value = '';

export const clearResults =() => elements.searchResultList.innerHTML = '';

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle =[];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur)
            }
            return acc + cur.length;
        },0);

        // return the result
        return `${newTitle.join(' ')} ...`
    }
    return title;
}
const renderRecipe = recipe => {
console.log(recipe);
const markUp = `<li>
    <a class="likes__link" href="#${recipe.recipe_id}">
        <figure class="likes__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
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
