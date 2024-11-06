const common = require("./commonFunctions");
const prompt = require("prompt-sync")();

async function getUserID(username) {
   const userID = await common.getData('SELECT user_id FROM social_media.users WHERE user_name = ' + '"' + username + '"', [], true);
    console.log(userID)
    return userID
}

async function listUsers(userPrompt) {
    option = "next"
    var userOffset = 0;

    do {
        const userinfo = await common.getData('SELECT * FROM social_media.users ORDER BY user_name LIMIT 5 OFFSET ' + userOffset, [], true);

        for(let i = 0; i<userinfo.length;i++) {
            console.log(userinfo[i].user_name);
        }
        userOffset = userOffset + 5;
        
        option = prompt(userPrompt + " Enter next to view the next 5 users in the list: ");
    }

    while(option == "next")
    return option
}

async function listTweets(tweetPrompt, id) {
    option = "next"
    var tweetOffset = 0;

    do {
        const userinfo = await common.getData('SELECT * FROM social_media.user_tweets WHERE user_id = ' + '"' + id + '" LIMIT 5 OFFSET ' + tweetOffset, [], true);
       
        for(let i = 0; i<userinfo.length;i++) {
            console.log("ID " + userinfo[i].tweet_id);
            console.log("Text " + userinfo[i].tweet_text);
            console.log("Date Posted " + userinfo[i].date_posted);
            console.log("\n");
        }

        tweetOffset = tweetOffset + 5;
        
        option = prompt(tweetPrompt + " Enter next to view the next 5 tweets in the list: ");
    }
    while(option == "next")

    return parseInt(option);
}

