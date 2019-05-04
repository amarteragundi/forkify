export default Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {
            id,
            title,
            author,
            img
        }

        this.likes.push(like);
    }

    deleteLike(id){
        const index = this.items.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }
}