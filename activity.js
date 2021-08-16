class Activity{
    constructor(activityObj){
        this.name = activityObj.name;
        this.description = activityObj.shortDescription;
        this.rating = parseInt(activityObj.rating);
        this.picture = activityObj.pictures[0];
        this.bookingLink = activityObj.bookingLink;
        this.price = `${activityObj.price.currencyCode} ${activityObj.price.amount}`
    };
}

module.exports = Activity;