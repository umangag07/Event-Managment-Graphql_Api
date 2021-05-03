const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();

app.use(bodyParser.json());

app.get('/',(req,res,)=>{
    res.send({m:'hello'});
});

app.listen(process.env.PORT);

