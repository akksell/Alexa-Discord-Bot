const commando = require('discord.js-commando');

class CoinFlipCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'flip',
            group: 'fun',
            memberName: 'flip',
            description: 'Flips a coin'
        });
    }

    async run(message, args) {
        var flip = Math.floor(Math.random() * 2) + 1;
            if (flip == 1) {
                message.reply("The coin landed on heads");
            } else if (flip == 2) {
                message.reply("The coin landed on tails");
            }
    }

}

module.exports = CoinFlipCommand;
