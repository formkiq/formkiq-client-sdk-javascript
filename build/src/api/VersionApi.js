import { ApiClient } from '../ApiClient.js';

export class VersionApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!VersionApi.instance) { 
      VersionApi.instance = this;
		}
  }

  get instance() {
		return VersionApi.instance;
  }
  
  set instance(value) {
		VersionApi.instance = value;
	}
    
  async getVersion() {
    const url = `https://${this.apiClient.host}/version`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}