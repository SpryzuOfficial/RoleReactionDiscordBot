const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-add-role-msg')
        .setDescription('Creates an Auto Role message')
        .addStringOption(option => option.setName('name').setDescription('Name of the embed section').setRequired(true))
        .addStringOption(option => option.setName('roles').setDescription('Roles, enter in the desired order using space as separator (@role1 @role2 @role3)').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Description, enter in the desired order using ! as separator (Desc. 1!Desc. 2!Desc. 3)').setRequired(true)),
    
    async run(client, interaction)
    {
        try
        {
            const name = interaction.options.getString('name');
            const roles = interaction.options.getString('roles').split(' ');
            const desc =  interaction.options.getString('description').split('!');

            const embed = new MessageEmbed()
                        .setAuthor(client.user.username)
                        .setTitle(`Auto role - ${name}`)
                        .setDescription('You can select as many roles you want!')
                        .setColor('#FFC402')
                        .setTimestamp();

            const options = [];

            roles.forEach((element, i) =>
            {
                const id = element.split('&')[1].split('>')[0];
                options.push(
                {
                    label: desc[i],
                    value: id,
                });
                embed.addField(desc[i], element);
            });

            const row = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('add-role-select')
                                .setPlaceholder('Select role')
                                .addOptions(options),
                        );

            interaction.reply({embeds: [embed], components: [row]});
        }
        catch(error)
        {
            console.log(error);
        }
    }
}