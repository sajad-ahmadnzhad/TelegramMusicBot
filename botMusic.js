let telegrambot = require("node-telegram-bot-api");
let musicCaption = require("./captions/musicCaption");
let messages = require("./messagesBot/messages");
require('dotenv').config()
let token = process.env.BOT_TOKEN;
let bot = new telegrambot(token, { polling: true });

let {
  musicModel,
  nameMusicMarkup,
  listSingers,
  userFavorites,
  comments,
  mySinger,
  myMusic,
  singerFavorite,
} = require("./models/musicModel");
require("./configs/db");
const {
  markupSendAudio,
  markuplistsFavorites,
  addFavorites,
  notFoundMusic,
  adminpanelMarkaps,
  backToTaskAdmin,
  addSingerToFavorites,
  markuplistsFavoritesSinger,
  messageDeleteSinger,
  goToNewMusicSigner,
  musicsSinger,
  optionsInlineQuery,
} = require("./replayMarkups/markupData");
// Response to the start command sent
let fs = require("fs");
bot.onText(/\/start/, async (message) => {
  bot.sendChatAction(message.from.id, "typing");
  bot.sendMessage(
    message.chat.id,
    messages.messageStartBot(message.from.first_name),
    messages.replyMarkupStart
  );
});
// on bot
bot.on("message", async (message) => {
  let id = message.chat.id;
  let user = `fristName: ${message.from.first_name} userName: ${message.from.username} text: ${message.text}`;
  console.log(user);
  let msg = message.text;
  let re = /✅/g;
  let reMessage = /حذف/g;
  let caption = message?.caption;

  if (!caption && message.audio) {
    console.log("caption not found", message?.audio?.title);
  }
  if (message.audio && id == 1088935787 && caption?.length < 40) {
    let index = 2;
    let resultCaption = caption.split(" ")[0];
    if (resultCaption == 3 || resultCaption == 1) {
      index = +resultCaption;
      caption = caption.replace(resultCaption, "").trim();
    }

    let nameSinger = caption.split(" ").slice(0, index).join(" ");
    let nameMusic = caption.split(" ").slice(index).join(" ");

    let checkData = await musicModel.find({
      name: nameMusic,
      singer: nameSinger,
    });
    if (checkData.length) return;
    fs.writeFileSync("addMusic&Singer/musicName.txt", `${nameMusic}\n`, { flag: "a" });
    fs.writeFileSync("addMusic&Singer/singerName.txt", `${nameSinger}`);
    await musicModel.create({
      name: nameMusic,
      singer: nameSinger,
      idMusic: message.audio.file_id,
      musicSection: "00:00",
    });
  }
  if (message?.text == "save" && id == 1088935787) {
    const result = [];
    let backToListSingers = "برگشت به لیست خواننده ها";
    let musics = fs.readFileSync("addMusic&Singer/musicName.txt").toString().trim().split("\n");
    let singername = fs.readFileSync("addMusic&Singer/singerName.txt").toString();
    if (!musics || !singername) return bot.sendMessage(id, "value is empty");
    for (let i = 0; i < musics.length; i += 2) {
      if (musics[i + 1]) {
        result.push([musics[i], musics[i + 1]]);
      } else {
        result.push([musics[i], backToListSingers]);
      }
    }

    let resultBackTolist = result.flat(Infinity).includes(backToListSingers);

    if (!resultBackTolist) result.push([backToListSingers]);

    await nameMusicMarkup.create({
      nameSinger: singername,
      nameMusicsSinger: result,
    });

    fs.writeFileSync("addMusic&Singer/musicName.txt", "");
    fs.writeFileSync("addMusic&Singer/singerName.txt", "");
    bot.sendMessage(id, "saved Musics " + singername + " sucessfully");
  }

  if (message?.text == "update" && id == 1088935787) {
    const result = [];
    let musics = fs.readFileSync("addMusic&Singer/musicName.txt").toString().trim().split("\n");
    let singerName = fs.readFileSync("addMusic&Singer/singerName.txt").toString();
    if (!musics || !singerName) return bot.sendMessage(id, "value is empty");
    for (let i = 0; i < musics.length; i += 2) {
      if (musics[i + 1]) {
        result.push([musics[i], musics[i + 1]]);
      } else {
        result.push([musics[i]]);
      }
    }
    let lengthMusic = 0;
    for (const item of result) {
      lengthMusic += item.length;
      var dataMarkups = await nameMusicMarkup.updateMany(
        { nameSinger: singerName },
        { $push: { nameMusicsSinger: { $each: [item], $position: 0 } } }
      );
    }

    let alertUser = await singerFavorite.find({
      nameSinger: singerName,
    });
    let music = result.flat(Infinity).join("\n");
    if (alertUser.length) {
      let text = `از خواننده مورد علاقه شما ${singerName} ${lengthMusic} موزیک به ربات اضافه شد:
${music}\n\nجهت رفتن به موزیک های ${singerName} بر روی دکمه پایین کلیک کنید.`;
      alertUser.forEach((singer) =>
        bot.sendMessage(singer.userId, text, goToNewMusicSigner(singer))
      );
    }

    console.log(dataMarkups);

    fs.writeFileSync("addMusic&Singer/musicName.txt", "");
    fs.writeFileSync("addMusic&Singer/singerName.txt", "");

    bot.sendMessage(
      id,
      "updated Musics Singer: " + singerName + " sucessfully"
    );
  }

  let addUser = ["دعوت دوستان", "/invitefriends"];
  if (addUser.includes(message?.text)) {
    bot.sendMessage(id, "لطفا مخاطب مورد نظر خود را انتخاب کنید", {
      reply_markup: {
        keyboard: [
          [
            { text: "دعوت مخاطب", request_user: { request_id: id } },
            { text: "برگشت به لیست خواننده ها" },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  if (message.user_shared) {
    let findUser = await mySinger.findOne({
      userId: message.user_shared.user_id,
    });

    if (findUser) {
      return bot.sendMessage(
        id,
        `کاربر با آیدی عددی ${message.user_shared.user_id} از قبل عضو این ربات است`
      );
    } else {
      bot.sendMessage(
        message.user_shared.user_id,
        `کاربر ${message.from.first_name} شما را به ربات دعوت کرد`
      );
    }
  }
  if (message.text == "✅") return;
  else if (message.text && message.text.match(reMessage)) {
    let reMatch = message.text.replace(/حذف/g, "").trim();
    let nameSinger = reMatch.split(" ").slice(0, 2).join(" ");
    let musciName = reMatch.split(" ").slice(2).join(" ");
    let findDataFavorites = await userFavorites.findOneAndDelete({
      "infoMusic.name": { $in: [musciName] },
      "infoMusic.singer": { $in: [nameSinger] },
      userId: id,
    });
    if (findDataFavorites) {
      let text = `موزیک ${reMatch.trim()} از لیست علاقه مندی ها با موفقیت حذف شد✅`;
      bot.sendMessage(id, text);
    } else {
      let text = "این موزیک در لیست علاقه شما وجود ندارد لطفا مجدد چک کنید⚠️";
      bot.sendMessage(id, text);
    }
  }

  let findData = await mySinger.find({}).lean();
  findData.map(async (item) => {
    if (item && item.userId == id) {
      let findMusic = await musicModel.findOne({
        name: message.text,
        singer: item.singerName,
      });
      //Send the desired music to the user
      if (findMusic) {
        try {
          var resultdata = await bot.getFileLink(findMusic.idMusic);
        } catch (e) {}

        await myMusic.deleteOne({ userId: id });
        await myMusic.create({
          musicName: message.text,
          userId: id,
          firstName: message.from.first_name,
          userName: message.from.username,
        });

        let musicUser = await myMusic.findOne({ userId: id });

        bot.sendChatAction(id, "upload_document");
        bot.sendAudio(
          id,
          findMusic.idMusic,
          markupSendAudio(resultdata, findMusic, musicUser)
        );
      }
    }
  });
  //add comments
  if (message.text && message.text.match(re)) {
    let data = await myMusic.findOne({ userId: id });
    let singerData = await mySinger.findOne({ userId: id });
    let rejexData = message.text.replace(/✅/g, "");
    if (!data) return;
    bot.sendMessage(
      id,
      `نظر شما با موفقیت به موزیک "${data.musicName}" افزوده شد`
    );

    await comments.create({
      comment: rejexData,
      userId: id,
      firstName: message.from.first_name,
      userName: message.from.username,
      musicName: data.musicName,
      singer: singerData.singerName,
    });
  }
  let singerMarkups = await nameMusicMarkup.findOne({ nameSinger: msg });

  if (singerMarkups) {
    let singerData = await singerFavorite.findOne({
      userId: id,
      nameSinger: msg,
    });
    if (singerData) {
      await singerFavorite.deleteOne({ userId: id, nameSinger: msg });

      let text = `خواننده "${singerData.nameSinger}" با موفقیت از لیست علاقه حذف شد✅`;
      bot.sendMessage(id, text);
    } else {
      let text = `${msg} در لیست علاقه وجود ندارد لطفا مجدد چک کنید`;
      bot.sendMessage(id, text);
    }
  }

  //check commands or message and reply
  let goTolistSingers = [
    "/listsingers",
    "لیست خواننده ها",
    "برگشت به لیست خواننده ها",
  ];
  let adminpanel = ["/adminpanel", "پنل مدیر"];
  if (msg == "/help" || msg == "پشتیبانی") {
    bot.sendMessage(id, messages.help);
  } else if (msg == "/aboutme" || msg == "درباره ما") {
    bot.sendMessage(id, messages.aboutme);
  } else if (goTolistSingers.includes(msg)) {
    let find = await listSingers.findOne({});
    bot.sendMessage(id, "خواننده مورد نظر را انتخاب کنید", {
      reply_markup: { inline_keyboard: find.nameSingers },
    });
  } else if (msg == "/favoritesmusic" || msg == "موزیک های مورد علاقه") {
    favorites(id, message);
  } else if (adminpanel.includes(msg) && id == 1088935787) {
    bot.sendMessage(id, "به پنل خود خوش آمدید", adminpanelMarkaps);
  } else if (adminpanel.includes(msg) && id !== 1088935787) {
    bot.sendMessage(id, "شما ادمین ربات نیستید");
  } else if (msg == "خواننده های مورد علاقه" || msg == "/favoritessinger") {
    favoritesSingers(id, message);
  }
});

// Go to the list of favorites and check the user's input
let favorites = async (id, ctx) => {
  let result = await userFavorites.find({ userId: id });
  let names = "";
  result.forEach((item) => {
    names += `${item.infoMusic.singer}: ${item.infoMusic.name} \n`;
  });
  if (!names) {
    let text = `کاربر ${ctx.from.first_name} شما هیچ موزیکی به لیست علاقه مندی ها اضافه نکرده اید`;
    bot.sendMessage(id, text);
    return;
  }
  if (ctx.text !== "/favoritesmusic" && ctx.text !== "موزیک های مورد علاقه")
    await bot.deleteMessage(id, ctx.message_id);
  bot.sendMessage(
    id,
    `لیست موزیک های پسندیده شده توسط شما: \n${names}`,
    markuplistsFavorites
  );
};

let favoritesSingers = async (id, ctx) => {
  let array = ["خواننده های مورد علاقه", "/favoritessinger"];
  if (!array.includes(ctx.text)) {
    bot.deleteMessage(id, ctx.message_id);
  }
  let findData = await singerFavorite.find({ userId: id });
  let text = "خواننده های مورد علاقه شما:\n";
  findData.forEach((singer) => {
    text += `${singer.nameSinger}\n`;
  });
  if (findData.length) {
    bot.sendMessage(id, text, markuplistsFavoritesSinger);
  } else {
    let text = "شما هنوز هیچ خواننده ای را به لیست علاقه اضافه نکرده اید.";
    bot.sendMessage(id, text);
  }
};

bot.on("callback_query", async (ctx) => {
  let id = ctx.from.id;
  let data = ctx.data;
  bot.answerCallbackQuery(ctx.id);
  ctx.data = ctx.data.trim();
  let result = await nameMusicMarkup.findOne({ nameSinger: data });

  if (result) {
    await mySinger.deleteOne({ userId: id });

    await mySinger.create({
      singerName: result.nameSinger,
      userId: id,
      firstName: ctx.from.first_name,
      userName: ctx.from.username,
    });

    bot.answerCallbackQuery(ctx.id);
    try {
      await bot.deleteMessage(id, ctx.message.message_id);
    } catch (e) {
      return console.log(e);
    }
    await musicsSinger(bot, id, result);
    await bot.sendMessage(
      id,
      `اگر موزیک خود را نیافتید درخواست کنید`,
      notFoundMusic
    );
  }

  let dataNameSigner = data.split(" ");

  if (dataNameSigner[0] == "goToNewMusic") {
    bot.deleteMessage(id, ctx.message.message_id);
    let markupNameSinger = await nameMusicMarkup.findOne({
      nameSinger: dataNameSigner.slice(1).join(" "),
    });

    if (!markupNameSinger) return bot.sendMessage(id, "خواننده پیدا نشد");

    musicsSinger(bot, id, markupNameSinger);
  }
});
bot.on("callback_query", async (ctx) => {
  let id = ctx.from.id;
  let data = ctx.data;
  let message = `callback: fristName: ${ctx.from.first_name} lastName: ${ctx.from.username} data: ${data}`;
  console.log(message);

  let close = [
    "deleteBio",
    "closeTextSingerFavorites",
    "closeFavorites",
    "closeComments",
    "closeListSingerFavorites",
  ];

  let mySingerUser = await mySinger.findOne({ userId: id });
  if (mySingerUser) {
    var resultData = await userFavorites.findOne({
      "infoMusic.name": { $in: [data] },
      "infoMusic.singer": { $in: [mySingerUser.singerName] },
      userId: id,
    });
  }
  //Checking the database for the similarity of the name of the user's music
  if (resultData) {
    bot.sendChatAction(id, "typing");
    let text = `کاربر ${ctx.from.first_name} موزیک "${resultData.infoMusic.name}" از قبل در لیست علاقه مندی ها وجود دارد`;
    let sendmsg = await bot.sendMessage(id, text);
    setTimeout(() => {
      bot.deleteMessage(id, sendmsg.message_id);
    }, 10000);
    return;
  }
  //Add to favorites
  if (mySingerUser) {
    var findData = await musicModel.findOne({
      name: data,
      singer: mySingerUser.singerName,
    });
  }

  if (findData) {
    bot.sendChatAction(id, "typing");
    let text = `موزیک "${findData.name}" از خواننده "${findData.singer}" به لیست علاقه مندی ها افزوده شد`;
    bot.sendMessage(id, text, addFavorites);

    await userFavorites.insertMany({
      userId: id,
      infoMusic: findData,
      firstName: ctx.from.first_name,
      userName: ctx.from.username,
    });
  } else if (data == "listsFavorites") {
    //go to lists favorites
    favorites(id, ctx.message);
  } else if (data == "deleteAll") {
    //Delete all music with the user's permission
    await userFavorites.deleteMany({ userId: id });
    bot.deleteMessage(id, ctx.message.message_id);
    bot.sendChatAction(id, "typing");
    let msg = await bot.sendMessage(id, "لیست موزیک با موفقیت پاک سازی شد");
    setTimeout(() => bot.deleteMessage(id, msg.message_id), 5000);
  } else if (data == "listSingers") {
    //Go to singers list
    bot.sendChatAction(id, "typing");
    bot.answerCallbackQuery(ctx.id);
    bot.deleteMessage(ctx.from.id, ctx.message.message_id);
    let singers = await listSingers.findOne({});
    bot.sendMessage(id, "خواننده مورد نظر خود را انتخاب کنید", {
      reply_markup: {
        inline_keyboard: singers.nameSingers,
      },
    });
  } else if (data == "comments") {
    bot.sendChatAction(id, "typing");

    let musciData = await myMusic.findOne({ userId: id }).lean();
    let singerData = await mySinger.findOne({ userId: id }).lean();
    let findComments = await comments
      .find({
        musicName: musciData.musicName,
        singer: singerData.singerName,
      })
      .lean();
    let listComments = "";
    findComments.forEach((item) => {
      if (item.userName) {
        listComments += `کاربر @${item.userName} نظر داد: \n${item.comment}\n\n`;
      } else {
        listComments += `کاربر ${item.firstName} نظر داد: \n${item.comment}\n\n`;
      }
    });
    if (listComments) {
      bot.sendMessage(id, listComments, messages.replyMarkupConments(ctx));
    } else {
      let text = "هنوز هیچ نظری قرار گرفته نشده است";
      bot.sendMessage(id, text, messages.replyMarkupConments(ctx));
    }
  } else if (data == "addComment") {
    bot.editMessageText(messages.addCommentMessage, {
      chat_id: id,
      message_id: ctx.message.message_id,
    });
    await myMusic.findOne({ userId: id }).lean();
  } else if (data == "deleteOne") {
    bot.sendMessage(id, messages.nameMusicDelete);
  } else if (data == "gotToNext") {
    let listSingersNext = await listSingers.findById(
      "64c6164b5cad63be0672ed98"
    );
    bot.editMessageReplyMarkup(
      { inline_keyboard: listSingersNext.nameSingers },
      { chat_id: id, message_id: ctx.message.message_id }
    );
  } else if (data == "backToListSingers") {
    let backToListSingers = await listSingers.findById(
      "64c616345cad63be0672ed97"
    );
    bot.editMessageReplyMarkup(
      { inline_keyboard: backToListSingers.nameSingers },
      { chat_id: id, message_id: ctx.message.message_id }
    );
  } else if (data == "errorDowloadInBroser") {
    let text =
      "متاسفانه به دلیل حجم بالای موزیک امکان دانلود از مرورگر فراهم نیست";
    let msg = await bot.sendMessage(id, text);
    setTimeout(() => bot.deleteMessage(id, msg.message_id), 10000);
  } else if (data == "bioSinger") {
    let singer = await mySinger.findOne({ userId: id });

    let singerbio = await nameMusicMarkup.findOne({
      nameSinger: singer.singerName,
    });

    bot.sendPhoto(id, singerbio.photoSinger, {
      caption: singerbio.bioSinger,
      reply_markup: {
        inline_keyboard: [[{ text: "حذف", callback_data: "deleteBio" }]],
      },
    });
  } else if (data == "updateMusicSinger") {
    messages.taskAdmin(
      bot,
      messages.messageUpdateMusic,
      backToTaskAdmin.reply_markup,
      ctx.message.message_id,
      id
    );
  } else if (data == "addNewMusic") {
    messages.taskAdmin(
      bot,
      messages.messageAddedMusic,
      backToTaskAdmin.reply_markup,
      ctx.message.message_id,
      id
    );
  } else if (data == "backToTaskAdmin") {
    messages.taskAdmin(
      bot,
      "به پنل خود خوش آمدید",
      adminpanelMarkaps.reply_markup,
      ctx.message.message_id,
      id
    );
  } else if (data == "addSingerToListFavorites") {
    let mySingerData = await mySinger.findOne({ userId: id });

    let checkUserToDB = await singerFavorite.findOne({
      userId: id,
      nameSinger: mySingerData.singerName,
    });

    if (checkUserToDB) {
      let text = `${checkUserToDB.nameSinger} از قبل در لیست علاقه وجود دارد.`;
      let reply = messageDeleteSinger(checkUserToDB.nameSinger);
      let msg = await bot.sendMessage(id, text, reply);
      return;
    }

    await singerFavorite.create({
      userId: id,
      nameSinger: mySingerData.singerName,
      firstName: ctx.from.first_name,
      userName: ctx.from.username,
    });

    let text = `"${mySingerData.singerName}" با موفقیت به لیست علاقه اضافه گردید✅
از این لحظه به بعد اگر موزیکی از "${mySingerData.singerName}" به ربات اضافه شود به شما اطلاع رسانی میکنیم.
    `;
    bot.sendMessage(id, text, addSingerToFavorites);
  } else if (close.includes(data)) {
    try {
      bot.deleteMessage(id, ctx.message.message_id);
    } catch (e) {}
  } else if (data == "listSingerFavorites") {
    favoritesSingers(id, ctx.message);
  } else if (data == "deleteSingerFromFavorites") {
    let mySingerData = await mySinger.findOne({ userId: id });
    await singerFavorite.deleteOne({
      userId: id,
      nameSinger: mySingerData.singerName,
    });
    let text = `${mySingerData.singerName} با موفقیت از لیست علاقه حذف شد`;
    bot.editMessageText(text, {
      message_id: ctx.message.message_id,
      chat_id: id,
    });
  } else if (data == "deleteAllSingerFavorites") {
    bot.deleteMessage(id, ctx.message.message_id);
    let dataDeleted = await singerFavorite.deleteMany({ userId: id });
    if (dataDeleted.deletedCount) {
      bot.sendMessage(id, "لیست خواننده های مورد علاقه با موفقیت پاکسازی شد");
    } else {
      let text = "شما هنوز هیچ خواننده را به لیست علاقه اضافه نکرده اید";
      bot.sendMessage(id, text);
    }
  } else if (data == "deleteOneSingerFavorites") {
    bot.sendMessage(id, messages.deleteOneSinger);
  }
});

bot.on("inline_query", async (query) => {
  let findMusic = await musicModel.find({ name: query.query }).lean();
  let array = [];
  if (findMusic.length) {
    let idNumber = 0;
    findMusic.forEach((item) => {
      let result = {
        type: "audio",
        audio_file_id: item.idMusic,
        caption:
          musicCaption.caption(item.name, item.singer, "", item.musicSection) +
          "\n@Play_MusicBot_bot",
        id: idNumber++,
      };
      array.push(result);
    });
    bot.answerInlineQuery(query.id, array);
  } else if (query.query.trim() && !findMusic.length) {
    bot.answerInlineQuery(query.id, optionsInlineQuery);
  }
});
