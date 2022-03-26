const { CommandHandlerError, Logger, BetterEmbed, Command, getThing,isOwner } = require('advanced-command-handler');
const { DateTime } = require('luxon');
const Discord = require('discord.js');
const {Event} = require('advanced-command-handler');
/**
 * Verify if the user, and the client has all the permissions of the Command.
 * @param {Message} message - The message.
 * @param {Command} command - Command to verify the permissions.
 * @returns {{client: Permissions[], user: Permissions[]}} - Missing permissions.
 */
function verifyPerms(message, command) {
    const clientMissingPermissions = [];
    const userMissingPermissions = [];
    if (!message.guild)
        return {
            client: clientMissingPermissions,
            user: userMissingPermissions,
        };

    if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
        command.clientPermissions.forEach(permission => {
            if (!Discord.Permissions.FLAGS[permission]) {
                throw new CommandHandlerError(
                    'eventMessage',
                    `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
                );
            }

            if (!message.channel.permissionsFor(message.guild.me).has(permission, false)) {
                clientMissingPermissions.push(permission);
            }
        });
    }

    command.userPermissions.forEach(permission => {
        if (!Discord.Permissions.FLAGS[permission]) {
            throw new CommandHandlerError(
                'eventMessage',
                `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
            );
        }

        if (!message.channel.permissionsFor(message.member).has(permission, false)) {
            userMissingPermissions.push(permission);
        }
    });

    return {
        client: clientMissingPermissions,
        user: userMissingPermissions,
    };
}

/**
 * Create an Embed Objet for listing the missing permisisons of a member or a client.
 * @param {Permissions[]} permissions - The missing Permisisons.
 * @param {boolean} client - If the missing permissions are to the client.
 * @returns {object} - An Embed Object.
 */
function missingPermission(permissions, client = false) {
    const embed = new BetterEmbed();
    embed.color = '#ecc333';
    embed.title = client ? 'The bot is missing permissions.' : 'The member is missing permissions.';
    embed.description = `These permissions are missing for the command to succeed : ${permissions}`;

    return embed.build();
}
module.exports = new Event(
	{
		name: 'message',
	
	},
    async (handler, message) => {
    if (message.author.bot || message.system) return;

    let prefix = handler.client.config.prefix;
    if (message.content.startsWith(prefix)) {
        prefix = prefix;
    } else {
        return
    }

    if (message.author.bot || message.system) return;


    const messageToString = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    /**
     * The command that have been searched through the message content.
     * @type {Command | null} -
     */
    const cmd = await getThing('command', args[0].toLowerCase().normalize());
    args.shift();
    if (prefix) {

        if (cmd) {
            const config = require('../config')

            if (!cmd.channels.includes(message.channel.id) && !isOwner(message.author.id)) return message.channel.send(`Cette commande doit uniquement être utilisé dans le channel ${config.channels.map(ch => `<#${ch}>`).join(" ")}`).then(mp => mp.delete({timeout : 4000}));
            if (message.author.id === "679559090741051393") return message.channel.send("Tu es blacklist freik");
            if (message.author.id === "709534713500401685") return message.channel.send("Tu es blacklist Dowzy");
            if (message.author.id === "754832699889418262") return message.channel.send("Tu es blacklist Dowzy");
            if (message.author.id === "738127567860662374") return message.channel.send("Tu es blacklist oruma");
            if (message.author.id === "720036345896108103") return message.channel.send("Tu es blacklist oruma");
            if (message.author.id === "780019344511336518") return message.channel.send("Tu es blacklist next");
            if (message.author.id === "755439561529622558") return message.channel.send("Tu es blacklist hades");

            if (!isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.tags.includes('ownerOnly'))) {
                await message.channel.send("Tu n'es pas le créateur du bot. Tu n'as donc pas les permissions d'executer cette commande.");
                return Logger.log(
                    `${Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`
                );
            }

            if (message.guild) {
                Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`);

                const verified = verifyPerms(message, cmd);
                // if (verified.client.length > 0) return message.channel.send({ embed: missingPermission(verified.client, true) });
                if (verified.client.length > 0) return message.channel.send(missingPermissionC(verified.client));
                if (verified.user.length > 0 && !isOwner(message.author.id)) return message.channel.send(missingPermission(verified.user));
                if (cmd.tags.includes("nsfw") && !message.channel.nsfw) {
                    const embed = new BetterEmbed({
                        title: 'Error :',
                        description: 'Les commandes NSFW sont uniquement disponible dans des salons NSFW.',
                        footer: handler.client.user.username,
                        footerIcon: handler.client.user.displayAvatarURL,
                    });
                    await message.channel.send(embed.build());
                }
            } else {
                Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} in private messages.`);
                if (cmd.tags.includes("guildOnly")) {
                    await message.channel.send('Cette commande est uniquement disponible sur un serveur.');
                    return Logger.log(`${Logger.setColor('magenta', message.author.tag)} tried the command ${Logger.setColor('gold', cmd.name)} only available on guild but in private.`);
                }
            }

            if (handler.cooldowns.has(message.author.id)) {
                return message.channel.send(`Veuillez executer la commande dans \`${handler.cooldowns.get(message.author.id)}\` secondes.`);
            } else if (cmd.cooldown > 0) {
                handler.cooldowns.set(message.author.id, cmd.cooldown);
                setTimeout(() => {
                    handler.cooldowns.delete(message.author.id);
                }, cmd.cooldown * 1000);
            }

            cmd.run(handler.client, message, args).catch(warning => {
                Logger.warn(`A small error was made somewhere with the command ${Logger.setColor('gold', cmd.name)}.
        Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}${Logger.setColor('red', '\nError : ' + warning.stack)}`);

                if (isOwner(message.author.id)) {
                    const embedLog = new BetterEmbed();
                    embedLog.color = '#dd0000';
                    embedLog.description = 'An error occurred with the command : **' + cmd.name + '**.';
                    embedLog.fields.push({
                        name: 'Informations :',
                        value: `\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild.name}** (\`${message.guild.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``,
                    });

                    embedLog.fields.push({
                        name: 'Error :',
                        value: warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack,
                    });

                    embedLog.fields.push({
                        name: 'Message :',
                        value: messageToString,
                    });

              //      return message.channel.send(embedLog.build());
                }
            });
        }
    }
});