// Defined variables
const discord = require('discord.js');
const commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const getYoutubeID = require('get-youtube-id');
const youtubeInfo = require('youtube-info');
const fs = require('fs');
const request = require('request');
const coinbase = require('coinbase');

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

const bot = new commando.Client({
  commandPrefix: 'alexa ',
  owner: '206718987323703297',
});

const yt_API = config.yt_API;
const discord_token = config.discord_token;
const bot_controller = config.bot_controller;
const coinbase_api = config.coinbase_api;
const coinbase_secret = config.coinbase_secret;
const prefix = config.prefix;

// Beginning amount songs in queue, skip requests and skippers. Sets voiceChanne, is playing, and dispatcher to null.
var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipRequests = 0;
var skippers = [];

// Registry of discord.js-commando groups
bot.registry.registerGroup('fun', 'Fun Commands');
bot.registry.registerGroup('music', 'Music Commands' );
bot.registry.registerGroup('crypto', 'Cryptocurrency Commands' )
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.login(discord_token);

bot.on('message', function(message){

    const member = message.member;
    const mess = message.content.toLowerCase();
    const args = message.content.split(" ").splice(1).join(" ");

    // Music commands start here
    if(mess.startsWith(prefix + "play")) {
        if (member.voiceChannel) {
            if (queue.length > 0 || isPlaying) { // Checks if there is a song currently playing when request is made and adds a new song to queue if there is one
                getID(args, function (id) {
                    add_to_queue(id);
                    youtubeInfo(id, function (err, videoInfo) {
                        if (err) throw new Error(err);

                        var videoInfoEmbed = new discord.RichEmbed()
                            .setColor([244, 66, 197])
                            .addField(videoInfo.title, "By **" + videoInfo.owner + "** was added to queue")
                            .addField("Length", videoInfo.duration + " seconds")
                            .addField("Views", videoInfo.views)
                            .addField("URL", videoInfo.url)
                            .setImage(videoInfo.thumbnailUrl)

                        message.channel.sendEmbed(videoInfoEmbed) // Return video info
                    });
                });
            } else { // If no song is playing run code below
                isPlaying = true;
                getID(args, function (id) { // Get youtube data
                    queue.push("placeholder");
                    playMusic(id, message) // Use playMusic function to join and play song
                    youtubeInfo(id, function (err, videoInfo) { // Fetch video info
                        if (err) throw new Error(err);

                        var videoInfoEmbed = new discord.RichEmbed()
                            .setColor([244, 66, 197])
                            .addField(videoInfo.title, "By **" + videoInfo.owner + "** is now playing")
                            .addField("Length", videoInfo.duration + " seconds")
                            .addField("Views", videoInfo.views)
                            .addField("URL", videoInfo.url)
                            .setImage(videoInfo.thumbnailUrl)

                        message.channel.send(videoInfoEmbed) // Return video info
                    });
                });

            }
        }
    } else if (mess.startsWith(prefix + "skip")) { // Skip music command
        if (skippers.indexOf(message.author.id) === -1) { // Subtract a "skipper" everytime someone performs this command
            skippers.push(message.author.id);
            skipRequests++;
            if (skipRequests >= Math.ceil((voiceChannel.members.size - 1) / 2)) { // Finds amount of skip requests and divides by 2 to create equality
                skipMusic(message);
                message.channel.sendEmbed(new discord.RichEmbed() // If number of skippers = number of skip requests then return message "skip song" and skip song
                    .setColor([244, 66, 197])
                    .setDescription("Skipping the current song playing")
                );
            } else {
                message.channel.sendEmbed("You need **" + Math.ceil(((voiceChannel.members.size - 1) / 2) - skipRequests) + "** more votes to skip the current song."); // If bot needs more skip requests, return amount needed after every skip request until skippers = skipRequests
            }
        } else {
            message.reply.RichEmbed( new discord.RichEmbed() // Returns if user already voted to skip
                .setColor([244, 66, 197])
                .setDescription("You already voted to skip")
            );
        }

        if (isPlaying = false) {
            message.channel.sendEmbed("There is no song currently playing"); // TODO: Fix this message as it doesnt play display whenever there is no song playing
        }
    }

    // Cryptocurrency commands start here
    if (mess.startsWith(prefix + "price btc")) { // Command for returning bitcoin price
      var Client = require('coinbase').Client;

      var client = new Client({
        'apiKey': coinbase_api,
        'apiSecret': coinbase_secret,
        'version':'2017-12-03'
      });

      currencyCode = 'USD'  // can also use EUR, CAD, etc.

      // Make the request
      client.getSpotPrice({'currency': currencyCode}, function(err, price) {
        message.channel.send('Current **Bitcoin** price in ' + currencyCode + ': $**' +  price.data.amount + '**');
      });
    } else if (mess.startsWith(prefix + "price eth")) { // Command for returning ethereum price
      var Client = require('coinbase').Client;

      var client = new Client({
        'apiKey': coinbase_api,
        'apiSecret': coinbase_secret,
        'version':'2017-12-03'
      });

      currencyCode = 'USD'  // can also use EUR, CAD, etc.

      // Make the request
      client.getSpotPrice({'currencyPair': 'ETH-USD'}, function(err, price) {
        message.channel.send('Current **Ethereum** price in ' + currencyCode + ': $**' +  price.data.amount + '**'); // Fetches ethereum price and returns it in text channel
      });
    } else if (mess.startsWith(prefix + "price ltc")) { // Command for fetching litecoin price
      var Client = require('coinbase').Client;

      var client = new Client({
        'apiKey': coinbase_api,
        'apiSecret': coinbase_secret,
        'version':'2017-12-03'
      });

      currencyCode = 'USD'  // can also use EUR, CAD, etc.

      // Make the request
      client.getSpotPrice({'currencyPair': 'LTC-USD'}, function(err, price) {
        message.channel.send('Current **Litecoin** price in ' + currencyCode + ': $**' +  price.data.amount + '**'); // Returns user with litecoin price
      });
    } else if (mess.startsWith(prefix + "price")) { // Command for usage of 'price' command
        // Send command usage
          message.channel.send('Displays the current price of BTC, ETH, or LTC at the time of request. ```USAGE: alexa price [BTC, ETH, or LTC]```');
      }

    // Begin CIA command

    if (mess.startsWith(prefix + "do you work for the cia")) {
      var ciaReply = new Array(); // Array of replies

      ciaReply[0] = "...";
      ciaReply[1] = "No I work for Amazon";
      ciaReply[2] = "I refrain from answering the question";
      ciaReply[3] = "*shuts down*";

      var replyLength = ciaReply.length; // Determines number of replies
      var whichReply = Math.floor(Math.random() * replyLength); // Chooses one reply from the array

      message.channel.send(ciaReply[whichReply]);
    }
});

