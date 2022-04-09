const express = require('express');
const HTTPS = require('https');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const path = require('path');
const { Http2ServerRequest } = require('http2');
const { parse } = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/public')));

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
            res.write('<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">')
            res.write('<link href="/main.css" rel="stylesheet" type="text/css"></head><body class="text-center"><main class="form-signin"><div class="container"><img class="brand" src="/images/JakeWeather.png" height="150px" width="150px">')
            res.write('<button class="btn btn-lg btn-primary" style="margin-right: 30px;"><a href="/signup" style="color: white; text-decoration: none; margin-bottom: 50px;">sign up</a></button>');
            res.write('<button class="btn btn-lg btn-primary"><a href="/" style="color: white; text-decoration: none; margin-bottom: 50px;">Back</a></button>');
            res.write("<h1 class='h3'>The temperature in " + name + " is " + temp + " Degrees Celcius, but it feels like " + tempfeels + " Degrees Celcius</h1>");
            res.write("<h2 class='h3'>with " + desc + "</h2>");
            res.write("<img src='" + iconURL + "'></div></main></body</html>");
            res.send();
        });
    });
});

app.get('/signup', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res) {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const listID = "22396d9b50";
    const options = {
        method: "POST",
        auth: "jake1:64c35a3eae363d34b6e6a934804751e5-us14"
    };

    const url = 'https://us14.api.mailchimp.com/3.0/lists/' + listID;

   const request =  HTTPS.request(url, options, function(response){
       if (response.statusCode === 200) {
           res.sendFile(__dirname + '/public/pages/success.html');
        } else {
           res.sendFile(__dirname + '/public/pages/failure.html');
       };
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    console.log(firstName, lastName, email);
});

app.listen(process.env.PORT || 3001, function(){
    console.log('server is running');
});
