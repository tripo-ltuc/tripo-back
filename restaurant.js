class Resturant{
    constructor(resturantObj){
        this.rating = resturantObj.rating;
        this.phone = resturantObj.phone;
        this.name = resturantObj.name;
        this.reviewCount = resturantObj.review_count;
        this.url = resturantObj.url;
        this.imageUrl = resturantObj.image_url;
        this.location = `${resturantObj.location.address1}, ${resturantObj.location.city}, ${resturantObj.location.state}, ${resturantObj.location.country}`;
        this.servecess = resturantObj.transactions.length ? resturantObj.transactions.join('-') : 'N/A';
    };
}

module.exports = Resturant;