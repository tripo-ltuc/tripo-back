'use strict';

class Hotel{
    constructor(hotelObj){
        this.id = hotelObj.id;
        this.modalImgUrl = 'N/A';
        this.cardImgUrl = 'N/A';
        this.name = hotelObj.name;
        this.starRating = hotelObj.starRating;
        this.address = hotelObj.address.streetAddress;
        this.guestReviews = `${hotelObj.guestReviews.total} Reviews, ${hotelObj.guestReviews.badgeText}, ${hotelObj.guestReviews.rating}`;
        this.price = hotelObj.ratePlan.price ? `${hotelObj.ratePlan.price.current} per Night` : 'N/A';
        this.roomsLeft = hotelObj.roomsLeft || 0;
    };

    // getCardImgUrl = async hotelId => {
    //     let newHotelId ='';
    //     newHotelId += hotelId > 999999999 ? this.getRandomHotelId(0, 999999999) : hotelId;
    //     console.log('typeof', typeof newHotelId, 'newHoterlID = ' , newHotelId);
    //     console.log('typeof', typeof hotelId, 'hotelId = ' , hotelId);
    //     const options = {
    //         method: 'GET',
    //         url: process.env.HOTELS_PHOTOS,
    //         params: {hotel_id: newHotelId},
    //         headers: {
    //             'x-rapidapi-key': process.env.HOTELS_KEY,
    //             'x-rapidapi-host': process.env.HOTELS_HOST
    //         }
    //       };
          
    //     const resData = await axios.request(options);
    //     const data = resData.data;

    //     this.modalImgUrl = data[0].mainUrl.concat('?impolicy=fcrop&w=750&h=450&q=high');
    //     return data[0].mainUrl.replace('_z', '_d');
    // };

    // getRandomHotelId = (min, max) => {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min + 1) + min); 
    // };
}

module.exports = Hotel;