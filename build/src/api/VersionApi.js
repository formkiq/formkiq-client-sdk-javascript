import { ApiClient } from '../ApiClient.js';

export class VersionApi {

  constructor(apiClient) {
		ApiClient.instance = apiClient || ApiClient.instance;
  }
    
  async getVersion() {
    const url = `https://${ApiClient.instance.host}/version`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

}