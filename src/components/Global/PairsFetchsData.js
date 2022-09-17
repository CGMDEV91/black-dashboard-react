import {numberWithCommas} from "../Global/Helpers";

const parseVolume = (volume) => {
    return volume/1000000;
}

const getYesterdayDay = () =>{
    let newDate = new Date();
    newDate.setDate(newDate.getDate() -1);
    
    return new Date(new Date(newDate).toString().split('GMT')[0]+' UTC').toISOString();
}

export const getPairInformation = async (pair) => {
    const precision = '1D';
    var startDate = getYesterdayDay().substring(0,10) + 'T00:00:00.000Z';
    const endDate = getYesterdayDay().substring(0,10) + 'T23:59:59.999Z';
    
    let url = 'https://api.kujira.app/api/trades/candles?contract=' + pair + '&precision=' + precision + '&from=' + startDate + '&to=' + endDate;
    //console.log(url);

    return await fetch(url, {
        method: 'GET',         
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': "*"
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            var newVolume = parseVolume(responseData.candles[0].volume);
            //console.log(parseInt(newVolume));
            return responseData.candles[0];
        })
        .catch(error => console.log(error));
}