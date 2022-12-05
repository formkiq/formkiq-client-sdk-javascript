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
    
  async getDocuments(siteId = null, date = null, tz = null, previous = null, next = null, limit = null) {
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
  async searchDocuments(documentSearchBody, siteId = null, limit = null, next = null, previous = null) {
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

  async getDocument(documentId, siteId = null) {
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

  async addDocument(addOrUpdateDocumentParameters, siteId = null) {
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
  async addDocumentUsingPublicPath(addOrUpdateDocumentParameters, siteId = null) {
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

  async updateDocument(documentId, addOrUpdateDocumentParameters, siteId = null) {
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

  async deleteDocument(documentId, siteId = null) {
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

  async getDocumentTags(documentId, siteId = null, limit = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId;
    if (limit) {
      params.limit = limit
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentTag(documentId, tagKey, siteId = null) {
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
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId;
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocumentTag(documentId, addDocumentTagParameters, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId;
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addDocumentTagParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateDocumentTag(documentId, tagKey, tagValues = null, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId;
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', tagValues);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteDocumentTag(documentId, tagKey, siteId = null) {
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
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const url = `https://${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentContent(documentId, versionKey = null, inline = false, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (versionKey) {
      params.versionKey = versionKey
    }
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    params.inline = inline
    const url = `https://${this.apiClient.host}/documents/${documentId}/content${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentUrl(documentId, versionKey = null, inline = false, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (versionKey) {
      params.versionKey = versionKey
    }
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    params.inline = inline
    const url = `https://${this.apiClient.host}/documents/${documentId}/url${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }
  
  /*
  async convertDocumentToFormat(documentId, mime, versionKey) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const body = {
      mime
    };
    if (versionKey) {
      body.versionKey = versionKey;
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/formats`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }
  */

  async getDocumentVersions(documentId, siteId = null) {
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/versions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async putDocumentVersion(documentId, versionKey, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    if (!versionKey) {
      return JSON.stringify({
        'message': 'No version key specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      versionKey
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/versions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentActions(documentId, siteId = null) {
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
    const url = `https://${this.apiClient.host}/documents/${documentId}/actions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async postDocumentActions(documentId, actions, siteId = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    if (!actions) {
      return JSON.stringify({
        'message': 'No actions specified'
      });
    }
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      actions
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/actions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUpload(path, siteId = null) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    if (path) {
      params.path = path;
    }
    const url = `https://${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUploadWithBody(uploadBody, siteId = null) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const url = `https://${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', uploadBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForDocumentReplacementUpload(documentId, path = null, siteId = null) {
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
    params.siteId = siteId;
    if (path) {
      params.path = path;
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async editDocumentWithOnlyoffice(documentId, siteId = null) {
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

  async createDocumentWithOnlyoffice(extension, path = null, siteId = null) {
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
    if (path) {
      params.path = path
    }
    const body = {
      extension
    };
    const url = `https://${this.apiClient.host}/onlyoffice/new${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async moveDocument(source, target, siteId = null) {
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

  async createFolder(path, siteId = null) {
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

  async deleteFolder(indexKey, siteId = null) {
    const params = {
    };
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const url = `https://${this.apiClient.host}/indices/folder/${indexKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getESignatureConfig(siteId = null) {
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const url = `https://${this.apiClient.host}/esignature/docusign/config${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setESignatureConfig(siteId = null, privateKey, userId, clientId) {
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      privateKey,
      userId,
      clientId
    };
    const url = `https://${this.apiClient.host}/esignature/docusign/config${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async sendForDocusignESignature(documentId, siteId = null, emailSubject = '', status = 'created', developmentMode = true, signers = [], carbonCopies = []) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {};
    if (!siteId) {
      siteId = 'default'
    }
    params.siteId = siteId
    const body = {
      status,
      developmentMode,
      emailSubject,
      signers
    };
    if (carbonCopies.length) {
      body.carbonCopies = carbonCopies
    }
    const url = `https://${this.apiClient.host}/esignature/docusign/${documentId}${this.apiClient.buildQueryString(params)}`;
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