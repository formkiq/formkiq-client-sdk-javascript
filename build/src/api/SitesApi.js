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

}