const { Configuration, OpenAIApi } = require('openai');
const { Tokenizer } = require('tiktoken');
const { insertChatHistory, insertChatUsageHistory } = require('./db');
const chatModel = process.env.GPT_MODEL;
console.log(`The system is using OpenAI Model...<< ${chatModel} >>`);

const configuration = new Configuration({
    apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatGPT(message, discord) {
    let messageLog = [
        { role: 'system', content: 'You are a friendly chatbot.' },
    ];

    // let prevMessages = await message.channel.messages.fetch({
    //     limit: process.env.LIMIT,
    // });
    // prevMessages.reverse();

    // prevMessages.forEach((msg) => {
    //     if (msg.content.startsWith('!')) return;
    //     if (msg.author.id !== discord.user.id && msg.author.bot) return;
    //     if (msg.author.id !== message.author.id) return;

    //     messageLog.push({
    //         role: 'user',
    //         content: msg.content,
    //     });
    // });

    messageLog.push({
        role: 'user',
        content: message.content,
    });

    insertChatHistory(messageLog, discord.user.id);

    const result = await openai.createChatCompletion({
        model: chatModel,
        messages: messageLog,
    });

    if (result && result.data) {
        insertChatUsageHistory(result.data);

        return result.data.choices[0].message;
    } else {
        return 'Apologize, I cannot answer this question right now !';
    }
}

module.exports = {
    chatGPT,
};
