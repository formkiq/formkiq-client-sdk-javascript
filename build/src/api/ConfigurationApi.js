import { ApiClient } from '../ApiClient.js';

export class ConfigurationApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!ConfigurationApi.instance) { 
      ConfigurationApi.instance = this;
		}
  }

  get instance() {
		return ConfigurationApi.instance;
  }
  
  set instance(value) {
		ConfigurationApi.instance = value;
	}
    
  async getConfiguration({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getOpenPolicyAgentConfigurations({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/opa${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }
  async getOpenPolicyAgentConfiguration({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/configuration/opa/${siteId}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async configureOpenPolicyAgent({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/opa${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT',updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteOpenPolicyAgent({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/opa/${siteId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }


  async updateConfiguration({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getApiKeys({siteId}) {
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/apiKeys${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addApiKey({siteId, addApiKeyParameters}) {
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/apiKeys${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addApiKeyParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // NOTE: apiKey is the OBFUSCATED key, i.e., the one with the '****' within it
  async deleteApiKey({siteId, apiKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!apiKey) {
      return JSON.stringify({
        'message': 'No API Key specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/configuration/apiKeys/${apiKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

export class AddApiKeyParameters {

  constructor(name, permissions) {
    if (name) {
      this.name = name;
    }
    if (permissions) {
      this.permissions = permissions;
    }
  }

}
