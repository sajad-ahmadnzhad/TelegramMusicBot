let mongoose = require("mongoose");

let musicModel = mongoose.model("musicModel", {
  name: { type: String, required: true },
  idMusic: { type: String, required: true },
  singer: { type: String, required: true },
  // genre: { type: String, required: true },
  musicSection: { type: String, required: true },
  // textMusic: { type: String , required: true},
});

let nameMusicMarkup = mongoose.model("nameMusicMarkup", {
  nameSinger: { type: String, required: true },
  nameMusicsSinger: { type: Array, required: true },
  photoSinger: { type: String },
  bioSinger: { type: String },
});

let listSingers = mongoose.model("listSingers", {
  messageText: { type: String, required: true },
  nameSingers: { type: Array, required: true },
});

let userFavorites = mongoose.model("userFavorites", {
  userId: { type: Number, required: true },
  infoMusic: { type: Object, required: true },
  firstName: { type: String, required: true },
  userName: { type: String },
});

let comments = mongoose.model("comments", {
  comment: { type: String, require: true },
  userId: { type: Number, required: true },
  firstName: { type: String, required: true },
  userName: { type: String },
  musicName: { type: String, required: true },
  singer: { type: String, required: true },
});

let mySinger = mongoose.model("mySinger", {
  singerName: { type: String, required: true },
  userId: { type: Number, required: true },
  firstName: { type: String, required: true },
  userName: { type: String },
});

let myMusic = mongoose.model("myMusic", {
  musicName: { type: String, required: true },
  userId: { type: Number, required: true },
  firstName: { type: String, required: true },
  userName: { type: String },
});

let singerFavorite = mongoose.model("singerFavorite", {
  userId: { type: Number, required: true },
  nameSinger: { type: String, required: true },
  firstName: { type: String, required: true },
  userName: { type: String },
});

module.exports = {
  musicModel,
  nameMusicMarkup,
  listSingers,
  userFavorites,
  comments,
  mySinger,
  myMusic,
  singerFavorite,
};
