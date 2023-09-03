const { caption } = require("../captions/musicCaption");
let markupSendAudio = (resultdata, findMusic, musicUser) => {
  if (resultdata) {
    var dowloadInBroser = { text: "دانلود در مرورگر", url: resultdata };
  } else {
    dowloadInBroser = {
      text: "دانلود در مرورگر",
      callback_data: "errorDowloadInBroser",
    };
  }
  let data = {
    caption: caption(
      findMusic.name,
      findMusic.singer,
      findMusic.genre,
      findMusic.musicSection
    ),
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "افزودن به علاقه❤️",
            callback_data: findMusic.name,
          },
          dowloadInBroser,
        ],
        [
          { text: "نظرات موزیک", callback_data: "comments" },
          {
            text: "ارسال به دوستان",
            switch_inline_query: musicUser?.musicName,
          },
        ],
      ],
    },
  };
  return data;
};

let markuplistsFavorites = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "حذف کل لیست", callback_data: "deleteAll" },
        { text: "لیست خواننده ها", callback_data: "listSingers" },
      ],
      [
        { text: "حذف موزیک مورد نظر", callback_data: "deleteOne" },
        { text: "بستن لیست", callback_data: "closeFavorites" },
      ],
    ],
  },
};

let addFavorites = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "لیست علاقه مندی ها❤️", callback_data: "listsFavorites" }],
    ],
  },
};

let notFoundMusic = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "درخواست موزیک",
          url: "https://t.me/comments_play_music",
        },
        {
          text: "بیوگرافی خواننده",
          callback_data: "bioSinger",
        },
      ],
      [
        {
          text: "افزودن خواننده به لیست علاقه❤️",
          callback_data: "addSingerToListFavorites",
        },
      ],
    ],
  },
};

let adminpanelMarkaps = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "افزودن موزیک جدید",
          callback_data: "addNewMusic",
        },
        {
          text: "آپدیت موزیک های خواننده",
          callback_data: "updateMusicSinger",
        },
      ],
      [
        {
          text: "افزودن بیوگرافی خواننده",
          callback_data: "addBioSinger",
        },
        {
          text: "حذف موزیک از ربات",
          callback_data: "addBioSinger",
        },
      ],
    ],
  },
};

let backToTaskAdmin = {
  reply_markup: {
    inline_keyboard: [[{ text: "برگشت", callback_data: "backToTaskAdmin" }]],
  },
};

let addSingerToFavorites = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "لیست خواننده های مورد علاقه",
          callback_data: "listSingerFavorites",
        },
        { text: "بستن", callback_data: "closeTextSingerFavorites" },
      ],
    ],
  },
};

let markuplistsFavoritesSinger = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "حذف خواننده مورد نظر",
          callback_data: "deleteOneSingerFavorites",
        },
        {
          text: "حذف کل خواننده ها",
          callback_data: "deleteAllSingerFavorites",
        },
      ],
      [{ text: "بستن", callback_data: "closeListSingerFavorites" }],
    ],
  },
};

let messageDeleteSinger = (namesinger) => {
  let data = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `حذف ${namesinger} از لیست علاقه`,
            callback_data: "deleteSingerFromFavorites",
          },
        ],
      ],
    },
  };
  return data;
};

let goToNewMusicSigner = (singer) => {
  let data = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `رفتن به موزیک های ${singer.nameSinger}`,
            callback_data: `goToNewMusic ${singer.nameSinger}`,
          },
        ],
      ],
    },
  };
  return data;
};

let musicsSinger = (bot, id, result) => {
  return bot.sendMessage(id, `موزیک مورد نظر را انتخاب کنید`, {
    reply_markup: {
      keyboard: result.nameMusicsSinger,
      resize_keyboard: true,
    },
  });
};

let optionsInlineQuery = [
  {
    type: "article",
    id: "1",
    description: "",
    title: "موردی یافت نشد مجدد بررسی کنید",
    input_message_content: {
      message_text: "موردی یافت نشد",
    },
  },
];

module.exports = {
  markupSendAudio,
  markuplistsFavorites,
  // deleteTextMusic,
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
};
