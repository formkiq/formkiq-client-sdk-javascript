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

  async getCases({siteId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }   
    const params = {siteId};
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

  async addCase({siteId, addCaseParameters}) {
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

  async getCase({siteId, caseId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }   
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteCase({siteId, caseId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }   
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getTasks({siteId, caseId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    } 
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
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

  async getNigos({siteId, caseId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    } 
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
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

  async updateCase({siteId, caseId, addCaseParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addCaseParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getCaseDocuments({siteId, caseId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    const params = {siteId};
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

  async deleteDocumentFromCase({siteId, caseId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getTask({siteId, caseId, taskId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!taskId) {
      return JSON.stringify({
        'message': 'No task ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getNigo({siteId, caseId, nigoId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!nigoId) {
      return JSON.stringify({
        'message': 'No NIGO ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addTask({siteId, addTaskParameters, caseId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!addTaskParameters) {
      return JSON.stringify({
        'message': 'No task parameters specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/tasks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addTaskParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addNigo({siteId, addNigoParameters, caseId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!addNigoParameters) {
      return JSON.stringify({
        'message': 'No NIGO parameters specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/nigos${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addNigoParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }


  async deleteDocumentFromTask({siteId, caseId, taskId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!taskId) {
      return JSON.stringify({
        'message': 'No task ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteDocumentFromNigo({siteId, caseId, nigoId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!nigoId) {
      return JSON.stringify({
        'message': 'No NIGO ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }


  async updateTask({siteId, caseId, taskId, addTaskParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!taskId) {
      return JSON.stringify({
        'message': 'No task ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addTaskParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getTaskDocuments({siteId, caseId, taskId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!taskId) {
      return JSON.stringify({
        'message': 'No task ID specified'
      });
    }
    const params = {siteId};
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

  async deleteTask({siteId, caseId, taskId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!taskId) {
      return JSON.stringify({
        'message': 'No task ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/tasks/${taskId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateNigo({siteId, caseId, nigoId, addNigoParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!nigoId) {
      return JSON.stringify({
        'message': 'No NIGO ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addNigoParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  };

  async getNigoDocuments({siteId, caseId, nigoId, next = null, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!nigoId) {
      return JSON.stringify({
        'message': 'No NIGO ID specified'
      });
    }
    const params = {siteId};
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

  async deleteNigo({siteId, caseId, nigoId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!caseId) {
      return JSON.stringify({
        'message': 'No case ID specified'
      });
    }
    if (!nigoId) {
      return JSON.stringify({
        'message': 'No NIGO ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/cases/${caseId}/nigos/${nigoId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }
}