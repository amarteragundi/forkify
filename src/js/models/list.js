import uniqid from 'uniqid'

export default class List {
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
    }

    deleteitem(id){
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1)
    }
}