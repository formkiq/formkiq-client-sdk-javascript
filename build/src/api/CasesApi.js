import {ApiClient} from '../ApiClient.js';


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

  async getCases(siteId = null, next = null, limit = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/cases${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addCase(addCaseParameters, siteId = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addCaseParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCase(caseId, siteId = null) {
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteCase(caseId, siteId = null) {
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCaseTasks(caseId, siteId = null, next = null, limit = null) {
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
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
    const url = `${this.apiClient.host}/cases/${caseId}/tasks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getCaseNigos(caseId, siteId = null, next = null, limit = null) {
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
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
    const url = `${this.apiClient.host}/cases/${caseId}/nigos${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateCase(caseId, addCaseParameters, siteId = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addCaseParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getCaseDocuments(caseId, siteId = null, next = null, limit = null) {
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateTask(caseId, taskId, addTaskParameters, siteId = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addTaskParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getTaskDocuments(caseId, taskId, siteId = null, next = null, limit = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async updateNigo(caseId, nigoId, addNigoParameters, siteId = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addNigoParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getNigoDocuments(caseId, nigoId, siteId = null, next = null, limit = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  };
}