import axios from 'axios';
let options = {
  method: 'POST',
  url: 'https://rest-api.d7networks.com/secure/send',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'BASIC ',
  },
  body: '{\n\t"to":"+9779840138330",\n\t"content":"Welcome to D7 sms , we will help you to talk with your customer effectively",\n\t"from":"SMSINFO",\n\t"dlr":"yes",\n\t"dlr-method":"GET", \n\t"dlr-level":"2", \n\t"dlr-url":"http://yourcustompostbackurl.com"\n}',
};
async function main() {
  const response = await axios.create(options);
  console.log(response);
}

main();
