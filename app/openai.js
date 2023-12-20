const { Configuration, OpenAIApi } = require('openai');
const { GPT_MODEL, GPT_KEY } = require('../config.json');
const chatModel = GPT_MODEL;
console.log(`The system is using OpenAI Model...<< ${chatModel} >>`);

const configuration = new Configuration({
    apiKey: GPT_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatGPT(message, rule) {
    if (rule) {
        console.log(`Rule: ${rule}`);
        let messageLog = [
            {
                role: 'system',
                content: rule,
            },
        ];

        let question = message.content.replaceAll("EN/");
        question = question.replaceAll("TH/");
        messageLog.push({
            role: 'user',
            content: question,
        });

        const result = await openai.createChatCompletion({
            model: chatModel,
            messages: messageLog,
        });

        if (result && result.data) {
            console.log(result.data.choices[0].message)
            return result.data.choices[0].message.content;
        } else {
            return 'Apologize, I cannot translate this content right now !';
        }
    }

    return 'Apologize, I cannot translate this content right now !';
}

module.exports = {
    chatGPT,
};
