module.exports.run = async (bot, message, args) => {
    return message.channel.send("Hello")
}

module.exports.config = {
    name: "hi",
    description: ""
}