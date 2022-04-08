const express = require('express');
const HTTPS = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/', function (req, res) {
    const query = req.body.cityName;
    const api = "a93d60ffd110ba456db22e7f666909c7";
    const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric&APPID=" + api +"";

    HTTPS.get(weatherURL, function(response){
       // console.log(response);
       // console.log(response.statusCode);
        response.on('data', function(data){
            const weatherData = JSON.parse(data);
            const name = weatherData.name;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            const temp = weatherData.main.temp;
            const tempfeels = weatherData.main.feels_like;
            res.write('<button class="btn btn-primary"><a href="/signup" style="text-decoration: none; margin-bottom: 50px;">sign up</a></button>');
            res.write('<button class="btn btn-primary"><a href="/" style="text-decoration: none; margin-bottom: 50px;">Back</a></button>');
            res.write("<h1>The temperature in " + name + " is " + temp + " Degrees Celcius, but it feels like " + tempfeels + " Degrees Celcius</h1>");
            res.write("<h2>with " + desc + "</h2>");
            res.write("<img src='" + iconURL + "'>");
            res.send();
        });
    });
});

app.get('/signup', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res) {

});

app.listen(3000, function(){
    console.log('server is running');
});