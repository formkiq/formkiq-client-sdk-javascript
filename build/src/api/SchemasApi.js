import {ApiClient} from '../ApiClient.js';

export class SchemasApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!SchemasApi.instance) {
      SchemasApi.instance = this;
    }
  }

  get instance() {
    return SchemasApi.instance;
  }

  set instance(value) {
    SchemasApi.instance = value;
  }

  async getSiteSchema({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/schema/document`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setSiteSchema({siteId, schema}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!schema) {
      return JSON.stringify({
        'message': 'No schema specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/schema/document`;
    const options = this.apiClient.buildOptions('PUT', schema);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSiteClassifications({siteId, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/sites/${siteId}/classifications${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addSiteClassification({siteId, classification}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!classification) {
      return JSON.stringify({
        'message': 'No classification specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/classifications`;
    const options = this.apiClient.buildOptions('POST', classification);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getClassification({siteId, classificationId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!classificationId) {
      return JSON.stringify({
        'message': 'No classificationId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/classifications/${classificationId}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteClassification({siteId, classificationId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!classificationId) {
      return JSON.stringify({
        'message': 'No classificationId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/classifications/${classificationId}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setClassification({siteId, classificationId, classification}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!classificationId) {
      return JSON.stringify({
        'message': 'No classificationId specified'
      });
    }
    if (!classification) {
      return JSON.stringify({
        'message': 'No classification specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/classifications/${classificationId}`;
    const options = this.apiClient.buildOptions('PUT', classification);
    return await this.apiClient.fetchAndRespond(url, options);
  }
}
