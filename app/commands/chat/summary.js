const {
    SlashCommandBuilder,
    ApplicationCommandOptionType,
} = require('discord.js');
const Table = require('table');
const { sumChatUsageHistoryGroupByModel } = require('../../db');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Show information usage ChatGPT')
        .addSubcommand((option) =>
            option.setName('summary').setDescription('Get usage summary')
        ),
    async execute(interaction) {
        let message = 'Sorry, I cannot working right now !';
        try {
            const result = await sumChatUsageHistoryGroupByModel();

            const data = [
                ['Model', 'Prompt Tokens', 'Completion Tokens', 'Total Tokens'],
            ];
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    data.push([
                        result[i].MODEL,
                        result[i].USAGE_PROMPT_TOKEN,
                        result[i].USAGE_COMPLETION_TOKEN,
                        result[i].USAGE_TOTAL_TOKEN,
                        `$${result[i].USAGE_PRICE}`,
                    ]);
                }
            }

            const tableConfig = {
                border: Table.getBorderCharacters('norc'),
                drawHorizontalLine: (index, size) => {
                    return index === 0 || index === 1 || index === size;
                },
            };

            message = `\`\`\`${Table.table(data, tableConfig)}\`\`\``;
        } catch (e) {
            console.error('execute has errors: ', e);
        } finally {
            await interaction.reply(message);
        }
    },
};
