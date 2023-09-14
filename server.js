const dotenv = require('dotenv');
dotenv.config();

const app = require('express')();
const port = 3000;

// mongodb
require('./config/db');

// For accepting post form data
const bodyParser = require('express').json;

app.use(bodyParser());

const UserRouter = require('./api/User');
app.use("/user", UserRouter);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})