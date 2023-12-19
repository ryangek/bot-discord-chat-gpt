const { TOKEN, CHANNEL_ID_LIST, COMMAND_PREFIX } = require('./config.json');
const { discord, messageCreate } = require('./app/discord');
const { chatGPT } = require('./app/openai');

messageCreate(async (message) => {
    if (message.author.bot) return;
    if (
        CHANNEL_ID_LIST &&
        !CHANNEL_ID_LIST.split(',').includes(message.channelId)
    )
        return;
    if (message.content.startsWith(COMMAND_PREFIX)) return;

    if (message.content.includes('TH/') || message.content.includes('EN/')) {
        await message.channel.sendTyping();
        message.reply(await chatGPT(message));
    }
});

discord.login(TOKEN);
