export function numberWithCommas(x) {
    if(x === null || x === 0 || isNaN(x)){
        return 'No data available';
    }
    if(x === undefined){
        return 0;
    }
    var parts = x.toString().split(",");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    return parts.join(".");
}

export const parseVolume = (volume) => {
    return volume/1000000;
}

export const parseObject = (obj) =>{
    var newObj = obj;
    newObj['volume'] = numberWithCommas(parseInt(parseVolume(obj['volume'])));
    //console.log(newObj)
    return newObj;
}

export const parseVolumes = (volume, precision, pairConversion = null) => {
    if(pairConversion !== null){
        return numberWithCommas(parseFloat((volume/precision) * parseFloat(pairConversion)).toFixed(2));
    }
    else{
        return numberWithCommas(parseFloat(volume/precision).toFixed(2));
    }
}
    