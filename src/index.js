const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://kajolshrivastava:mongo%401999@cluster0.hzs17.mongodb.net/BOOK-db", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

// app.use (
//     function (req, res, next) {
//         console.log ("inside GLOBAL MW");
//         next();
//   }
//   );

app.use('/', route);


app.listen(process.env.PORT || 6000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 6000))
});
