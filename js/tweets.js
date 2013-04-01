// function for reading the JSON file
function readJSON(files){
    var reader = new FileReader();
    reader.onloadend = sortTweets;
    reader.readAsBinaryString(document.getElementById('jsonInput').files[0]);
}

$(document).ready(function() {
    $.getJSON('favs_large.json', function (data) {
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
            "user_id_str": JSONarray[index].user.id_str,
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
        addUserPopup(tweets[i]);
        formatTweet(tweets[i]);
    }
    
    $("#tweets").listview("refresh");
    return tweets;
}

// create the popup window with the user information
function addUserPopup(tweet) {   
    // popup dialog
    var content = 
                "<div id=popup" + tweet.user_id_str + " data-role=dialog data-close-btn=right>" +
                "<div data-role=header><h3></h3></div>" +
                "<div data-role=content id=user-content></div>";
    
    content += 
                "<ul id=popup-list data-role=listview data-inset=true>" + 
                    "<li><b>Screen Name:</b> " + tweet.user_screen_name + "</li>";
    content += "<li><b>Location:</b> " + tweet.location + "</li>";
    content += "<li><b>Description:</b> " + tweet.description + "</li>";
    content += "<li><b>URL:</b><a href=" + tweet.url + ">" + tweet.url + "</a></li>";
    content += "<li><b>Followers Count:</b> " + tweet.followers_count + "</li>";
    content += "<li><b>Friends Count:</b> " + tweet.friends_count + "</li>";
    content += "<li><b>Listed Count:</b> " + tweet.listed_count + "</li>";

    // needs to be reformatted
    content += "<li><b>Create at:</b> " + tweet.user_created_at + "</p>";
    content += "<li><b>Favourites Count:</b> " + tweet.favourites_count + "</li></ul>";

    $("body").append(content);
}

/*
 * Format the text of a tweet. 
 * Mainly, format links, user mentions and hashtags.
 */
function formatTweetText(tweet) {
    //formatLinks(tweet);
    //formatUserMentions(tweet);
    //formatHashTags(tweet);
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
    
    var tweetHTML = "<li class=ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-first-child ui-btn-up-a data-corners=false data-shadow=false data-iconshadow=true data-wrapperels=div data-icon=arrow-r data-iconpos=right data-theme=a>" +
                        "<a class=ui-link-inherit href=#popup" + tweet.user_id_str + " data-rel=dialog data-role=button>" +
                            "<p class=ui-li-aside ui-li-desc>" + tweet.user_screen_name + "</p>" +
                            "<img class=ui-li-thumb src=" + tweet.profile_background_picture + ">" +    
                            "<h3 class=ui-li-heading>" + tweet.user_name + "</h3>" +
                            "<p class=text ui-li-desc>" + tweet.text + "</p>" +
                        "</a>" +
                    "</li>";

    $('#tweets').append(tweetHTML);
}