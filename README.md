<h1 align="center"><a href="https://t.me/Play_MusicBot_bot">Telegram Music Bot</a></h1>
<p align="center">
<img height="400px" width="700px" src="https://github.com/sajad-ahmadnzhad/TelegramMusicBot/blob/master/img/profileBotMusic.jpg?raw=true"/>
</p>

<h1>
 An advanced Telegram music bot with a variety of singers developed with the <a href="https://github.com/yagop/node-telegram-bot-api">node-telegram-bot-api </a> library
</h1>

<h2>⚠️ Music bot is not yet deployed on the server, it will be deployed soon</h2>

<br/>
<h1>What capabilities does this robot have?</h1>

- User's favorite music list
- Adding a reader to the list of favorites by the user
- Invite friends to the bot
- Robot music management panel by the manager
- Send music to friends
- Get biographies of singers
- Music request if the desired music is not found
- Online music search
- Etc ....

<br/>

<h1>What libraries are used in this robot?</h1>

- <a href="https://github.com/yagop/node-telegram-bot-api">node-telegram-bot-api</a>
- <a href="https://github.com/Automattic/mongoose">mongoose</a>
- <a href="https://github.com/remy/nodemon">nodemon</a>
<br/>
<h1>Databases used in this robot:</h1>

- <a href="https://github.com/mongodb/mongo">mongodb</a>



<h1>How to install node-telegram-bot-api library</h1>

```
npm i -g node-telegram-bot-api
```

<h1>How node-telegram-bot-api works</h1>

```js
let telegrambot = require("node-telegram-bot-api");
// You need to get the bot token from botfather in Telegram
let token = "Your bot token";

let bot = new telegrambot(token, { poling: true });

bot.onText(/\/start/ , (msg) => {
  let chatId = msg.chat.id
  bot.sendMessage(chatId , "welcome to bot")
})

bot.on("message", (msg) => {
  let chatId = msg.chat.id;

  let replyMarkup = {
    inline_keyboard: [
      [
        { text: "click To button 1", callback_data: "click 1" },
        { text: "click To button 2", callback_data: "click 2" },
      ],
    ],
  };

  if (msg.text == "list") {
    bot.sendMessage(chatId,`Hello ${msg.from.first_name} welcome to bot`, {reply_markup: replyMarkup});
  }

});

bot.on("callback_query", (msg) => {
  let data = msg.data;
  let chatId = msg.from.id;
  if (data == "click 1") {
    bot.sendMessage(chatId, "Option 1 was clicked");
  } else if (data == "click 2") {
    bot.sendMessage(chatId, "Option 2 was clicked");
  }
});
```

<h1>output</h1>
<p align="center">
    <img src="https://github.com/sajad-ahmadnzhad/TelegramMusicBot/blob/master/img/messageBot.jpg?raw=true" />
</p>

