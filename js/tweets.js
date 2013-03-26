// function for reading the JSON file
function readJSON(files){
    var reader = new FileReader();
    reader.onloadend = sortTweets;
    reader.readAsBinaryString(document.getElementById('jsonInput').files[0]);
}

// Return an array of tweets sorted by the most recent
function sortTweets(evt) {
    // reconstruct the tweets and place them into an array
    var fileContent = evt.target.result;
    var JSONarray = jQuery.parseJSON(fileContent);

    var tweets = [];
    jQuery.each(JSONarray, function(index, value) {
        tweets.push({

            // user info
            "user_name": JSONarray[index].user.name,
            "user_screen_name": "@" + JSONarray[index].user.screen_name,
            "location": JSONarray[index].user.location,
            "description": JSONarray[index].user.description,
            "url": JSONarray[index].user.url,
            "followers_count": JSONarray[index].user.followers_count,
            "friends_count": JSONarray[index].user.friends_count,
            "listed_count": JSONarray[index].user.listed_count,
            "user_created_at": JSONarray[index].user.created_at,
            "favourites_count": JSONarray[index].user.favourites_count,
            "profile_picture": JSONarray[index].user.profile_image_url,

            // tweet info
            "id_str" : JSONarray[index].id_str,
            "created_at" : JSONarray[index].created_at,
            "text" : JSONarray[index].text,
            "source" : JSONarray[index].source,
            "retweet_count" : JSONarray[index].retweet_count
            //"urls": JSONarray[index].entities.urls,
            //"user_mentions": JSONarray[index].entities.user_mentions
            });
    });
    
    // sort the array of tweets
    tweets.sort(function(a, b) {
        a = new Date(a.created_at);
        b = new Date(b.created_at);
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });

    for (var i = 0; i < tweets.length; i++) {
        $('#tweets').append('<li>');
        //$('#tweets').append(tweets[i].created_at + '</br>');
        presentUser(tweets, i);
        //formatTweet(tweets[i]);
        $('#tweets').append('</li>');

    }
    
    $("#tweets").listview("refresh");
    return tweets;
}

// create the popup window with the user information
function presentUser(tweets, index) {
    
    // user name 
    var user = '<h3><a href="#popup' + index + '" data-rel="dialog" data-role="button">' +
    tweets[index].user_name + '</a></h3>';

    // popup dialog
    var content = '<div id="popup' + index +'"data-role="dialog"  data-close-btn="right">' +
'<div data-role="header"><h3></h3></div>' +
'<div  data-role="content" id = "user-content"></div>'; 
    content += '<ul id="popup-list" data-role="listview"' +
    'data-inset="true"><li><b>Screen Name:</b> ' +
    tweets[index].user_screen_name + '</li>';
    content += '<li><b>Location:</b> ' + tweets[index].location + '</li>';
    content += '<li><b>Tweet:</b> ' + tweets[index].description + '</li>';
    content += '<li><b>URL:</b><a href= "' + tweets[index].url + '">' + tweets[index].url + '</a></li>';
    content += '<li><b>Followers Count:</b> ' + tweets[index].followers_count + '</li>';
    content += '<li><b>Friends Count:</b> ' + tweets[index].friends_count + '</li>';
    content += '<li><b>Listed Count:</b> ' + tweets[index].listed_count + '</li>';

    // needs to be reformatted
    content += '<li><b>Create at:</b> ' + tweets[index].user_created_at + '</p>';
    content += '<li><b>Favourites Count:</b> ' + tweets[index].favourites_count + '</li></ul>';

    $('#tweets').append(user);
    $('body').append(content);
}

/* Given a tweet JSON object, generate a 
 * corresponding HTML tweet object.
 * 
 * Append it to the tweets unordered list. 
 * This functionality might be changed later!
 */
function formatTweet(tweet) {

    //formatTweetText(tweet);
    
    var tweetHTML = "<li id=" + tweet.id_str + " class=tweet>" +
                        "<a href='#'>" +
                        "<img class=profile_pic src=" + tweet.profile_picture + ">" +
                        "<h3 class=user_name>" + tweet.user_name + 
                            "<a class=user_tag href='#'>" + tweet.user_screen_name + "</a>" +
                        "</h3>" +
                        "<p class=text>" + tweet.text + "</p>" + 
                    "</li>";

    $('#tweets').append(tweetHTML);
}

function formatTweetText(tweet) {
    formatUserMentions(tweet);
}

function formatUserMentions(tweet) {
    $.each(tweet.user_mentions, function(index, value)) {
        var html = "<a href=http://twitter.com/" + value.screen_name;
        tweet.text = [tweet.text(0, value.indices[0]), html, tweet.text(value.indices[1], -1)].join("");
    });
}