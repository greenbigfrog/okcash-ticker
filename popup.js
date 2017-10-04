const displayData = data => {
    //Create labels for the graph depending upon number of items
    const numberOfItems = data.length;
    const labelsArray = Array.from(Array(numberOfItems).keys()).map(el => el + 1);

    //Plot graphdata
    const graphData = {
        labels: labelsArray,
        series: [data]
    };

    //Draw the graph
    new Chartist.Line('.ct-chart', graphData);
}

//Get the market history from chrome storage

const getMarketHistory = () => {
    chrome.storage.local.get(['prices'], data => {
        const itemsArray = data.prices;
        displayData(itemsArray);
    });
};

//Intializes the extension

const startExtension = () => {
    getMarketHistory();
    setInterval(getMarketHistory, 2000);
};

document.addEventListener('DOMContentLoaded', startExtension);
