import { ApiClient } from '../ApiClient.js';

export class WorkflowsApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!WorkflowsApi.instance) { 
      WorkflowsApi.instance = this;
		}
  }

  get instance() {
		return WorkflowsApi.instance;
  }
  
  set instance(value) {
		WorkflowsApi.instance = value;
	}
    
  async getWorkflows(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getWorkflow(workflowId, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWebhook(addWorkflowParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addWorkflowParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteWorkflow(workflowId, siteId = null) {
    if (!workflowId) {
      return JSON.stringify({
        'message': 'No workflow ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getQueues(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/queues${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

export class AddWorkflowParameters {

  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

}