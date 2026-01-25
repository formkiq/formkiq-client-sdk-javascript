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
    
  async getSites({status = null}) {
    const params = {};
    if (status) {
      params.status = status;
    }
    const url = `${this.apiClient.host}/sites${this.apiClient.buildQueryString(params)}`;
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

  async getApiKeys({siteId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/sites/${siteId}/apiKeys${this.apiClient.buildQueryString(params)}`;
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

  async getOpenPolicyAgentPolicies() {
    const url = `${this.apiClient.host}/sites/opa/accessPolicies`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getOpenPolicyAgentPolicy({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getOpenPolicyAgentPolicyItems({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy/policyItems`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setOpenPolicyAgentPolicyItems({siteId, updateConfigurationParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy/policyItems`;
    const options = this.apiClient.buildOptions('PUT',updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteOpenPolicyAgentPolicyItems({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/opa/accessPolicy/policyItems`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addSite({addSiteParameters}) {
    if (!addSiteParameters) {
      return JSON.stringify({
        'message': 'No addSiteParameters specified'
      });
    }
    const url = `${this.apiClient.host}/sites`;
    const options = this.apiClient.buildOptions('POST', addSiteParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateSite({siteId, updateSiteParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!updateSiteParameters) {
      return JSON.stringify({
        'message': 'No updateSiteParameters specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}`;
    const options = this.apiClient.buildOptions('PATCH', updateSiteParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSiteGroups({siteId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/sites/${siteId}/groups${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSiteGroupPermissions({siteId, groupName}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/groups/${groupName}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setSiteGroupPermissions({siteId, groupName, updateSiteGroupPermissions}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    if (!updateSiteGroupPermissions) {
      return JSON.stringify({
        'message': 'No updateSiteGroupPermissions specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/groups/${groupName}/permissions`;
    const options = this.apiClient.buildOptions('PUT', updateSiteGroupPermissions);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteSiteGroupPermissions({siteId, groupName}){
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/groups/${groupName}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getLocales({siteId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/sites/${siteId}/locales${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addLocale({siteId, addLocaleParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/locales`;
    const options = this.apiClient.buildOptions('POST', addLocaleParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteLocale({siteId, locale}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!locale) {
      return JSON.stringify({
        'message': 'No locale specified'
      });
    }
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getLocaleResourceItems({siteId, locale, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}/resourceItems${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addLocaleResourceItem({siteId, locale, addLocaleResourceItemParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}/resourceItems${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addLocaleResourceItemParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getLocaleResourceItem({siteId, locale, itemKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}/resourceItems/${itemKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async putLocaleResourceItem({siteId, locale, itemKey, addLocaleResourceItemParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}/resourceItems/${encodeURIComponent(itemKey)}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', addLocaleResourceItemParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteLocaleResourceItem({siteId, locale, itemKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!itemKey) {
      return JSON.stringify({
        'message': 'No rulesetId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/sites/${siteId}/locales/${locale}/resourceItems/${encodeURIComponent(itemKey)}${this.apiClient.buildQueryString(params)}`;
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

export class AddLocaleParameters {

  constructor(locale) {
    if (locale) {
      this.locale = locale;
    }
  }

}