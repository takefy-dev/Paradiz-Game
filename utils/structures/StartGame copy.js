const Discord = require("discord.js")
const ms = require("ms");
const db = require('quick.db');
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: "shop",
    aliases: ["boutique"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["SEND_MESSAGES" , "VIEW_CHANNEL"],   
    async execute(client, message, args, data) {
      let money = await db.get(`money_${message.guild.id}_${message.author.id}`)
      if(money === null ) money = 0
      filter = (reaction, user) => ["helmet", "mcqueen", "tesla", "🏠","🚘","🏡","🏚️","chestplate","pants","boots","volkswagen"].includes(reaction.emoji.name) && user.id === message.author.id,
      dureefiltrer = response => { return response.author.id === message.author.id };

// case vila etc
// masini
// Haine

      const embed = new Discord.MessageEmbed()
      .setAuthor('Boutique d\'items de '+message.guild.name, "https://media.discordapp.net/attachments/849036131205906503/849336538809630730/shopimg.png")
      .addField(`Maisons:`, `🏠・Acheter une **Petite maison ** pour \`50.000 coins\`\n🚘・Acheter un **Garage** pour \`25.000 coins\`\n🏪・Acheter une **Maison avec Jardin** pour \`300.000 coins\`\n🏚️・Acheter une **Ville** pour \`550.000 coins\``)
      .addField(`Voitures:`, `<:volkswagen:912350532717379634>・Acheter une **Volkswagen** pour \`25.000 coins\`\n<:tesla:912350173789847603>・Acheter une **Tesla** pour \`70.000 coins\`\n<:mcqueen:912350223592996895>・Acheter un **Flash McQueen ** pour \`300.000 coins\``)
      .addField(`Armure:`, `<:helmet:912343457127866408>・Acheter un **Casque** pour \`350\`\n<:chestplate:912343394846658620>・Acheter un **Plastron** pour \`800 coins\`\n<:pants:912343328392093736>・Acheter un **Pantalon** pour \`700 coins\`\n<:boots:912343297366827088>・Acheter des **Bottes** pour \`300 coins\``)

       .setColor('#2F3136')
      const embed2 = new Discord.MessageEmbed()
  //  .setAuthor('Boutique d\'items de '+message.guild.name, "https://media.discordapp.net/attachments/849036131205906503/849336538809630730/shopimg.png")
    .addField(`Armure:`, `<:helmet:912343457127866408>・Acheter une **Casque** pour \`350\`\n<:chestplate:912343394846658620>・Acheter une **Plastron** pour \`800 coins\`\n<:pants:912343328392093736>・Acheter une **Pantalon** pour \`700 coins\`\n<:boots:912343297366827088>・Acheter des **Bottes** pour \`300 coins\``)
       .setColor('#2F3136')
    const embed3 = new Discord.MessageEmbed()
  //  .setAuthor('Boutique d\'items de '+message.guild.name, "https://media.discordapp.net/attachments/849036131205906503/849336538809630730/shopimg.png")
    .addField(`Voitures:`, `<:volkswagen:912350532717379634>・Acheter une **Volkswagen** pour \`8.000 coins\`\n<:tesla:912350173789847603>・Acheter une **Tesla** pour \`30.000 coins\`\n<:mcqueen:912350223592996895>・Acheter une **Flash McQueen ** pour \`100.000 coins\``)
       .setColor('#2F3136')
  //   embed.setTimestamp()
 //      .setColor('#2F3136')
  //   embed.setFooter(client.user.username)
           message.channel.send(embed).then( async (m) => {
await m.react("🏠")
await m.react("🚘")
await m.react("🏡")
await m.react("🏚️")
await m.react("<:helmet:912343457127866408>")
await m.react("<:chestplate:912343394846658620>")
await m.react("<:pants:912343328392093736>")
await m.react("<:boots:912343297366827088>")
await m.react("<:volkswagen:912350532717379634>")
await m.react("<:tesla:912350173789847603>")
await sleep(250);
await m.react("<:mcqueen:912350223592996895>")

const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on("collect", async (reaction, user) => {
if (reaction._emoji.name === "🏠") {
  if(db.get(`petite_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`Petite maison\` !")
              if(money<=50000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Petite maison\` !")
                if(db.get(`petite_${message.guild.id}_${message.author.id}`) === null) {
              db.set(`petite_${message.guild.id}_${message.author.id}`, true)
db.subtract(`money_${message.guild.id}_${message.author.id}`, 50000)
await message.channel.send("Vous avez acheter un **Petite maison** à \`50000 coins\`")
                 
            } 
                }
                if (reaction._emoji.name === "🚘") {
if(db.get(`gara_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`garage\` !")
if(money<25000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`garage\` !")

if(db.get(`gara_${message.guild.id}_${message.author.id}`) === null) {
                db.set(`gara_${message.guild.id}_${message.author.id}`, true)
  db.subtract(`money_${message.guild.id}_${message.author.id}`, 25000)
  await message.channel.send("Vous avez acheter un \`garage\` à \`25000 coins\`")}
                }
                if (reaction._emoji.name === "🏡") {
if(db.get(`jardin_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`maison avec jardin\` !")
if(money<300.00) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`maison avec jardin\` !")

if(db.get(`jardin_${message.guild.id}_${message.author.id}`) === null) {
                db.set(`jardin_${message.guild.id}_${message.author.id}`, true)
  db.subtract(`money_${message.guild.id}_${message.author.id}`, 300.00)
  await message.channel.send("Vous avez acheter un \`maison avec jardin\` à \`100000 coins\`")}
                }
                if (reaction._emoji.name === "🏚️") {
if(db.get(`ville_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà une \`ville\` !")
if(money<550000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour une \`ville\` !")

if(db.get(`ville_${message.guild.id}_${message.author.id}`) === null) {
                db.set(`ville_${message.guild.id}_${message.author.id}`, true)
  db.subtract(`money_${message.guild.id}_${message.author.id}`, 550000)
  await message.channel.send("Vous avez acheter un \`Ville\` à \`550000 coins\`")}
                }
             
                if (reaction._emoji.name === "helmet") {
                  if(db.get(`helmet_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`Casque \` !")
                              if(money<350) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Casque \` !")
                                if(db.get(`helmet_${message.guild.id}_${message.author.id}`) === null) {
                              db.set(`helmet_${message.guild.id}_${message.author.id}`, true)
                db.subtract(`money_${message.guild.id}_${message.author.id}`, 350)
                await message.channel.send("Vous avez acheter un **Casque ** à \`350 coins\`")
                                 
                            } 
                                }
                                if (reaction._emoji.name === "chestplate") {
                if(db.get(`chestplate_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`Plastron \` !")
                if(money<800) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Plastron \` !")
                
                if(db.get(`chestplate_${message.guild.id}_${message.author.id}`) === null) {
                                db.set(`chestplate_${message.guild.id}_${message.author.id}`, true)
                  db.subtract(`money_${message.guild.id}_${message.author.id}`, 800)
                  await message.channel.send("Vous avez acheter un \`Plastron \` à \`800 coins\`")}
                                }
                                if (reaction._emoji.name === "pants") {
                if(db.get(`pants_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`Pantalon\` !")
                if(money<700) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Pantalon\` !")
                
                if(db.get(`pants_${message.guild.id}_${message.author.id}`) === null) {
                                db.set(`pants_${message.guild.id}_${message.author.id}`, true)
                  db.subtract(`money_${message.guild.id}_${message.author.id}`, 700)
                  await message.channel.send("Vous avez acheter un \`Pantalon\` à \`700 coins\`")}
                                }
                                if (reaction._emoji.name === "boots") {
                if(db.get(`boots_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà une \`Bottes\` !")
                if(money<300) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Bottes\` !")
                
                if(db.get(`boots_${message.guild.id}_${message.author.id}`) === null) {
                                db.set(`boots_${message.guild.id}_${message.author.id}`, true)
                  db.subtract(`money_${message.guild.id}_${message.author.id}`, 300)
                  await message.channel.send("Vous avez acheter un \`Bottes\` à \`300 coins\`")}
                                }

                                if (reaction._emoji.name === "volkswagen") {
                                  if(db.get(`volkswagen_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`volkswagen \` !")
                                              if(money<25000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`volkswagen \` !")
                                                if(db.get(`volkswagen_${message.guild.id}_${message.author.id}`) === null) {
                                              db.set(`volkswagen_${message.guild.id}_${message.author.id}`, true)
                                db.subtract(`money_${message.guild.id}_${message.author.id}`, 25000)
                                await message.channel.send("Vous avez acheter un \`Volkswagen\` à \`25000 coins\`")
                                                 
                                            } 
                                                }
                                                if (reaction._emoji.name === "tesla") {
                                if(db.get(`tesla_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà une \`Tesla \` !")
                                if(money<70000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour une \`Tesla \` !")
                                
                                if(db.get(`tesla_${message.guild.id}_${message.author.id}`) === null) {
                                                db.set(`tesla_${message.guild.id}_${message.author.id}`, true)
                                  db.subtract(`money_${message.guild.id}_${message.author.id}`, 70000)
                                  await message.channel.send("Vous avez acheter une \`Tesla \` à \`70000 coins\`")}
                                                }
                                                if (reaction._emoji.name === "mcqueen") {
                                if(db.get(`mcqueen_${message.guild.id}_${message.author.id}`) === true) return await message.channel.send("\`ERREUR\`Vous avez déjà un \`Flashe McQueen\` !")
                                if(money<100000) return await message.channel.send("\`ERREUR\`Vous n'avez assez de coins en poche pour un \`Flashe McQueen\` !")
                                
                                if(db.get(`mcqueen_${message.guild.id}_${message.author.id}`) === null) {
                                                db.set(`mcqueen_${message.guild.id}_${message.author.id}`, true)
                                  db.subtract(`money_${message.guild.id}_${message.author.id}`, 100000)
                                  await message.channel.send("Vous avez acheter un \`FlasheMcQueen\` à \`100000 coins\`")}
                                                }

              await reaction.users.remove(message.author.id);
                
               })})
    
    }
}