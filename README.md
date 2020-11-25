# formkiq-client-sdk-javascript
FormKiQ Client SDK - JavaScript

**Note: This Initial Version comes with CommonJS and ES6 versions**

## Instructions for Use (Web/CommonJS)

```html
<script type="text/javascript" src="./node_modules/formkiq-client-sdk-javascript/dist/cjs/formkiq-client-sdk-cjs.js"></script>
<script type="text/javascript">
      
  let formkiqClient;
  window.onload = () => {
    
    // specify Host, Cognito User Pool Id, and Cognito Client Id
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

## Automatic Handling of Web Forms ("Auto-Wiring")

**Example: [Contact Form](https://github.com/formkiq/formkiq-webform-examples-contact)**

**Example (with attachments): [Job Application Form](https://github.com/formkiq/formkiq-webform-examples-jobapplication)**

To add processing to any web form using FormKiQ, add the class "fkq-form" to your HTML FORM tag:

```html
<form class="fkq-form">
```

No action or onsubmit is required or desired, as FormKiQ Web Form Handler will automatically create the submission action. A submit button is expected, to trigger the onsubmit event that the Web Form Handler uses to submit the form:

```html
<input
  type="submit"
  value="Submit Your Fake Application"
  />
```

NOTE: You can use any input type, including **text inputs**, **passwords**, **checkboxes**, **radio buttons**, or **file uploads**. **Selects** (dropdowns, whether single value or multiple) and **textareas** are also available for use by the Web Form Handler. 

There are two callbacks included in the Web Form Handler:
- **onFormSubmitted**(formName)
- **onFormCompleted**(formName, response)

Validation has not yet been implemented; a simple implementation is next on our roadmap.

## Submitting a Form Manually

You can also submit the form manually using **formkiqClient.webFormsHandler.submitFormkiqForm(thisForm);**
