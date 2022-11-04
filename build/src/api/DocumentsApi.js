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
    if (date && date.match(this.apiClient.validDateRegExp)) {
      params.date = date;
      if (tz && tz.match(this.apiClient.validTZRegExp)) {
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
    const url = `https://${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // docs about documentSearchBody: https://docs.formkiq.com/docs/1.8.0/reference/README.html#DocumentSearchBody
  async searchDocuments(documentSearchBody, siteId, limit, next, previous) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;

    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    if (limit) {
      params.limit = limit;
    }

    const url = `https://${this.apiClient.host}/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', documentSearchBody);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocument(addOrUpdateDocumentParameters, siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default';
    }
    params.siteId = siteId;
    const url = `https://${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/public/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentTags(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocumentTag(documentId, addDocumentTagParameters) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags`;
    const options = this.apiClient.buildOptions('POST', addDocumentTagParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateDocumentTag(documentId, tagKey, tagValues) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}`;
    const options = this.apiClient.buildOptions('PUT', tagValues);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentUrl(documentId, inline = false) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/url?inline=${inline}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // docs about documentFulltextSearchBody: https://docs.formkiq.com/docs/1.8.0/reference/README.html#DocumentFulltextSearchBody
  async searchFulltext(documentFulltextSearchBody, siteId, limit) {
    const params = {};

    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId

    if (limit) {
      params.limit = limit
    }

    const url = `https://${this.apiClient.host}/searchFulltext${this.apiClient.buildQueryString(params)}`
    const options = this.apiClient.buildOptions('POST', documentFulltextSearchBody)
    return await this.apiClient.fetchAndRespond(url, options)
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/formats`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentVersions(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/versions`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUpload(path) {
    const params = {
    };
    if (path) {
      params.path = path;
    }
    const url = `https://${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUploadWithBody(uploadBody) {
    const url = `https://${this.apiClient.host}/documents/upload`;
    const options = this.apiClient.buildOptions('POST', uploadBody);
    return await this.apiClient.fetchAndRespond(url, options);
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async editDocumentWithOnlyoffice(documentId, siteId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const url = `https://${this.apiClient.host}/onlyoffice/${documentId}/edit${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async createDocumentWithOnlyoffice(extension, siteId) {
    if (!extension) {
      return JSON.stringify({
        'message': 'No extension specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      extension
    };
    console.log(body)
    const url = `https://${this.apiClient.host}/onlyoffice/new${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async moveDocument(source, target, siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      source,
      target
    };
    const url = `https://${this.apiClient.host}/indices/folder/move${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async createFolder(path, siteId) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      path
    };
    const url = `https://${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
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