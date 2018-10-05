const commando = require('discord.js-commando');

class EmoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'emo',
            group: 'fun',
            memberName: 'emo',
            description: 'Returns an emo message'
        });
    }

    async run(message, args) {
        var emoMessage = new Array();

        emoMessage[0] = "i like walking in the rain cause no one can see your tears";
        emoMessage[1] = "do you ever feel like breaking down?";
        emoMessage[2] = "do you ever feel out of place? like somehow you just don`t belong?";
        emoMessage[3] = "i just feel like no one understands me";
        emoMessage[4] = "*faking a smile*";
        emoMessage[5] = "i tear my heart open just to feel";
        emoMessage[6] = "i just wanna **scream**";
        emoMessage[7] = "my mom tried to tell me i can't get a star tattoo until i move out. lol ok mom";
        emoMessage[8] = "second chances... they don't ever matter, people never change";
        emoMessage[9] = "my mom just doesn't understand me"; // TODO: need to add more emo messages
        emoMessage[10] = "some days i just can't get out of bed";
    
        var length = emoMessage.length;
        var whichMessage = Math.floor(Math.random() * length);

        message.reply(emoMessage[whichMessage]);
    }

}

module.exports = EmoCommand;