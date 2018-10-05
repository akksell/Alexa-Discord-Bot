const commando = require('discord.js-commando');

class SkipMusicCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'Skips the current song playing (if this request is made but the author of the request is not the original sender of the song being played, the bot will require a certain number of skip votes to skip the current song.)'
        });
    }

    async run(message, args) {
        console.log("exectued skip command");
    }

}

module.exports = SkipMusicCommand;
