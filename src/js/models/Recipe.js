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
			alert(error)
		}
    }
}