async function deleteTweet() {
    const username = await listUsers("Enter the username of the user whose tweet you would like to delete.");
    const userinfo = await getUserID(username);

    const numberOfTweets = await common.getData('SELECT COUNT(user_id) AS num_tweets FROM social_media.user_tweets WHERE user_id = ' + '"' + userinfo[0].user_id + '"', [], true);

    if (numberOfTweets != undefined) {
        
        const getUserID = await common.getData('SELECT user_id, user_name FROM social_media.users WHERE user_name = ' + '"' + option + '"', [], true);
   
        const userinfo = await common.getData('SELECT * FROM social_media.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '"', [], true);
        if (userinfo.length == 0) {
            console.log("The user " + getUserID[0].user_name + ' has no tweets')
        } else {
            const tweetid = await listTweets("Enter the ID of the tweet you would like to delete", getUserID[0].user_id)
        
            await common.getData('DELETE FROM social_media.user_tweets WHERE user_id = ' + '"' + getUserID[0].user_id + '" AND tweet_id = ' + '"' + tweetid + '"', [], false);
        }
    } else {
        console.log("you need to add some users!")
    }
}

async function insertUsers() {
    console.log("Inserting 1000 random users into the database...")
    
    const newUsers = [];

    const lastUser = await common.getData('SELECT user_id FROM social_media.users ORDER BY user_id', [], true);

    var lastUserIDNumber = 0;

    if (lastUser.length != 0) {
        const lastUserID = lastUser[lastUser.length - 1]
     
        lastUserIDNumber = (lastUserID != undefined ? lastUserID.user_id : 0)
    }
  
    for(let i = lastUserIDNumber; i<lastUserIDNumber + 1000;i++) {
        newUsers.push(common.createNewUser());
    }
    
    var insertQuery = "INSERT INTO social_media.users (user_firstName, user_lastName, user_name, user_password, user_avatar, bioText, mobilePhone, registerDate) VALUES ?";

    await common.getData(insertQuery, [newUsers], false)
}

async function viewUser() {
    const rows = await common.getData('SELECT * FROM social_media.users ORDER BY user_name LIMIT 5 OFFSET 0', [], true);

    if(rows.length != 0) {
        const username = await listUsers("Enter the username of the user whose info you would like to view.");
    
        const userinfo = await common.getData('SELECT * FROM social_media.users WHERE user_name = ' + '"' + username + '"', [], true);

        console.log('User info for ' + userinfo[0].user_name + ": ");
    
        console.log('First name ' + userinfo[0].user_firstName);
        console.log('Last name ' + userinfo[0].user_lastName);
        console.log('Bio name ' + userinfo[0].bioText);
        console.log('Phone number ' + userinfo[0].mobilePhone);
        console.log('Register date ' + userinfo[0].registerDate);
    
        const numberOfTweets = await common.getData('SELECT COUNT(tweet_id) AS num_tweets FROM social_media.user_tweets WHERE user_id = ' + '"' + userinfo[0].user_id + '"', [], true);
    
        console.log('The user has ' + numberOfTweets[0].num_tweets + ' tweets ');
    
        const numFollowers = await common.getData('SELECT COUNT(current_user_id) AS num_followers FROM social_media.user_followers WHERE current_user_id = ' + '"' + userinfo[0].user_id + '"', [], true);
    
        console.log('The user is following ' + numFollowers[0].num_followers + ' users ');
    
        const numFollowees = await common.getData('SELECT COUNT(user_followee_id) AS num_followees FROM social_media.user_followees WHERE user_followee_id = ' + '"' + userinfo[0].user_id + '"', [], true);
    
        console.log('The user has ' + numFollowees[0].num_followees + ' followers ');

        const numTweetsLiked = await common.getData('SELECT COUNT(original_user_id) AS num_tweets_liked FROM social_media.user_likes WHERE original_user_id = ' + '"' + userinfo[0].user_id + '"', [], true);
    
        console.log('The user has their tweets liked by ' + numTweetsLiked[0].num_tweets_liked + ' people');
    } else {
        console.log("you need to hire some users!")
    }
}

async function insertTweets() {

    const rows = await common.getData('SELECT * FROM social_media.users ORDER BY user_name', [], true);
        
    if (rows.length != 0) {

        const username = await listUsers();

        const personID = await common.getData('SELECT * FROM social_media.users WHERE user_name = ' + '"' + username + '"', [], true);
        
        const fakeTweets = [];
        
        console.log('Inserting 1000 random tweets into ' + username + 's account')

        for(let i = 0; i < 1000; i++) {
            fakeTweets.push(common.createFakeTweet(personID[0].user_id.toString()));
        }
    
        var insertTweetSQL = "INSERT INTO social_media.user_tweets (tweet_text, date_posted, user_id) VALUES ?";
    
        await common.getData(insertTweetSQL, [fakeTweets], false);

        const fakeUrls = [];
        
        for(let i = 0; i < 1000; i++) {
            fakeUrls.push(common.createFakeUrl(i));
        }

        var insertTweetURLSQL = "INSERT INTO social_media.tweet_urls (tweet_url, tweet_id) VALUES ?";

        await common.getData(insertTweetURLSQL, [fakeUrls], true);
    }
    
}

async function followUser() {

        const username = await listUsers("Select an account");

        const followSecondUser = prompt("Select an account who you want " + username + " to follow");

        const firstUserID = await getUserID(username)
        const secondUserID = await getUserID(followSecondUser)

        const isFollowing = await common.getData("SELECT * from social_media.user_followers WHERE EXISTS(SELECT * FROM social_media.user_followers WHERE user_follower_id = " + "'" + firstUserID[0].user_id + "' AND current_user_id = " + "'" + secondUserID[0].user_id + "')", [], true)
       
        if(0 < isFollowing.length) {
            console.log("Are you sure you want to unfollow" + followSecondUser + "them? Type yes or no")
            const unfollowUser = prompt("");
    
            if(unfollowUser == "yes") {
                await common.getData('DELETE FROM social_media.user_followers WHERE user_follower_id = ' + '"' + firstUserID[0].user_id + '" AND current_user_id = ' + '"' + secondUserID[0].user_id + '"', [], false)
                await common.getData('DELETE FROM social_media.user_followees WHERE user_followee_id = ' + '"' + secondUserID[0].user_id + '" AND current_user_id = ' + '"' + firstUserID[0].user_id + '"', [], false)
            }else {
                await common.getData("INSERT INTO social_media.user_followers (user_follower_id, current_user_id) VALUES (" + '"' + firstUserID[0].user_id + '", "' + secondUserID[0].user_id + '")', [], false);
                await common.getData("INSERT INTO social_media.user_followees (user_followee_id, current_user_id) VALUES (" + '"' + secondUserID[0].user_id + '", "' + firstUserID[0].user_id + '")', [], false);
            }
        }
}

async function deleteAccount() {
    const rows = await common.getData('SELECT * FROM social_media.users ORDER BY user_name', [], true);
        
    if (rows.length != 0) {
        const username = await listUsers();
    
        const getUserID = await getUserID(username)

        await common.getData('DELETE FROM social_media.users WHERE user_name = ' + '"' + username + '" AND user_id = ' + '"' + getUserID[0].user_id + '"', [], false);
    } else {
        console.log("you need to insert some users!")
    }
    
}

async function likeTweet() {
    const username = await listUsers("Enter a username to get a list of their tweets");
    
    const firstUserID = await getUserID(username)

    const userinfo = await common.getData('SELECT COUNT(original_user_id) AS user_likes FROM social_media.user_likes WHERE original_user_id = ' + '"' + firstUserID[0].user_id + '"', [], true);

    if (userinfo[0].user_likes == 0) {
        console.log("The user " + username + ' has no tweets')
    } else {
        const likeTweetPrompt = await listTweets("Enter the ID of the tweet you would like another user to like", firstUserID[0].user_id);

        const selectAnotherUserPrompt = prompt("Enter another user name from the list above who you want to like the above tweet");

        const getSecondUserID = await getUserID(selectAnotherUserPrompt)

        const isTweetAlreadyLiked = await common.getData("SELECT * from social_media.user_likes WHERE EXISTS(SELECT * FROM social_media.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "' AND user_id = " + "'" + getSecondUserID[0].user_id + "')", [], true)

        if (isTweetAlreadyLiked.length != 0) {
            await common.getData("DELETE FROM social_media.user_likes WHERE tweet_id = " + "'" + likeTweetPrompt + "'" + "AND user_id = " + "'" + getSecondUserID[0].user_id + "'", [], false);
        } else {
            await common.getData("INSERT INTO social_media.user_likes (tweet_id, user_id, original_user_id) VALUES (" + "'" + likeTweetPrompt + "', '" + getSecondUserID[0].user_id + "', '" + firstUserID[0].user_id + "')", [], false);
        }
    }
}

async function blockUser() {
    const option = await listUsers("Enter the username of the user");
    
    const whoWantsToBlockUser = prompt("Enter the username of the user wnats to block the above user");
    const blockedUserID = await getUserID(option)
    const currentUserID = await getUserID(whoWantsToBlockUser)

    const isUserAlreadyBlocked = await common.getData("SELECT * from social_media.blocked_users WHERE EXISTS(SELECT * FROM social_media.blocked_users WHERE blocked_user_id = " + "'" + blockedUserID[0].user_id + "' AND user_id = " + "'" + currentUserID[0].user_id + "')", [], true)

    if (isUserAlreadyBlocked.length == 0) {
        await common.getData("INSERT INTO social_media.blocked_users (blocked_user_id, user_id) VALUES (" + "'" + blockedUserID[0].user_id + "', '" + currentUserID[0].user_id + "')", [], false);
    } else {
        console.log("This user is already blocked. Do you want to unblock them? Type yes or no")
        const unblockUser = prompt("");

        if(unblockUser == "yes") {
            await common.getData("DELETE FROM social_media.blocked_users WHERE blocked_user_id = " + "'" + blockedUserID[0].user_id + "'" + "AND user_id = " + "'" + currentUserID[0].user_id + "'", [], false);
        }

    }
}

module.exports = {deleteTweet, insertUsers, viewUser, insertTweets, followUser, deleteAccount, likeTweet, blockUser}