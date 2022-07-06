//We're using the express framework and the mailgun-js wrapper2
var express = require('express');
var Mailgun = require('mailgun-js');
//init express5
var app = express();
//Your api key, from Mailgun’s Control Panel8
var api_key = 'MAILGUN-API-KEY';
//Your domain, from the Mailgun Control Panel11
var domain = 'YOUR-DOMAIN.com'; //Your sending email address14
var from_who = 'your@email.com';
//Tell express to fetch files from the /js directory17
app.use(express.static(__dirname + '/js'));
//We're using the Jade templating language because it's fast and neat19
app.set('view engine', 'jade');
//Do something when you're landing on the first page22
app.get('/', function (_req: Express.Request, res: Express.Response) {
  //render the index.jade file - input forms for humans24
  //@ts-ignore
  res.render('index', function (err, html) {
    if (err) {
      // log any error to the console for debug27
      console.log(err);
    } else {
      //no error, so send the html to the browser31
      //@ts-ignore
      res.send(html);
    }
  });
});
// Send a message to the specified email address when you navigate to /submit/someaddr@email.com37 // The index redirects here38
//@ts-ignore
app.get('/submit/:mail', function (req, res) {
  //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails41
  var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
  var data = {
    //Specify email data45 from: from_who,46
    //The email to contact47
    to: req.params.mail,
    //Subject and text data
    subject: 'Hello from Mailgun',
    html:
      'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' +
      req.params.mail +
      '">Click here to add your email address to a mailing list</a>',
  };
  //Invokes the method to send emails given the above data with the helper library54
  //@ts-ignore
  mailgun.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      res.render('error', { error: err });
      console.log('got an error: ', err);
    }
    //Else we can greet and leave
    else {
      //Here "submitted.jade" is the view file for this landing page
      //We pass the variable "email" from the url parameter in an object rendered by Jade
      res.render('submitted', { email: req.params.mail });
      console.log(body);
    }
  });
});
//@ts-ignore
app.get('/validate/:mail', function (req, res) {
  var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
  var members = [
    {
      address: req.params.mail77,
    },
  ];
  //For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
  mailgun
    .lists('NAME@MAILINGLIST.COM')
    .members()
    //@ts-ignore
    .add({ members: members, subscribed: true }, function (err, body) {
      console.log(body);
      if (err) {
        res.send('Error - check console');
      } else {
        res.send('Added to mailing list');
      }
    });
});
//@ts-ignore
app.get('/invoice/:mail', function (req, res) {
  //Which file to send? I made an empty invoice.txt file in the root directory
  //We required the path module here..to find the full path to attach the file!
  var path = require('path');
  var fp = path.join(__dirname, 'invoice.txt');
  //Settings98 var mailgun = new Mailgun({apiKey: api_key, domain: domain});
  var data = {
    from: from_who,
    to: req.params.mail,
    subject: 'An invoice from your friendly hackers',
    text: 'A fake invoice should be attached, it is just an empty text file after all',
    attachment: fp,
  };
  //@ts-ignore
  //Sending the email with attachment
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      res.render('error', { error: error });
    } else {
      res.send('Attachment is on its way');
      console.log('attachment sent', fp);
    }
  });
});
app.listen(3030);
