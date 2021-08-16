class Forcast{
    constructor(dataObj){
        this.date = dataObj.datetime;
        this.description = `Low of ${dataObj.low_temp}, high of ${dataObj.high_temp} with ${dataObj.weather.description}`;
        this.icon = dataObj.weather.icon;
    };
}

module.exports = Forcast;