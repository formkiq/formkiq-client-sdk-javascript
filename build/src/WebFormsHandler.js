import { DocumentsApi } from './api/DocumentsApi.js';

export class WebFormsHandler {
  
  constructor(documentsApi) {
		this.documentsApi = documentsApi || DocumentsApi.instance;
  }

  checkWebFormsInDocument() {
    const fkqFormElements = Array.from(document.getElementsByTagName('FORM'))
      .filter((formElement) => formElement.classList.contains('fkq-form'));
    fkqFormElements.forEach((fkqFormElement) => {
      fkqFormElement.setAttribute('action', 'JavaScript://');
      fkqFormElement.onsubmit = (event) => {
        this.submitFormkiqForm(event.target);
      };
    });
  }

  submitFormkiqForm(fkqFormElement) {
    const data = {};
    data.attachmentFields = [];
    data.formFields = [];
    if (fkqFormElement.getAttribute('name')) {
      data.formName = fkqFormElement.getAttribute('name');
    }
    const formFieldElements = fkqFormElement.querySelectorAll('input, select, textarea');
    formFieldElements.forEach((formFieldElement) => {
      let formField;
      switch (formFieldElement.tagName) {
        case 'INPUT':
          switch (formFieldElement.type) {
            case 'button':
              // ignore element
              break;
            case 'submit':
              // ignore element
              break;
            case 'checkbox':
            case 'radio':
              let fieldName = '';
              if (formFieldElement.getAttribute('name')) {
                fieldName = formFieldElement.getAttribute('name');
              }
              let formFieldIndex = -1;
              if (fieldName && data.formFields.length) {
                const matchingFormFields = data.formFields.filter((formField) => formField.fieldName === fieldName);
                if (matchingFormFields.length) {
                  formFieldIndex = data.formFields.indexOf(matchingFormFields[0]);
                }
              }
              if (formFieldIndex === -1) {
                formField = {};
                if (fieldName) {
                  formField.fieldName = fieldName;
                }
                if (formFieldElement.type === 'checkbox') {
                  formField.values = [];
                  if (formFieldElement.checked) {
                    formField.values.push(formFieldElement.value);
                  }
                } else {
                  if (formFieldElement.checked) {
                    formField.value = formFieldElement.value;
                  }
                }
                data.formFields.push(formField);
              } else {
                if (formFieldElement.checked) {
                  if (formFieldElement.type === 'checkbox') {
                    data.formFields[formFieldIndex].values.push(formFieldElement.value);
                  } else {
                    data.formFields[formFieldIndex].value = formFieldElement.value;
                  }
                }
              }
              break;
            case 'file':
              const attachmentField = {};
              if (formFieldElement.getAttribute('name')) {
                attachmentField.fieldName = formFieldElement.getAttribute('name');
              }
              if (formFieldElement.value.length) {
                attachmentField.hasFile = true;
              } else {
                attachmentField.hasFile = false;
              }
              data.attachmentFields.push(attachmentField);
              break;
            default:
              formField = {};
              if (formFieldElement.getAttribute('name')) {
                formField.fieldName = formFieldElement.getAttribute('name');
              }
              formField.value = formFieldElement.value;
              data.formFields.push(formField);
              break; 
          }
          break;
        case 'SELECT':
          formField = {};
          if (formFieldElement.getAttribute('name')) {
            formField.fieldName = formFieldElement.getAttribute('name');
          }
          if (formFieldElement.multiple) {
            const selectOptions = Array.from(formFieldElement.options);
            formField.values = selectOptions.filter(option => option.selected).map(option => option.value);
          } else {
            formField.value = formFieldElement.options[formFieldElement.selectedIndex].value;
          }
          data.formFields.push(formField);
          break;
        case 'TEXTAREA':
          formField = {};
          if (formFieldElement.getAttribute('name')) {
            formField.fieldName = formFieldElement.getAttribute('name');
          }
          formField.value = formFieldElement.value;
          data.formFields.push(formField);
          break;
      }
    });
    const content = JSON.stringify(data);
    const addOrUpdateDocumentParameters = this.documentsApi.buildDocumentParametersForAddOrUpdate(content);
    const fileInputElements = Array.from(fkqFormElement.getElementsByTagName('INPUT')).filter((input) => input.type === 'file');
    fileInputElements.forEach((fileInputElement) => {
      if (fileInputElement.value) {
        addOrUpdateDocumentParameters.addAttachment([this.documentsApi.buildDocumentTagParametersForAdd('fieldName', fileInputElement.getAttribute('name'))]);    
      }
    });
    console.log('gg');
    // TODO: (NEXT) Submit form
    /*
    formkiqClient.DocumentsApi.addDocumentUsingPublicPath(addOrUpdateDocumentParameters).then((response) => {
      console.log(response);
      if (response.documents) {
        response.documents.filter((document) => document.uploadUrl).forEach((document, index) => {
          const fileInputElement = fileInputElements[index];
          if (fileInputElement && fileInputElement.value) {
            const file = fileInputElement.files[0];
            formkiqClient.ApiClient.uploadFile(document.uploadUrl, file).then((uploadResponse) => {
              console.log(uploadResponse);
            });
          }
        });
      }
    });
    */
  }

}
