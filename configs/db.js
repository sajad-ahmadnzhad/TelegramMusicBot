let mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/BotTelegarm')
.then(() => console.log('conect to db bot successfully'))
.catch((err) => console.log(err))


