import { ApiClient } from './ApiClient.js';
import { DocumentsApi } from './api/DocumentsApi.js';
import { PresetsApi } from './api/PresetsApi.js';
import { SitesApi } from './api/SitesApi.js';

export class FormkiqClient {
    
  constructor(host, userPoolId, clientId) {
    this.ApiClient = new ApiClient(host, userPoolId, clientId);
    this.DocumentsApi = new DocumentsApi();
    this.PresetsApi = new PresetsApi();
    this.SitesApi = new SitesApi();
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