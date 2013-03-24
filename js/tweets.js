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

            // user info
            "user_name": JSONarray[index].user.name,
            "user_screen_name": JSONarray[index].user.screen_name,
            "location": JSONarray[index].user.location,
            "description": JSONarray[index].user.description,
            "url": JSONarray[index].user.url,
            "followers_count": JSONarray[index].user.followers_count,
            "friends_count": JSONarray[index].user.friends_count,
            "listed_count": JSONarray[index].user.listed_count,
            "user_created_at": JSONarray[index].user.created_at,
            "favourites_count": JSONarray[index].user.favourites_count,

            "created_at" : JSONarray[index].created_at,
            "text" : JSONarray[index].text,
            "source" : JSONarray[index].source,
            "retweet_count" : JSONarray[index].retweet_count
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

    for (var i=0; i < tweets.length; i++){
        //$('#tweets').append('<li>');
        //$('#tweets').append(tweets[i].created_at + '</br>');
        presentUser(tweets, i);
        //$('#tweets').append('</li>');

    }

    return tweets;
}

function presentUser(tweets, index) {
    var user = '<a href="#popup" data-rel="dialog" data-role="button">' +
    tweets[index].user_name + '</a>';
    var content = '<p><b>Screen Name:</b> ' + tweets[index].user_screen_name + '</p>';
    content += '<p><b>Location:</b> ' + tweets[index].location + '</p>';
    content += '<p><b>Tweet:</b> ' + tweets[index].description + '</p>';
    content += '<p><b>URL:</b> ' + tweets[index].url + '</p>';
    content += '<p><b>Followers Count:</b> ' + tweets[index].followers_count + '</p>';
    content += '<p><b>Friends Count:</b> ' + tweets[index].friends_count + '</p>';
    content += '<p><b>Listed Count:</b> ' + tweets[index].listed_count + '</p>';
    content += '<p><b>Create at:</b> ' + tweets[index].user_created_at + '</p>';
    content += '<p><b>Favourites Count:</b> ' + tweets[index].favourites_count + '</p>';

    $('#tweets').append(user + '</br>');
    $('#user-content').html(content);
}