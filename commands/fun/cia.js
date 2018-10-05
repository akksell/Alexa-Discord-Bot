const commando = require('discord.js-commando');

class PlayMusicCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'do you work for the cia',
            group: 'fun',
            memberName: 'do_you_work_for_the_cia',
            description: 'Answers the question if she works for the CIA'
        });
    }

    async run(message, args) {
        console.log("exectued cia command");
    }

}

module.exports = PlayMusicCommand;
