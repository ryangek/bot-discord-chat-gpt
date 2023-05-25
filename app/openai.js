const { Configuration, OpenAIApi } = require('openai');
const { insertChatHistory, insertChatUsageHistory, getUserChatSetting } = require('./db');
const chatModel = process.env.GPT_MODEL;
console.log(`The system is using OpenAI Model...<< ${chatModel} >>`);

const configuration = new Configuration({
    apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatGPT(message) {
    const chatSetting = await getUserChatSetting(message.author.id);
    let messageLog = [
        { role: 'system', content: chatSetting ? chatSetting.ROLE : 'You are a friendly chatbot.' },
    ];
    
    messageLog.push({
        role: 'user',
        content: message.content,
    });

    insertChatHistory(messageLog, message.author.id);

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
