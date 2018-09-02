const Discord = require('discord.js');
const Chalk = require('chalk');
require('dotenv').config();
const Client = new Discord.Client();
const fs = require('fs')
const request = require('request');
const randomToken = require('random-token');

const guildData = JSON.parse(fs.readFileSync('guildData.json', 'utf8'))
const userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'))

var allowedToDM = false;

const prefix = "retro "

Client.login(process.env.retro)

Client.on('ready', () => {
    Client.user.setActivity("retro help")
})

Client.on('message', message => {
    var sender = message.author;

    if (message.channel.type == "dm" && allowedToDM == false) {
        return;
    }

    if (message.channel.type == "dm" && allowedToDM == true) {

    } else {
        if (!guildData[message.guild.id]) guildData[message.guild.id] = {
            prefix: "retro ",
            info: {
                tag: message.guild.owner.user.tag,
                id: message.guild.owner.id
            }
        }
    }

    if (!userData[message.author.id]) userData[message.author.id] = {
        verifyCode: 0,
        verified: false,
        warnQty: 0,
        warns: {
            warn1: "",
            warn2: "",
            warn3: ""
        },
        info: {
            tag: message.author.tag
        }
    }

    writeGuild();
    writeData();

    if(message.author.equals(Client.user) || !message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(' ');

    switch(args[0]) {

        case "help":
        if (args[1] == null) {
            var helpEmb = new Discord.RichEmbed()
            .setTitle("Retro Commands")
            .addField(`🤔 General`, '`retro help general`', true)
            .addField(`📷 Image`, '`retro help image`', true)
            .addField(`🎮 Gaming`, `retro help gaming`)
            .addField('🛠 Utility', '`retro help util`', true)
            .addField('🔨 Moderation', '`retro help moderation`', true)
            .setColor(0xFBE701)
            message.channel.send(helpEmb);
        } else if (args[1] == "general") {
            var generalHelpEmb = new Discord.RichEmbed()
            .addField(`🤔 General`, 'binfo, ginfo')
            .setColor(0xFBE701)
            message.channel.send(generalHelpEmb);
        }else if (args[1] == "image") {
            var imageHelpEmb = new Discord.RichEmbed()
            .addField(`📷 Image`, 'none')
            .setColor(0xFBE701)
            message.channel.send(imageHelpEmb);
        } else if (args[1] == "util") {
            var UtilHelpEmb = new Discord.RichEmbed()
            .addField(`🛠 Utility`, 'verify')
            .setColor(0xFBE701)
            message.channel.send(UtilHelpEmb);
        } else if (args[1] == "moderation") {
            var moderationHelpEmb = new Discord.RichEmbed()
            .addField(`🔨 Moderation`, 'ban, kick, warn')
            .setColor(0xFBE701)
            message.channel.send(moderationHelpEmb);
        } else if (args[1] == "gaming") {
            var gamingHelpEmb = new Discord.RichEmbed()
            .addField(`🎮 Gaming`, 'rsprofile')
            .setColor(0xFBE701)
            message.channel.send(gamingHelpEmb);
        }
        break;

        case "rsprofile":
        request(`https://apps.runescape.com/runemetrics/profile/profile?user=${message.content.replace(prefix + "rsprofile", "").replace(" ", "")}&activities=20`, function (error, response, body) {
        var profileObj = JSON.parse(body);
        if (profileObj.error == "NO_PROFILE") {
            var rsNoProfileEmb = new Discord.RichEmbed()
            .addField("User not found!", `User '${message.content.replace(prefix + "rsprofile", "").replace(" ", "")}' not found!`)
            .setColor(0xFBE701)
            message.channel.send(rsNoProfileEmb);
        } else {
            var rsProfileEmb = new Discord.RichEmbed()
            .setAuthor(`${profileObj.name}'s Profile`)
            .addField("General", `Magic: ${profileObj.magic}\nRank: ${profileObj.rank}\nTotal XP: ${profileObj.totalxp}`)
            .addField("Quests", `Quests Started: ${profileObj.questsstarted}\nQuests Completed: ${profileObj.questscomplete}`)
            .setColor(0xFBE701)
            message.channel.send(rsProfileEmb);
        }
});
        break;

        case "binfo":
        var botInfo = new Discord.RichEmbed()
        .addField('Retro Info', `Ping: \`${Math.floor(Client.ping)}ms\`\nUptime: \`${Math.floor(Client.uptime)}ms\``)
        .setColor(0xFBE701)
        message.channel.send(botInfo);
        break;

        case "ginfo":
        var guildInfo = new Discord.RichEmbed()
        .setTitle(`${message.guild.name}`)
        .addField(`Members Count: ${message.guild.members.size}\nOwner: ${message.guild.owner.user.tag}\nCreated at: ${message.guild.createdTimestamp}`)
        .setThumbnail(message.guild.iconURL)
        .setColor(0xFBE701)
        message.channel.send(guildInfo);
        break;

        /*case "verify":
        if (args[1] == "lost") {
            sender.send("If you have lost your token, please join \`https://discord.gg/q9wfUs7\`")
        } else if (args[1] == null) {
            if (userData[sender.id]) {
                if (userData[sender.id].verifyCode == 0) {
                    var token = randomToken(16);
                    allowedToDM = true;
                    sender.send(`Your random token is \`${token}\`. Do not share this, this is your only verification means.\nNote: Tokens may be regenrated. Use \`$_verify lost\` to get more information on this.\n\n**Please type your code below to verify**`)
                    writeData(); 
                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    collector.on('collect', message => {
                        if (message.content == token) {
                            sender.send("You are now verified!");
                            userData[sender.id].verified = true;
                            writeData(); 
                            collector.stop();
                            allowedToDM = false;
                        } else {
                            sender.send("Incorrect!")
                            userData[sender.id].verifyCode = 0;
                            writeData(); 
                            collector.stop();
                            allowedToDM = false;
                        }
                    }) 
                } else {
                    message.reply("you already have a token!")
                }
        } 
        } else {
            message.reply(`Command \`${content}\` not found!`)
        }
        break;*/

        case "ban":

        break;

        case "kick":
        var reason = args[1];
        var member = message.guild.member(user);
        var user = message.mentions.users.first();
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send(":no_entry: You can not run this command!");
        }
        break;

        case "warn":
        var guildName = message.guild;
        var user = message.mentions.users.first();
        var member = message.guild.member(user);
        var reason = args[1];
        let role = message.member.hasPermission('ADMINISTRATOR');
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send(":no_entry: You can not run this command!");
            return;
        }
        if (!user) {
            message.channel.send("Please mention a user.");
            return;
        }
        if (!reason) {
            message.channel.send("Please specify a reason to warn" + user.username);
            return;
        }
        user.send(`You have been warned by **<@${message.author.id}>** for **${reason}**`)
        message.author.send("You have warned **" + user + "** " + "for **" + reason + "**")
        if (userData[user.id].warnQty < 3) {
            userData[user.id].warnQty += 1;
            if (userData[user.id].warnQty == 1) {
                userData[user.id].warns.warn1 = reason
                writeData();
            } else if (userData[user.id].warnQty == 2) {
                userData[user.id].warns.warrn2 = reason
            writeData();
        } else {
            userData[user.id].warns.warn3 = reason
            user.send(`You have been kicked from **${guildName.name}** for getting 3 warnings`)
            message.author.send(`User ${user} has been kicked because user reached 3 warnings`)
            member.kick("Reached 3 warns")
            writeData();
        }
        break;
       }
    }
})

function writeGuild() {
    fs.writeFileSync('guildData.json', JSON.stringify(guildData));
}

function writeData() {
    fs.writeFileSync('userData.json', JSON.stringify(userData));
}

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
.listen(PORT, () => console.log(`Listening on ${ PORT }`))