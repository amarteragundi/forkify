import axios from 'axios';
import {apiConfig} from './Config';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${apiConfig.food2fork}&rId=${this.id}`);
            // /this.result = res.data.recipes;
			console.log(res)
		} catch(error){
			alert(error)
		}
    }
}