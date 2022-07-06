var express = require('express');
var Mailgun = require('mailgun-js');
var app = express();
var api_key = 'MAILGUN-API-KEY';
var domain = 'YOUR-DOMAIN.com';
var from_who = 'your@email.com';
app.use(express.static(__dirname + '/js'));
app.set('view engine', 'jade');
app.get('/', function (_req, res) {
    res.render('index', function (err, html) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(html);
        }
    });
});
app.get('/submit/:mail', function (req, res) {
    var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
    var data = {
        to: req.params.mail,
        subject: 'Hello from Mailgun',
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' +
            req.params.mail +
            '">Click here to add your email address to a mailing list</a>',
    };
    mailgun.messages().send(data, function (err, body) {
        if (err) {
            res.render('error', { error: err });
            console.log('got an error: ', err);
        }
        else {
            res.render('submitted', { email: req.params.mail });
            console.log(body);
        }
    });
});
app.get('/validate/:mail', function (req, res) {
    var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
    var members = [
        {
            address: req.params.mail77,
        },
    ];
    mailgun
        .lists('NAME@MAILINGLIST.COM')
        .members()
        .add({ members: members, subscribed: true }, function (err, body) {
        console.log(body);
        if (err) {
            res.send('Error - check console');
        }
        else {
            res.send('Added to mailing list');
        }
    });
});
app.get('/invoice/:mail', function (req, res) {
    var path = require('path');
    var fp = path.join(__dirname, 'invoice.txt');
    var data = {
        from: from_who,
        to: req.params.mail,
        subject: 'An invoice from your friendly hackers',
        text: 'A fake invoice should be attached, it is just an empty text file after all',
        attachment: fp,
    };
    mailgun.messages().send(data, function (error, body) {
        if (error) {
            res.render('error', { error: error });
        }
        else {
            res.send('Attachment is on its way');
            console.log('attachment sent', fp);
        }
    });
});
app.listen(3030);
//# sourceMappingURL=testEmail.js.map