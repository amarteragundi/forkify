import axios from 'axios';
export default class Search {
		constructor(query){
			this.query = query;
		}

	async getResults(){
		const key = "77d6469266d614a3f0b728ef261a11ed"
		try{
			const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
			this.result = res.data.recipes;
			// console.log(this.result)
		} catch(error){
			alert(error)
		}
	}

}