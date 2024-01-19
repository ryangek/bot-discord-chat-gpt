const { TOKEN_RG, CHANNEL_ID_LIST } = require('./config.json');
const { discord, messageCreate } = require('./app/discord');
const { chatGPT } = require('./app/openai');

messageCreate(async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;
    if (
        CHANNEL_ID_LIST &&
        !CHANNEL_ID_LIST.split(',').includes(message.channelId)
    ) {
        console.log("Channel ID: " + message.channelId);
        return;
    }
    if (message.content.startsWith('Q/')) {
        await message.channel.sendTyping();
        const rule = "You are an expert in technology.";
        const ct = await chatGPT(message, rule);
        if (ct.length > 2000) {
            const te = new TextEncoder();
            message.reply({
                content: `<@${message.author.id}>: `,
                files: [{
                    name: 'result.md',
                    attachment: Buffer.from(te.encode(`${ct}`))
                }]
            });
        } else {
            message.reply(`<@${message.author.id}>: ${await chatGPT(message, rule)}`);
        }
    }
});

discord.login(TOKEN_RG);
