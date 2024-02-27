import { ApiClient } from "../ApiClient.js";

export class CasesApi {
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!CasesApi.instance) {
      CasesApi.instance = this;
    }
  }

  get instance() {
    return CasesApi.instance;
  }

  set instance(value) {
    CasesApi.instance = value;
  }

  async getCases(siteId, limit = null, next = null) {
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
    const url = `${this.apiClient.host}/cases${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addCase(siteId, addCaseParameters) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addCaseParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCase(siteId, caseId) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No caseId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteCase(siteId, caseId) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No caseId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCaseDocuments(siteId, caseId, limit = null, next = null) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No caseId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCaseTasks(siteId, caseId, limit = null, next = null) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No caseId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/tasks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCaseNigos(siteId, caseId, limit = null, next = null) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No caseId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/nigos${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}
