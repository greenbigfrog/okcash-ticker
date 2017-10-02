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
        var json = JSON.parse(response);
        var result = json['result'];
        // Save it to DB
        // Check if price changed
        current = result['Last'];
        chrome.browserAction.setBadgeText({text: String(current * 100000000)});
            // If UP green, if DOWN red
            if (current > last) {
                chrome.browserAction.setBadgeBackgroundColor({color: '#00cc00'});
            } else if (last > current) {
                chrome.browserAction.setBadgeBackgroundColor({color: '#cc0000'});
            }

        last = current;
    });
}, 1000);
