

const fetchMarketHistory = ()=>{
    /*
        corsProxy is required
    */

    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    const apiURL = 'https://bittrex.com/api/v1.1/public/getmarkethistory?market=BTC-OK'

    fetch(corsProxy+apiURL)
    .then(response=>response.json())
    .then(data=>{
        const responseArray = data.result;
        const resultsArray = responseArray.slice(0,10);

        extractPrices(resultsArray);
    })
    .catch(err=>console.log(err))
};

const extractPrices = results=> {
    const pricesArray = results.map(transcation=>transcation.Price)
                        .map(value=>{
                            const numStr = value.toString();
                            return numStr;
                        })
                        .map(numStr=>numStr.padEnd(9,'0').slice(-4))
                        .map(numStr=>{
                            let num = parseFloat(numStr);
                            num = (num/1000 <= 1) ? num*10 : num;
                            num = num * 0.01;
                            return num.toFixed(2);
                        });
    displayData(pricesArray);
};

const displayData = data=>{
    var graphData = {
        labels: ['1','2','3','4','5','6','7','8','9','10'],
        series: [
            data
        ]
    };
    new Chartist.Line('.ct-chart', graphData);
}
document.addEventListener('DOMContentLoaded', fetchMarketHistory);
