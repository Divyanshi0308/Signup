const express=require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https = require("https");

const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})


//APIkey- 0edccb0f8e3ea5f5eb2a64bb91b126ba-us8
//Listid- 333099069f

app.post("/", function(req, res){
  const first= req.body.fname;
  const last= req.body.lname;
  const email= req.body.email;

  console.log(first);

  const data={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first,
          LNAME: last
        }

      }
    ]
  };

  var jsonData= JSON.stringify(data);

  const url= "https://us8.api.mailchimp.com/3.0/lists/333099069f";
  const options={
    method: "POST", 
    auth: "dj3:0edccb0f8e3ea5f5eb2a64bb91b126ba-us8"
  };
  const request = https.request(url, options, function(response){


    response.on("data", function(data){
      console.log(JSON.parse(data));
      
      const parsedJSON= JSON.parse(data);

      if (parsedJSON.error_count !== 0){
        res.sendFile(__dirname+ "/failure.html");
      }else if((response.statusCode === 200)){
        res.sendFile(__dirname+ "/success.html");
      }else{
        res.sendFile(__dirname+ "/failure.html");
      }
    });
    
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
