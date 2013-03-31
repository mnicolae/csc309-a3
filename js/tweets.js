// function for reading the JSON file
function readJSON(files){
    var reader = new FileReader();
    reader.onloadend = sortTweets;
    reader.readAsBinaryString(document.getElementById('jsonInput').files[0]);
}

$(document).ready(function() {
    $.getJSON('favs.json', function (data) {
        sortTweets(data);
    });
});


// Return an array of tweets sorted by the most recent
function sortTweets(evt) {
    // reconstruct the tweets and place them into an array
    var JSONarray = evt;

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
            "profile_background_picture": JSONarray[index].user.profile_background_image_url,

            // tweet info
            "id_str" : JSONarray[index].id_str,
            "created_at" : JSONarray[index].created_at,
            "text" : JSONarray[index].text,
            "source" : JSONarray[index].source,
            "retweet_count" : JSONarray[index].retweet_count,
            "user_mentions": JSONarray[index].entities.user_mentions,
            "urls": JSONarray[index].entities.urls,
            "hash_tags": JSONarray[index].entities.hashtags
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
        //$('#tweets').append('<li>');
        //$('#tweets').append(tweets[i].created_at + '</br>');
        //presentUser(tweets, i);
        formatTweet(tweets[i]);
        //$('#tweets').append('</li>');

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

/*
 * Format the text of a tweet. 
 * Mainly, format links, user mentions and hashtags.
 */
function formatTweetText(tweet) {
    formatLinks(tweet);
    formatUserMentions(tweet);
    formatHashTags(tweet);
}

/*
 * Make link elements clickable.
 * Currently opens the link in a new tab.
 */
function formatLinks(tweet) {
    $.each(tweet.urls, function(index, value) {
        var linkHTML = 
                        "<a class=tweet_link href=" + value.url + ">" +
                            value.display_url + 
                        "</a>";
        tweet.text = tweet.text.replace(value.url, linkHTML);
    });
}

/*
 * Make user mention elements clickable.
 * Currently links to the Twitter page of the respective user.
 */
function formatUserMentions(tweet) {
    $.each(tweet.user_mentions, function(index, value) {
        var user_mentionHTML = 
                        "<a id=" + value.id + " class=user_mention href=http://twitter.com/" + value.screen_name + ">" 
                            + "@" + value.screen_name + 
                        "</a>";
        tweet.text = tweet.text.replace("@" + value.screen_name, user_mentionHTML);
    });
}

/*
 * Make hashtag elements clickable. 
 * Does not link anywhere yet.
 */
function formatHashTags(tweet) {
    $.each(tweet.hash_tags, function(index, value) {
        var hash_tagHTML = 
                        "<a id=" + value.text + " class=hash_tag href='#''>" 
                            + "#" + value.text + 
                        "</a>";
        tweet.text = tweet.text.replace("#" + value.text, hash_tagHTML);
    });
}

/* Given a tweet JSON object, generate a 
 * corresponding HTML tweet object.
 * 
 * Append it to the tweets unordered list. 
 * This functionality might be changed later!
 */
function formatTweet(tweet) {

    formatTweetText(tweet);
    
    var tweetHTML = "<li id=" + tweet.id_str + " class=tweet>" +
                        "<a href='#'>" +
                        "<img class=profile_pic src=" + tweet.profile_background_picture + ">" +
                        "<h3 class=user_name>" + tweet.user_name + 
                            "<a class=user_tag href='#'>" + tweet.user_screen_name + "</a>" +
                        "</h3>" +
                        "<p class=text ui-li aside>" + tweet.text + "</p>" + 
                    "</li>";

    $('#tweets').append(tweetHTML);
}
