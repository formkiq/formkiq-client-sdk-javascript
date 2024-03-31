import { ApiClient } from '../ApiClient.js';

export class SitesApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!SitesApi.instance) { 
      SitesApi.instance = this;
		}
  }

  get instance() {
		return SitesApi.instance;
  }
  
  set instance(value) {
		SitesApi.instance = value;
	}
    
  async getSites() {
    const url = `${this.apiClient.host}/sites`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getConfiguration({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/configuration`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateConfiguration({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/configuration`;
    const options = this.apiClient.buildOptions('PATCH', updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getApiKeys({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/apiKeys`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addApiKey({siteId, addApiKeyParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/apiKeys`;
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
    const url = `${this.apiClient.host}/sites/${siteId}/apiKeys/${apiKey}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getOpenPolicyAgentConfigurations({siteId}) {
    // NOTE: params is temporary; awaiting bug fix
    const params = {siteId};
    const url = `${this.apiClient.host}/sites/opa/accessPolicies${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getOpenPolicyAgentConfiguration({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async configureOpenPolicyAgent({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/opa/accessPolicies`;
    const options = this.apiClient.buildOptions('PUT',updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // Should change to this:
  /*
  async configureOpenPolicyAgent({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy`;
    const options = this.apiClient.buildOptions('PUT',updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }
  */

  async deleteOpenPolicyAgent({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy`;
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