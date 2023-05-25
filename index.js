require('dotenv').config();
const { discord, messageCreate, messageReactAdd } = require('./app/discord');
const { chatGPT } = require('./app/openai');

messageCreate(async (message) => {
    if (message.author.bot) return;
    if (
        process.env.CHANNEL_ID_LIST &&
        !process.env.CHANNEL_ID_LIST.split(',').includes(message.channelId)
    )
        return;
    if (message.content.startsWith(process.env.COMMAND_PREFIX)) return;

    await message.channel.sendTyping();

    message.reply(await chatGPT(message, discord));
});

discord.login(process.env.TOKEN);
