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
        const unitsShort = ['tbsp', 'tbsp' , 'oz', 'oz', 'tsp', 'tsps', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

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
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

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
                    count : parseInt(arrIng[0], 10),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                // no unit no number
                objIng = {
                    count : 1,
                    unit : '',
                    ingredient
                }
            }


            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        })
        
        this.servings = newServings;
    }
}