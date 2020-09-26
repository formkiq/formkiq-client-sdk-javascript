# formkiq-client-sdk-javascript
FormKiQ Client SDK - JavaScript

**Note: Initial Version uses CommonJS**

## Instructions for Use (Web)

```html
<script type="text/javascript" src="formkiq-client-sdk-cjs.js"></script>
<script type="text/javascript">
      
  let formkiqClient;
  window.onload = () => {
    
    // specify Host, and use Cognito User Pool and Client Id to create Cognito Client for API Authentication
    formkiqClient = new FormkiqClient(
      'api-demo.tryformkiq.com',
      'us-east-1_1nXLy3soH',
      '4b9bl9mkvbhpn0g0mjpj0hnhb7'
    );
    
    // obviously this would not be hard-coded for non-public creds
    // NOTE: these public credentials for demo@formkiq.com are for read-only access
    formkiqClient.login('demo@formkiq.com', 'Tryformkiq1!');

    // get current version of FormKiQ
    formkiqClient.VersionApi.getVersion().then((response) => {
      console.log(response);
    });

  }

</script>
```



