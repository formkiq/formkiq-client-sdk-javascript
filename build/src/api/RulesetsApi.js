import { ApiClient } from '../ApiClient.js';

export class RulesetsApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!RulesetsApi.instance) {
      RulesetsApi.instance = this;
		}
  }

  get instance() {
		return RulesetsApi.instance;
  }
  
  set instance(value) {
		RulesetsApi.instance = value;
	}
    
  async getRulesets({siteId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/rulesets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRuleset({siteId, rulesetId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addRuleset({siteId, addRulesetParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addRulesetParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async patchRuleset({siteId, rulesetId, addRulesetParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addRulesetParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteRuleset({siteId, rulesetId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!rulesetId) {
      return JSON.stringify({
        'message': 'No rulesetId specified'
      });
    }
    const params = {siteId};

    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRules({siteId, rulesetId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addRule({siteId, rulesetId, addRuleParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addRuleParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRule({siteId, rulesetId, ruleId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async patchRule({siteId, rulesetId, ruleId, addRuleParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addRuleParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteRule({siteId, rulesetId, ruleId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!rulesetId) {
      return JSON.stringify({
        'message': 'No rulesetId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}
