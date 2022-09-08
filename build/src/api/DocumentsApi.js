import { ApiClient } from '../ApiClient.js';

export class DocumentsApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!DocumentsApi.instance) { 
      DocumentsApi.instance = this;
		}
  }

  get instance() {
		return DocumentsApi.instance;
  }
  
  set instance(value) {
		DocumentsApi.instance = value;
	}
    
  async getDocuments(siteId, date, tz, previous, next, limit) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    if (date && date.match(ApiClient.instance.validDateRegExp)) {
      params.date = date;
      if (tz && tz.match(ApiClient.instance.validTZRegExp)) {
        params.tz = tz;
      }
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
    const url = `https://${ApiClient.instance.host}/documents${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getDocument(documentId, siteId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/documents/${documentId}${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async addDocument(addOrUpdateDocumentParameters, siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/documents${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('POST', addOrUpdateDocumentParameters);
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  /**
	 * Add a document without requiring authentication (uses a /public endpoint, which can be enabled or disabled using CloudFormation)
   * Expected use is for submitting web forms
	 */
  async addDocumentUsingPublicPath(addOrUpdateDocumentParameters, siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/public/documents${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('POST', addOrUpdateDocumentParameters);
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async updateDocument(documentId, addOrUpdateDocumentParameters, siteId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/documents/${documentId}${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('PATCH', addOrUpdateDocumentParameters);
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async deleteDocument(documentId, siteId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${ApiClient.instance.host}/documents/${documentId}${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('DELETE');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getDocumentTags(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/tags`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getDocumentTag(documentId, tagKey) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    if (!tagKey) {
      return JSON.stringify({
        'message': 'No tag key specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/tags/${tagKey}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async addDocumentTag(documentId, addDocumentTagParameters) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/tags`;
    const options = ApiClient.instance.buildOptions('POST', addDocumentTagParameters);
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async deleteDocumentTag(documentId, tagKey) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    if (!tagKey) {
      return JSON.stringify({
        'message': 'No tag key specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/tags/${tagKey}`;
    const options = ApiClient.instance.buildOptions('DELETE');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getDocumentUrl(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/url`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async convertDocumentToFormat(documentId, mime, versionId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const body = {
      mime
    };
    if (versionId) {
      body.versionId = versionId;
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/formats`;
    const options = ApiClient.instance.buildOptions('POST', body);
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getDocumentVersions(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/versions`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUpload(path) {
    const params = {
    };
    if (path) {
      params.path = path;
    }
    const url = `https://${ApiClient.instance.host}/documents/upload${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  async getSignedUrlForDocumentReplacementUpload(documentId, path) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (path) {
      params.path = path;
    }
    const url = `https://${ApiClient.instance.host}/documents/${documentId}/upload${ApiClient.instance.buildQueryString(params)}`;
    const options = ApiClient.instance.buildOptions('GET');
    return await ApiClient.instance.fetchAndRespond(url, options);
  }

  buildDocumentParametersForAddOrUpdate(content, contentType, path, tags) {
    return new AddOrUpdateDocumentParameters(content, contentType, path, tags);
  }

  buildDocumentTagParametersForAdd(key, value) {
    return new AddDocumentTagParameters(key, value);
  }

}

export class AddOrUpdateDocumentParameters {

  documents = [];

  constructor(content, contentType, path, tags) {
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
  }

  addChildDocument(content, contentType, path, tags) {
    const document = new AddOrUpdateDocumentParameters(content, contentType, path, tags);
    this.documents.push(document);
  }

  addAttachment(path, tags) {
    const document = new AddOrUpdateDocumentParameters(null, null, path, tags);
    this.documents.push(document);
  }

}

export class AddDocumentTagParameters {

  constructor(key, value) {
    if (key) {
      this.key = key;
    }
    if (value) {
      this.value = value;
    }
  }

}