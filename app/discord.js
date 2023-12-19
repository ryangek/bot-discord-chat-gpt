const { Client } = require('discord.js');
const discord = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
});

function messageCreate(func) {
    discord.on('messageCreate', func);
}

module.exports = {
    discord,
    messageCreate,
};