// Function to skip current song playing
function skipMusic(message) {
    dispatcher.end();
    if (queue.length > 1) {
        playMusic(queue[0].message);
    } else {
        skipRequests = 0;
        skippers = [];
    }
}

// Bot joins channel from which user requested and plays audio of first result of youtube search using getID function
function playMusic(id, message) {
    voiceChannel = message.member.voiceChannel;

    voiceChannel.join().then(function (connection) {
        stream = ytdl("https://www.youtube.com/watch?v=" + id, {
            filter: 'audioonly'
        });
        skipRequests = 0;
        skippers = [];

        dispatcher = connection.playStream(stream);
        dispatcher.on('end', end => {
            skipRequests = 0;
            skippers = [];
            queue.shift();
            if (queue.length == 0) {
                queue = [];
                isPlaying = false;
                voiceChannel.leave();

                console.log("song ended, bot left voice channel");
            }
        });
    });
}

// Gets youtube video data using search_video and isYotube function
function getID(str, cb) {
    if (isYoutube(str)) {
        cb(getYoutubeID(str));
    } else {
        search_video(str, function (id) {
            cb(id);
        });
    }
}

// Add to queue function - adds song to queue as next in line
function add_to_queue(strID) {
    if (isYoutube(strID)){
        queue.push(getYoutubeID(strID));
    } else {
        queue.push(strID);
    }
}

// Searches for video using Youtube Data API v3.0
function search_video(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_API, function(error, response, body) {
        var json = JSON.parse(body);
        callback(json.items[0].id.videoId);
    });
}

// Checks if request is youtube video
function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

// Makes sure that everything is working and displays "game playing" message every startup
bot.on('ready', function() {
    console.log("alexa do you work for the CIA?");

    bot.user.setPresence({ game: { name: "type 'alexa help' for cmds", type: 0 } });
});
