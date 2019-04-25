import axios from 'axios';
import {apiConfig} from './Config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${apiConfig.food2fork}&rId=${this.id}`);
            console.log(res)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
		} catch(error){
			alert(error);
		}
    }

    calcTime(){
        // assuming that we need 15 mins for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoon', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp' , 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']

        const newIngredients = this.ingredients.map(el => {
            // 1. uniform units
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //  Remove ()
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count
            const arrIng =  ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng; 

            if(unitIndex > -1){
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1) {
                    count = arrIng[0].replace('-','+');
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if(parseInt(arrIng[0], 10)){
                // no unit but there is a number
                objIng = {
                    count : 1,
                    unit : '',
                    ingredient
                }
            }else if(unitIndex === -1){
                // no unit no number
                objIng = {
                    count : parseInt(arrIng[0], 10),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                }
            }


            return objIng;
        });

        this.ingredients = newIngredients;
    }
}

// 0: "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"
// 1: "1 3/4 (.44 ounce) teaspoons salt"
// 2: "1 teaspoon (.11 ounce) instant yeast"
// 3: "1/4 cup (2 ounces) olive oil (optional)"
// 4: "1 3/4 cups (14 ounces) water, ice cold (40F)"
// 5: "Semolina flour OR cornmeal for dusting"