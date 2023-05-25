const {
    SlashCommandBuilder,
} = require('discord.js');
const { insertUserChatSetting } = require('../../db');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Assign or remove a role from a user')
        .addUserOption((option) =>
            option.setName('user').setDescription('Select a user').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('role').setDescription('Write the role what you want bot to be ex. a doctor / an engineer / a programmer / a developer.').setRequired(true)
        ),
    async execute(interaction) {
        let message = 'Sorry, I cannot working right now !';
        try {
            const user = interaction.options.getUser('user');
            console.log(user);
            const role = interaction.options.getString('role');
            let roleMsg = `You are ${role}.`;
            message = `Updated chatbot's role as \`${role}\``;
            if ("RESET" === role.toUpperCase()) {
                roleMsg = 'You are a friendly chatbot.';
                message = `Reset chatbot's role as a \`friendly chatbot\``;
            }
            insertUserChatSetting(user.id, roleMsg);
        } catch (e) {
            console.error('execute has errors: ', e);
        } finally {
            await interaction.reply(message);
        }
    },
};
