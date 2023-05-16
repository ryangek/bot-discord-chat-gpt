require('dotenv').config();

const { Client, Collection, Events, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildIntegrations,
    ],
});

client.commands = new Collection();

const configuration = new Configuration({
    apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.channelId != process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    let messageLog = [
        { role: 'system', content: 'You are a friendly chatbot.' },
    ];

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({
        limit: process.env.LIMIT,
    });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && msg.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        messageLog.push({
            role: 'user',
            content: msg.content,
        });
    });

    messageLog.push({
        role: 'user',
        content: message.content,
    });

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messageLog,
    });

    message.reply(result.data.choices[0].message);
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);
