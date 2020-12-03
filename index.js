const Discord = require('discord.js');
const botsettings = require('./botsettings.json');

const bot = new Discord.Client({disableEveryone: true});

require("./util/eventHandler")(bot)

const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);  
        
        });
    });


bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botsettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = message.content.substring(message.content.indexOf(' ')+1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)


    /** DM's a user */
    if(cmd === `${prefix}dm`){
        let user = message.mentions.members.first()
        let msg = args.slice(23)

        user.send(msg)

        const logchannel = message.guild.channels.cache.find(chan => chan.id === "LOG_CHANNEL_ID")
        const logembed = new Discord.MessageEmbed()

        .setTitle("User Got a DM")
        .addFields(
            { name: `Author`, value: `${message.author}`},
            { name: `User`, value: `${user}`},
            { name: `Message`, value: `${msg}`},
        )
        .setColor("RED")
        .setFooter(`${message.guild.name}`)
        logchannel.send(logembed)
    }

        /** DM's a user (Embed) */
        if(cmd === `${prefix}dmembed`){
            let user = message.mentions.members.first()
            let msg = args.slice(23)
            
            const dmembed = new Discord.MessageEmbed()
            .setTitle("Message From Staff")
            .setDescription(msg)
            .setFooter(`- ${message.guild.name}`)
            .setColor("RANDOM")

            user.send(dmembed)

            const logchannel = message.guild.channels.cache.find(chan => chan.id === "LOG_CHANNEL_ID")
            const logembed = new Discord.MessageEmbed()

            .setTitle("User Got a DM")
            .addFields(
                { name: `Author`, value: `${message.author}`},
                { name: `User`, value: `${user}`},
                { name: `Message`, value: `${msg}`},
            )
            .setColor("RED")
            .setFooter(`${message.guild.name}`)
            logchannel.send(logembed)
        }








        /** Logs */
        if(cmd === `${prefix}say`){
            let msg = args.slice(0)
            
            message.channel.send(msg)

            const logchannel = message.guild.channels.cache.find(channel => channel.id === "LOG_CHANNEL_ID")

            /** logchannel.send(`${message.author} Just did the say command! The message was **<${msg}>**`) */

            const logembed = new Discord.MessageEmbed()
            .setTitle("Say Command Done")
            .setColor("RED")
            .setFooter(`${message.guild.name}`)

            .addFields(
                { name: `Command`, value: `Say Command`},
                { name: `Author`, value: `${message.author}`},
                { name: `Message`, value: `${msg}`},
            )
            logchannel.send(logembed)
        }

















        /** Warning Command */

        if(cmd === `${prefix}warn`){
            if(message.member.roles.cache.has("PERMISSION_ROLE")){
            let user = message.mentions.members.first();
            let warning = args.slice(23)

            user.send(`You have been warned in __${message.guild.name}__ for the reason: **${warning}**`)

            const logchannel = message.guild.channels.cache.find(channel => channel.id === "LOG_CHANNEL_ID")
            /** logchannel.send(`The user ${user} just got warned by ${message.author} for the reason **<${warning}>**`) */

            const logembed = new Discord.MessageEmbed()
            .setTitle("User Warned")
            .setColor("RED")
            .setFooter(`- ${message.guild.name}`)
            .addFields(
                { name: `Warned By`, value: `${message.author}`},
                { name: `Warning To`, value: `${user}`},
                { name: `Warning`, value: `${warning}`},
            )
            logchannel.send(logembed)

        } else {
            const logchannel = message.guild.channels.cache.find(channel => channel.id === "LOG_CHANNEL_ID")
            message.reply("You dont have the permissions for this command!")
            logchannel.send(`${message.author} Just tried to do the warn command!`)
        }
    }















        /** Verify System */
        if(message.channel.id === "VERIFY_CHANNEL_ID"){
        if(cmd === `${prefix}verify`){
            message.delete( {timeout: 5000} )
            const verifyrole = message.guild.roles.cache.find(role => role.id === "VERIFY_ROLE_ID")

            message.member.roles.add(verifyrole)
            message.reply("You have been verified and the role have been added to you user!").then(msg => msg.delete( {timeout: 10000} ))

            const logchannel = message.guild.channels.cache.find(channel => channel.id === "LOG_CHANNEL_ID")
            logchannel.send(`The user ${message.author} just verified!`)
            
        }
    }

    /** AdminVerify */
    if(cmd === `${prefix}adminverify`){
        message.delete( {timeout: 5000} )
        if(message.member.roles.cache.has("PERMISSION_ROLE")){
        let user = message.mentions.members.first()
        const verifyrole = message.guild.roles.cache.find(role => role.id === "VERIFY_ROLE_ID")

        user.roles.add(verifyrole)
        message.channel.send(`${user} Was verified by ${message.author}`).then(msg => msg.delete( {timeout: 10000} ))

        const logchannel = message.guild.channels.cache.find(channel => channel.id === "LOG_CHANNEL_ID")
        logchannel.send(`${user} Just got Admin-verified by ${message.author}`)

    } else {
        message.reply("You dont have the permissions for that command!").then(msg => msg.delete( {timeout: 5000} ))
    }
}
























})

bot.login(botsettings.token);