import { ApiClient } from './ApiClient.js';
import { WebFormsHandler } from './WebFormsHandler.js';
import { DocumentsApi } from './api/DocumentsApi.js';
import { SearchApi } from './api/SearchApi.js';
import { SitesApi } from './api/SitesApi.js';
import { VersionApi } from './api/VersionApi.js';
import { WebhooksApi } from './api/WebhooksApi.js';
import { WorkflowsApi } from './api/WorkflowsApi.js';
import { RulesetsApi } from './api/RulesetsApi.js';
import { CasesApi } from './api/CasesApi.js';
import { TagSchemasApi } from './api/TagSchemasApi.js';
import { UserManagementApi } from './api/UserManagementApi.js';



export class FormkiqClient {
    
  constructor(host, userPoolId, clientId) {
    this.apiClient = new ApiClient(host, userPoolId, clientId);
    this.documentsApi = new DocumentsApi();
    this.searchApi = new SearchApi();
    this.sitesApi = new SitesApi();
    this.versionApi = new VersionApi();
    this.webhooksApi = new WebhooksApi();
    this.workflowsApi = new WorkflowsApi();
    this.rulesetsApi = new RulesetsApi();
    this.casesApi = new CasesApi();
    this.tagSchemasApi = new TagSchemasApi();
    this.userManagementApi = new UserManagementApi();
    this.webFormsHandler = new WebFormsHandler();
    this.webFormsHandler.checkWebFormsInDocument();
  }

  async login(email, password) {
    if (this.apiClient.cognitoClient) {
      const response = await this.apiClient.cognitoClient.login(email, password);

      // TODO: determine better way of ensuring cognito client is updated across API instances
      this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.casesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.tagSchemasApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.userManagementApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

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
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.casesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.tagSchemasApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.userManagementApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

    return response;
  }

  resetClient(host, userPoolId, clientId) {
    this.apiClient = new ApiClient(host, userPoolId, clientId);
    this.documentsApi.apiClient = this.apiClient;
    this.searchApi.apiClient = this.apiClient;
    this.sitesApi.apiClient = this.apiClient;
    this.versionApi.apiClient = this.apiClient;
    this.webhooksApi.apiClient = this.apiClient;
    this.workflowsApi.apiClient = this.apiClient;
    this.rulesetsApi.apiClient = this.apiClient;
    this.casesApi.apiClient = this.apiClient;
    this.tagSchemasApi.apiClient = this.apiClient;
    this.userManagementApi.apiClient = this.apiClient;
  }

  rebuildCognitoClient(username, idToken, accessToken, refreshToken) {
    this.apiClient.cognitoClient.username = username;
    this.apiClient.cognitoClient.idToken = idToken;
    this.apiClient.cognitoClient.accessToken = accessToken;
    this.apiClient.cognitoClient.refreshToken = refreshToken;
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.workflowsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.rulesetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.casesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.tagSchemasApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.userManagementApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
  }

}