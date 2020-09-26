import { ApiClient } from './ApiClient.js';
import { DocumentsApi } from './api/DocumentsApi.js';

export class FormkiqClient {
    
  constructor(host, userPoolId, clientId) {
    this.ApiClient = new ApiClient(host, userPoolId, clientId);
    this.DocumentsApi = new DocumentsApi();
  }

  login(email, password) {
    if (this.ApiClient.CognitoClient) {
      return this.ApiClient.CognitoClient.login(email, password);
    } else {
      return {
        message: 'No authentication client (e.g., Cognito) has been initialized.'
      };
    }
  }

  logout() {
    return this.ApiClient.logout();
  }

}