const commando = require('discord.js-commando');

class PriceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'price',
            group: 'crypto',
            memberName: 'price',
            description: 'Displays the current price of BTC, ETH, or LTC at the time of request. ```USAGE: alexa price [BTC, ETH, or LTC]```'
        });
    }

    async run(message, args) {
        console.log("exectued price command");
    }
}

module.exports = PriceCommand;
