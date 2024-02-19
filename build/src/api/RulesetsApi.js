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
    
  async getRulesets(siteId = null,next=null, limit=null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/rulesets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRuleset(rulesetId, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addRuleset(addRulesetParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addRulesetParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async patchRuleset(rulesetId, addRulesetParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addRulesetParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteRuleset(rulesetId, siteId = null) {
    if (!rulesetId) {
      return JSON.stringify({
        'message': 'No ruleset ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRules(rulesetId, siteId = null,next=null, limit=null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addRule(rulesetId,addRuleParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addRuleParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getRule(rulesetId, ruleId, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async patchRule(rulesetId, ruleId, addRuleParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addRuleParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteRule(rulesetId, ruleId, siteId = null) {
    if (!rulesetId) {
      return JSON.stringify({
        'message': 'No ruleset ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/rulesets/${rulesetId}/rules/${ruleId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}
