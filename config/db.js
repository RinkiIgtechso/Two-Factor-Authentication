const mongoose = require('mongoose');
const DB = process.env.MONGODB_URL;

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log("DATABASE connected")
}).catch((err)=>{
    console.log("err",err);
})