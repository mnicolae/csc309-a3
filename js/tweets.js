// function for reading the JSON file
function readJSON(files){
    var reader = new FileReader();
    reader.onloadend = sortTweets;
    reader.readAsBinaryString(document.getElementById('jsonInput').files[0]);
}

// Return an array of tweets sorted by the most recent
function sortTweets(evt) {
    // reconstruct the tweets and place tem into an array
    var fileContent = evt.target.result;
    var JSONarray = jQuery.parseJSON(fileContent);

    var tweets = [];
    jQuery.each(JSONarray, function(index, value){
        tweets.push({
            "created_at" : JSONarray[index].created_at,
            "text" : JSONarray[index].text,
            "source" : JSONarray[index].source,
            "retweet_count" : JSONarray[index].retweet_count,
            //favorites count ?
            });
    });
    
    // sort the array of tweets
    tweets.sort(function(a, b){
        a = new Date(a.created_at);
        b = new Date(b.created_at);
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });

    // for testing purposes only. remove later
    for (var i=0; i < tweets.length; i++){ 
        document.write(tweets[i].created_at + '</br>');
    }

    return tweets;
}