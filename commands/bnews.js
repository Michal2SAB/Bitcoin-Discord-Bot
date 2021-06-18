// Import node-fetch
const fetch2 = require("node-fetch");

// bitcoin news function
module.exports = async function (msg) {
    
    // Specify url and settings for node-fetch
    let url = "http://www.reddit.com/r/bitcoin/new/.json?limit=1";
    let settings = { method: "Get" };
    
    // Create new discord embed message, here because it will be passed to other function later
    const Discord = require('discord.js');
    embed = new Discord.MessageEmbed();
    
    // Keep some variables here for easy access later, in another function
    let author = "";
    let link = "";
    let moreText = "";
    let text = "";
    
    // Request to /r/Bitcoin
    await fetch2(url, settings)
    .then(res => res.json())
    .then(json => {
        
        // Get the newest post and its data
        let data = json['data']['children'][0]['data'];
        let title = data['title'];
        text = data['selftext'];
        
        // If text is longer than 2048, split in two and pass the other half to moreText variable, 
        // discord doesn't allow a longer description for embed message
        if (text.length > 2048) {
            text = text.substring(0, 2048);
            moreText = text.substring(2048);
        }
        
        // More data extracting
        link = data['url'];
        author = data['author'];
        let permaLink = data['permalink'];
        
        // If the post contains only an url, just make text be the url
        if(text === '') {
            text = data['url'];
        }
        
        // Add some parameters to the embed message
        embed.setColor('#ff5500')
        embed.setTitle(title)
        embed.setDescription(text)
        embed.setURL('https://www.reddit.com' + permaLink);
    })
    
    // If soemthing goes wrong, let us know
    .catch(error => {
        console.log("error");
    })
    
    // Get author's avatar link via another function, since it's in a different link
    getAuthorImg(embed, author, msg, moreText, link, text);
};

async function getAuthorImg(embed, name, message, moreText, link, text) {
    
    // Again, specify url and settings for node-fetch
    let url = `https://www.reddit.com/user/${name}/about.json`;
    let settings = { method: "Get" };

    // Request to the user info site
    await fetch2(url, settings)
    .then(res => res.json())
    .then(json => {
        // Extract the user's profile pic link and ignore the extra properties (width, height etc)
        let img = json['data']['subreddit']['icon_img'].split("?width")[0];
        
        // Add author name and set their profile picture in our embed message
        embed.setAuthor(name, img);
    })
    
    // Catch errors if any occur
    .catch(error => {
        console.log(error);
    })
    
    // If moreText isn't empty, the post body was longer than 2048, so we need to follow up previous embed message with a new one
    if (moreText != '') {
        newEmbed = new Discord.MessageEmbed()
        .setColor('#ff5500')
        .setDescription(moreText);
        
        // If link isn't empty, isn't the same as description and doesn't contain the post url (because we don't need that),
        // Add a new field with the attached link
        if( link != '' && !link.includes('reddit.com/r/Bitcoin/comments/') && link != text ) {
            newEmbed.addField("Attached Link", link)
            message.reply(embed);
            message.reply(newEmbed);
        }
    // If moreText is empty, the post body was fewer than 2048 and we can fit it in just one embed message
    } else {
        
        // If link isn't empty, isn't the same as description and doesn't contain the post url (because we don't need that),
        // Add a new field with the attached link
        if( link != '' && !link.includes('reddit.com/r/Bitcoin/comments/') && link != text ) {
            embed.addField("Attached Link", link)
        }
        message.reply(embed);
    }
};
