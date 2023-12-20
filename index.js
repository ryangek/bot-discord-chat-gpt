const { TOKEN, CHANNEL_ID_LIST } = require('./config.json');
const { discord, messageCreate } = require('./app/discord');
const { chatGPT } = require('./app/openai');

messageCreate(async (message) => {
    if (message.author.bot) return;
    if (
        CHANNEL_ID_LIST &&
        !CHANNEL_ID_LIST.split(',').includes(message.channelId)
    )
        return;
    if (message.content.startsWith('TH/') || message.content.startsWith('EN/')) {
        await message.channel.sendTyping();
        let rule = "";
        if (message.content.startsWith('TH/')) {
            rule = "You will be provided with a sentence in English, and your task is to translate it into Thai. Don't include TH/ or EN/";
        } else if (message.content.startsWith('EN/')) {
            rule = "You will be provided with a sentence in Thai, and your task is to translate it into English. Don't include TH/ or EN/";
        }
        message.reply(`<@${message.author.id}>: ${await chatGPT(message, rule)}`);
    }
});

discord.login(TOKEN);
