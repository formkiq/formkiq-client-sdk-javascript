import { ApiClient } from '../ApiClient.js';

export class EntitiesApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!EntitiesApi.instance) { 
      EntitiesApi.instance = this;
		}
  }

  get instance() {
		return EntitiesApi.instance;
  }
  
  set instance(value) {
		EntitiesApi.instance = value;
	}

  async getEntityTypes({siteId, namespace = 'CUSTOM', next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId, namespace};
    if (next) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/entityTypes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getEntityType({siteId, entityTypeId, namespace = 'CUSTOM'}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId, namespace};
    const url = `${this.apiClient.host}/entityTypes/${entityTypeId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addEntityType({siteId, addEntityTypeParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/entityTypes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addEntityTypeParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // NOTE: no editing of Entity Types at thi time; requires aliasing mechanism for change of "name" property

  async deleteEntityType({siteId, entityTypeId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!entityTypeId) {
      return JSON.stringify({
        'message': 'No entityTypeId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/entityTypes/${entityTypeId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getEntities({siteId, entityTypeId, namespace = 'CUSTOM', limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId, namespace};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/entities/${entityTypeId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addEntity({siteId, namespace, entityTypeId, addOrUpdateEntityParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!namespace) {
      return JSON.stringify({
        'message': 'No namespace specified'
      });
    }
    if (!entityTypeId) {
      return JSON.stringify({
        'message': 'No entityTypeId specified'
      });
    }
    const params = {siteId, namespace};
    const url = `${this.apiClient.host}/entities/${entityTypeId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addOrUpdateEntityParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getEntity({siteId, entityTypeId, entityId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!entityTypeId) {
      return JSON.stringify({
        'message': 'No entityTypeId specified'
      });
    }
    if (!entityId) {
      return JSON.stringify({
        'message': 'No entityId specified'
      });
    }
    const params = {siteId, namespace};
    const url = `${this.apiClient.host}/entities/${entityTypeId}/${entityId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async patchEntity({siteId, namespace, entityTypeId, entityId, addOrUpdateEntityParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!namespace) {
      return JSON.stringify({
        'message': 'No namespace specified'
      });
    }
    if (!entityTypeId) {
      return JSON.stringify({
        'message': 'No entityTypeId specified'
      });
    }
    if (!entityId) {
      return JSON.stringify({
        'message': 'No entityId specified'
      });
    }
    const params = {siteId, namespace};
    const url = `${this.apiClient.host}/entities/${entityTypeId}/${entityId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addOrUpdateEntityParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteEntity({siteId, entityTypeId, entityId, namespace}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!entityTypeId) {
      return JSON.stringify({
        'message': 'No entityTypeId specified'
      });
    }
    if (!entityId) {
      return JSON.stringify({
        'message': 'No entityId specified'
      });
    }
    if (!namespace) {
      return JSON.stringify({
        'message': 'No namespace specified'
      });
    }
    const params = {siteId, namespace};
    const url = `${this.apiClient.host}/entities/${entityTypeId}/${entityId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

export class AddEntityTypeParameters {

  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

}