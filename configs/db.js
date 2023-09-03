let mongoose = require('mongoose')

mongoose.connect('mongodb://root:IeOerGiayFRTiOAPrv6JC4fy@aberama.iran.liara.ir:32114/mongoBot?authSource=admin' && 'mongodb://0.0.0.0:27017/BotTelegarm')
.then(() => console.log('conect to db bot successfully'))
.catch((err) => console.log(err))


