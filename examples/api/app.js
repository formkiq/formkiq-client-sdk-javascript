const FormkiqClient = require('../../build/dist/es6-backend/formkiq-client-sdk-node.js').FormkiqClient;
const formkiqClient = new FormkiqClient(
  'api-demo.tryformkiq.com',
  'us-east-1_1nXLy3soH',
  '4b9bl9mkvbhpn0g0mjpj0hnhb7'
);
formkiqClient.login('demo@formkiq.com', 'Tryformkiq1!').then((result) => {
  formkiqClient.documentsApi.getDocuments().then((documentResult) => {
    console.log(documentResult);
  });
}).catch((err) => {
  console.log(err);
});




