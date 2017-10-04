let storedData;
let i = 0;
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}


var client = new HttpClient();


var current, last;
client.get('https://bittrex.com/api/v1.1/public/getticker?market=btc-ok', function(response){
    var json = JSON.parse(response);
    last = json['result']['Last'];
    chrome.browserAction.setBadgeText({text: String(last * 100000000)});
});


// Main Function
setInterval(function(){
    // Get price
    client.get('https://bittrex.com/api/v1.1/public/getticker?market=btc-ok', function(response){
        // Parse JSON
        const json = JSON.parse(response);
        const result = json['result'];
        // Save it to DB
        // Check if price changed
        current = result['Last'] * Math.pow(10,8);

        chrome.browserAction.setBadgeText({text: String(current)});
            // If UP green, if DOWN red
            if (current > last) {
                chrome.browserAction.setBadgeBackgroundColor({color: '#00cc00'});
            } else if (last > current) {
                chrome.browserAction.setBadgeBackgroundColor({color: '#cc0000'});
            }

        //Store recent 20 prices

        chrome.storage.local.get(['prices'],(data)=>{

            //Copy prices Array

            let pricesArray = [].concat(data.prices);


            //Check if pricesArray exists or not
            if(!pricesArray) {
                return null;
            }

            //Only store upto 20 values
            if(pricesArray.length >= 20) {
                pricesArray = pricesArray.slice(1,20);
            }

            pricesArray.push(current);

            chrome.storage.local.set({prices: pricesArray}, ()=> {
                console.log('Sucessfully saved pricesArray!');
            })
        });



        last = current;
    });
}, 1000);
