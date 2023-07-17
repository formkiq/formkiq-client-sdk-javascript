import { ApiClient } from '../ApiClient.js';

export class ConfigurationApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!ConfigurationApi.instance) { 
      ConfigurationApi.instance = this;
		}
  }

  get instance() {
		return ConfigurationApi.instance;
  }
  
  set instance(value) {
		ConfigurationApi.instance = value;
	}
    
  async getConfiguration(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateConfiguration(updateConfigurationParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

/*
export class AddOrUpdateDocumentParameters {

  documents = [];

  constructor(content, contentType, path, tags, actions) {
    if (content) {
      this.content = content;
    }
    if (contentType) {
      this.contentType = contentType;
    }
    if (path) {
      this.path = path;
    }
    if (tags) {
      this.tags = tags;
    }
    if (actions) {
      this.actions = actions;
    }
  }

  addChildDocument(content, contentType, path, tags, actions) {
    const document = new AddOrUpdateDocumentParameters(content, contentType, path, tags, actions);
    this.documents.push(document);
  }

  addAttachment(path, tags) {
    const document = new AddOrUpdateDocumentParameters(null, null, path, tags);
    this.documents.push(document);
  }

}
*/