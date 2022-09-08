import { ApiClient } from '../ApiClient.js';

export class SitesApi {

  constructor(apiClient) {
		ApiClient.instance = apiClient || ApiClient.instance;
  }
    
  async getSites(siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/sites${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

}