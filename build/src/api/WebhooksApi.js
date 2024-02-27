import { ApiClient } from '../ApiClient.js';

export class WebhooksApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!WebhooksApi.instance) { 
      WebhooksApi.instance = this;
		}
  }

  get instance() {
		return WebhooksApi.instance;
  }
  
  set instance(value) {
		WebhooksApi.instance = value;
	}
    
  async getWebhooks(siteId) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/webhooks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWebhook(siteId, addWebhookParameters) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/webhooks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addWebhookParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteWebhook(siteId, webhookId) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!webhookId) {
      return JSON.stringify({
        'message': 'No webhook ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/webhooks/${webhookId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

export class AddWebhookParameters {

  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

}