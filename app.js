const fs = require('fs');

require('dotenv').config();

const {Client, Intents, Collection} = require('discord.js');

const {keepAlive} = require('./server');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.slashcommands = new Collection();
const slashCommandFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for(const file of slashCommandFiles)
{
    const slash = require(`./slash_commands/${file}`);
    client.slashcommands.set(slash.data.name, slash);
}

client.on('ready', () =>
{
    console.log(client.user.tag);
});

client.on('interactionCreate', async(interaction) =>
{
    if(interaction.isCommand())
    {
        const slashcmds = client.slashcommands.get(interaction.commandName);

        if(!slashcmds) return;

        try
        {
            await slashcmds.run(client, interaction);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    if(interaction.isSelectMenu())
    {
        try
        {
            if(interaction.member.roles.cache.has(process.env.ADM))
            {
                if(interaction.customId == 'add-role-select')
                {
                    interaction.member.roles.add(interaction.guild.roles.cache.get(interaction.values[0]));
                    interaction.reply('Role added (This message will be deleted in 3 seconds)');
                    setTimeout(async() =>
                    {
                        await interaction.deleteReply();
                    }, 3000);
                }

                if(interaction.customId == 'remove-role-select')
                {
                    interaction.member.roles.remove(interaction.guild.roles.cache.get(interaction.values[0]));
                    interaction.reply('Role removed (This message will be deleted in 3 seconds)');
                    setTimeout(async() =>
                    {
                        await interaction.deleteReply();
                    }, 3000);
                }
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
});

if(process.env.PRODUCTION == 1)
{
    keepAlive();
}

client.login(process.env.TOKEN);