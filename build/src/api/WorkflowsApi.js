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
    
  async getWorkflows({siteId, status = null, limit = null, next = null, previous = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (status) {
      params.status = status;
    }
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    const url = `${this.apiClient.host}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getWorkflow({siteId, workflowId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWorkflow({siteId, addWorkflowParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addWorkflowParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async putWorkflow({siteId, workflowId, addWorkflowParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', addWorkflowParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteWorkflow({siteId, workflowId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!workflowId) {
      return JSON.stringify({
        'message': 'No workflow ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getQueues({siteId, limit = null, next = null, previous = null}) {
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
    const url = `${this.apiClient.host}/queues${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addQueue({siteId, addQueueParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/queues${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addQueueParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getQueue({siteId, queueId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!queueId) {
      return JSON.stringify({
        'message': 'No queue ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/queues/${queueId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteQueue({siteId, queueId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!queueId) {
      return JSON.stringify({
        'message': 'No queue ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/queues/${queueId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentsInQueue({siteId, queueId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/queues/${queueId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentsInWorkflow({siteId, workflowId, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/workflows/${workflowId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWorkflowToDocument({siteId, documentId, workflowId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', {"workflowId": workflowId});
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

export class AddQueueParameters {

  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

}

export class AddDecisionParameters {

  constructor(stepId = null, comments = null, decision = null) {
    if (stepId) {
      this.stepId = stepId;
    }
    if (comments) {
      this.comments = comments;
    }
    if (decision) {
      this.decision = decision;
    }
  }

}