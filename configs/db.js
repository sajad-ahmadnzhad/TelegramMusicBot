let mongoose = require('mongoose')
require('dotenv').config({ path: '../.env' });
mongoose.connect(process.env.URL_DATABASE)
.then(() => console.log('conect to db bot successfully'))
.catch((err) => console.log(err))