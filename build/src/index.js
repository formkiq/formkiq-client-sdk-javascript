import { ApiClient } from './ApiClient.js';
import { WebFormsHandler } from './WebFormsHandler.js';
import { DocumentsApi } from './api/DocumentsApi.js';
import { PresetsApi } from './api/PresetsApi.js';
import { SearchApi } from './api/SearchApi.js';
import { SitesApi } from './api/SitesApi.js';
import { VersionApi } from './api/VersionApi.js';

export class FormkiqClient {
    
  constructor(host, userPoolId, clientId) {
    this.apiClient = new ApiClient(host, userPoolId, clientId);
    this.documentsApi = new DocumentsApi();
    this.presetsApi = new PresetsApi();
    this.searchApi = new SearchApi();
    this.sitesApi = new SitesApi();
    this.versionApi = new VersionApi();
    this.webFormsHandler = new WebFormsHandler();
    this.webFormsHandler.checkWebFormsInDocument();
  }

  async login(email, password) {
    if (this.apiClient.cognitoClient) {
      const response = await this.apiClient.cognitoClient.login(email, password);

      // TODO: determine better way of ensuring cognito client is updated across API instances
      this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

      return response;
    } else {
      return {
        message: 'No authentication client (e.g., Cognito) has been initialized.'
      };
    }
  }

  async logout() {
    const response = await this.apiClient.logout();
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

    return response;
  }

  rebuildCognitoClient(username, idToken, accessToken, refreshToken) {
    this.apiClient.cognitoClient.username = username;
    this.apiClient.cognitoClient.idToken = idToken;
    this.apiClient.cognitoClient.accessToken = accessToken;
    this.apiClient.cognitoClient.refreshToken = refreshToken;
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
  }

}