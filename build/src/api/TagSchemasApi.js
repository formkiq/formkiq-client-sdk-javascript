import {ApiClient} from '../ApiClient.js';

export class TagSchemasApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!TagSchemasApi.instance) {
      TagSchemasApi.instance = this;
    }
  }

  get instance() {
    return TagSchemasApi.instance;
  }

  set instance(value) {
    TagSchemasApi.instance = value;
  }

  async getTagSchemas({siteId, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/tagSchemas${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addTagSchema({siteId, addTagSchemaParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/tagSchemas${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addTagSchemaParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getTagSchema({siteId, tagSchemaId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!tagSchemaId) {
      return JSON.stringify({
        'message': 'No tagSchemaId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/tagSchemas/${tagSchemaId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteTagSchema({siteId, tagSchemaId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!tagSchemaId) {
      return JSON.stringify({
        'message': 'No tagSchemaId specified'
      });
    }
    const params = {siteId};

    const url = `${this.apiClient.host}/tagSchemas/${tagSchemaId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }
  
}
