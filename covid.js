class Covid{
    constructor(covidData){
        this.country = covidData.country;
        this.code = covidData.code;
        this.confirmed = covidData.confirmed;
        this.recovered = covidData.recovered;
        this.critical = covidData.critical;
        this.deaths = covidData.deaths;
        this.lastUpdate = covidData.lastUpdate.split('T')[0];
    };
}

module.exports = Covid;