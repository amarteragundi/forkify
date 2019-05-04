import axios from 'axios';
import {apiConfig} from './Config'
export default class Search {
		constructor(query){
			this.query = query;
		}

	async getResults(){
		try{
			const res = await axios(`https://www.food2fork.com/api/search?key=${apiConfig.food2fork}&q=${this.query}`);
			this.result = res.data.recipes;
		} catch(error){
			alert(error)
		}
	}

}