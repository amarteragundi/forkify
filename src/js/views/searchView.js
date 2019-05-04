import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput =() => elements.searchInput.value = '';

export const clearResults =() => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.likes__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active')
}

export const limitRecipeTitle = (title, limit = 17) => {
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

// type : prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1){
        // only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages){
        // both buttons to be displayed
        button = `
        ${createButton(page, 'next')}
        ${createButton(page, 'prev')}
        `;
    } else if (page === pages && pages > 1){
        // only button to go to previous page
        button = createButton(page, 'prev')
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    
    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
}
