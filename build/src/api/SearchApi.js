import { ApiClient } from '../ApiClient.js';

export class SearchApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!SearchApi.instance) { 
      SearchApi.instance = this;
		}
  }

  get instance() {
		return SearchApi.instance;
  }
  
  set instance(value) {
		SearchApi.instance = value;
	}
    
  async search({searchParameters, siteId, limit = null, next = null, previous = null}) {
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
    if (previous && previous.length) {
      params.previous = previous;
    }
    const url = `${this.apiClient.host}/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', searchParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // docs about documentFulltextSearchBody: https://docs.formkiq.com/docs/1.8.0/reference/README.html#DocumentFulltextSearchBody
  async searchFulltext({siteId, documentFulltextSearchBody, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit
    }
    const url = `${this.apiClient.host}/searchFulltext${this.apiClient.buildQueryString(params)}`
    const options = this.apiClient.buildOptions('POST', documentFulltextSearchBody)
    return await this.apiClient.fetchAndRespond(url, options)
  }

  async searchIndices({siteId, indexType, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/indices/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', {indexType});
    return await this.apiClient.fetchAndRespond(url, options);
  }

  buildTagSearchParameters({key, beginsWith, eq}) {
    return new TagSearchParameters(key, beginsWith, eq);
  }

}

export class TagSearchParameters {

  constructor(key, beginsWith, eq) {
    const query = {
      tag: {}
    };
    if (key) {
      query.tag.key = key;
    }
    if (beginsWith) {
      query.tag.beginsWith = beginsWith;
    } else if (eq) {
      query.tag.eq = eq;
    }
    this.query = query;
  }

}