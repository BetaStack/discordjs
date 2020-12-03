const Discord = require('discord.js');
const botsettings = require('./botsettings.json');

const bot = new Discord.Client({disableEveryone: true});

bot.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')
    welcomeChannel.send (`Welcome! ${member}`)
})

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

        const logchannel = message.guild.channels.cache.find(chan => chan.id === "784132161678082048")
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

            const logchannel = message.guild.channels.cache.find(chan => chan.id === "784132161678082048")
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


})

bot.login(botsettings.token);