import { ApiClient } from './ApiClient.js';
import { WebFormsHandler } from './WebFormsHandler.js';
import { ConfigurationApi } from './api/ConfigurationApi.js';
import { DocumentsApi } from './api/DocumentsApi.js';
import { PresetsApi } from './api/PresetsApi.js';
import { SearchApi } from './api/SearchApi.js';
import { SitesApi } from './api/SitesApi.js';
import { VersionApi } from './api/VersionApi.js';
import { WebhooksApi } from './api/WebhooksApi.js';
import { WorkflowsApi } from './api/WorkflowsApi.js';
import { RulesetsApi } from './api/RulesetsApi.js';

export class FormkiqClient {
    
  constructor(host, userPoolId, clientId) {
    this.apiClient = new ApiClient(host, userPoolId, clientId);
    this.configurationApi = new ConfigurationApi();
    this.documentsApi = new DocumentsApi();
    this.presetsApi = new PresetsApi();
    this.searchApi = new SearchApi();
    this.sitesApi = new SitesApi();
    this.versionApi = new VersionApi();
    this.webhooksApi = new WebhooksApi();
    this.workflowsApi = new WorkflowsApi();
    this.rulesetsApi = new RulesetsApi();
    this.webFormsHandler = new WebFormsHandler();
    this.webFormsHandler.checkWebFormsInDocument();
  }

  async login(email, password) {
    if (this.apiClient.cognitoClient) {
      const response = await this.apiClient.cognitoClient.login(email, password);

      // TODO: determine better way of ensuring cognito client is updated across API instances
      this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

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
    this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

    return response;
  }

  resetClient(host, userPoolId, clientId) {
    this.apiClient = new ApiClient(host, userPoolId, clientId);
    this.configurationApi.apiClient = this.apiClient;
    this.documentsApi.apiClient = this.apiClient;
    this.presetsApi.apiClient = this.apiClient;
    this.searchApi.apiClient = this.apiClient;
    this.sitesApi.apiClient = this.apiClient;
    this.versionApi.apiClient = this.apiClient;
    this.webhooksApi.apiClient = this.apiClient;
    this.workflowsApi.apiClient = this.apiClient;
    this.rulesetsApi.apiClient = this.apiClient;
  }

  rebuildCognitoClient(username, idToken, accessToken, refreshToken) {
    this.apiClient.cognitoClient.username = username;
    this.apiClient.cognitoClient.idToken = idToken;
    this.apiClient.cognitoClient.accessToken = accessToken;
    this.apiClient.cognitoClient.refreshToken = refreshToken;
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
  }

}