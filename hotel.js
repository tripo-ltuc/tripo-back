'use strict';

class Hotel {
  constructor(hotelObj) {
    this.id = hotelObj.id;
    this.modalImgUrl = 'N/A';
    this.cardImgUrl = 'N/A';
    this.name = hotelObj.name;
    this.starRating = hotelObj.starRating;
    this.address = hotelObj.address.streetAddress;
    this.guestReviews = hotelObj.guestReviews
      ? `${hotelObj.guestReviews.total} Reviews, ${hotelObj.guestReviews.badgeText}, ${hotelObj.guestReviews.rating}`
      : 'N/A';
    this.price = hotelObj.ratePlan.price
      ? `${hotelObj.ratePlan.price.current} per Night`
      : 'N/A';
    this.roomsLeft = hotelObj.roomsLeft || 0;
  }
}

module.exports = Hotel;
