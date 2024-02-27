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
    
  async getWorkflows(siteId = null, status = null, limit = null, next = null, previous = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (status) {
      params.status = status;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
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

  async addWorkflow(addWorkflowParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addWorkflowParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async putWorkflow(workflowId, addWorkflowParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/workflows/${workflowId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', addWorkflowParameters);
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

  async getQueues(siteId = null, limit = null, next = null, previous = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/queues${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addQueue(addQueueParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/queues${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addQueueParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getQueue(queueId, siteId = null) {
    if (!queueId) {
      return JSON.stringify({
        'message': 'No queue ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/queues/${queueId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteQueue(queueId, siteId = null) {
    if (!queueId) {
      return JSON.stringify({
        'message': 'No queue ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/queues/${queueId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentsInQueue(queueId, siteId = null, limit = null, next = null, previous = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/queues/${queueId}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getWorkflowsInDocument(documentId, siteId = null, limit = null, next = null, previous = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWorkflowToDocument(documentId, workflowId, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', {"workflowId": workflowId});
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDecisionToDocumentWorkflow(documentId, workflowId, addDecisionParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/workflows/${workflowId}/decisions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addDecisionParameters);
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