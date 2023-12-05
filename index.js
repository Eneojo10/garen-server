const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const routes = require('./routes/route.index');
const path = require('path')

const URL ='mongodb+srv://Eneojo10:sundayameh150@cluster0.vuwsg8s.mongodb.net/naval';
// const URL = 'mongodb://localhost:27017/naval';
const PORT = 5000;


mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', () => console.log('Mongodb Connected'));
mongoose.connection.on('error', (e) => console.log(e));


app.use(cors());
app.use(express.json());
app.use('/banner',express.static(path.join(__dirname,'banners')))
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.get('/', function (req, res){
  res.send({ msg: 'Our Api record'});
});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);