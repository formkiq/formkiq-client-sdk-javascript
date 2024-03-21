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
    
  async getDocuments({siteId, deleted = null, date = null, tz = null, limit = null, next = null, previous = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (deleted) {
      params.deleted = deleted;
    }
    if (date && date.match(this.apiClient.validDateRegExp)) {
      params.date = date;
      if (tz && tz.match(this.apiClient.validTZRegExp)) {
        params.tz = tz;
      }
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
    const url = `${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // docs about documentSearchBody: https://docs.formkiq.com/docs/1.8.0/reference/README.html#DocumentSearchBody
  async searchDocuments({siteId, documentSearchBody, limit = null, next = null, previous = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', documentSearchBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocument({siteId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocument({siteId, addOrUpdateDocumentParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  /**
	 * Add a document without requiring authentication (uses a /public endpoint, which can be enabled or disabled using CloudFormation)
   * Expected use is for submitting web forms
	 */
  async addDocumentUsingPublicPath({siteId, addOrUpdateDocumentParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/public/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateDocument({siteId, documentId, addOrUpdateDocumentParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }    
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', addOrUpdateDocumentParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteDocument({siteId, documentId, softDelete = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }    
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (softDelete && softDelete.length) {
      params.softDelete = softDelete;
    }
    const url = `${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async restoreDocument({siteId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }    
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/restore${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT');
    return await this.apiClient.fetchAndRespond(url, options);
  }
  
  async getDocumentTags({siteId, documentId, limit = null, next = null, previous = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (previous && previous.length) {
      params.previous = previous;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentTag({siteId, documentId, tagKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    if (!tagKey) {
      return JSON.stringify({
        'message': 'No tag key specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocumentTag({siteId, documentId, addDocumentTagParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addDocumentTagParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateDocumentTag({siteId, documentId, tagKey, tagValues = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', tagValues);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteDocumentTag({siteId, documentId, tagKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    if (!tagKey) {
      return JSON.stringify({
        'message': 'No tag key specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentContent({siteId, documentId, versionKey = null, inline = false}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (versionKey) {
      params.versionKey = versionKey
    }
    params.inline = inline
    const url = `${this.apiClient.host}/documents/${documentId}/content${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentUrl({siteId, documentId, versionKey = null, inline = false}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (versionKey) {
      params.versionKey = versionKey
    }
    params.inline = inline
    const url = `${this.apiClient.host}/documents/${documentId}/url${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentVersions({siteId, documentId, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/versions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // TODO: add the replacement POST endpoint, once this is ready to deprecate pre version 2.*+
  async putDocumentVersion({siteId, documentId, versionKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    if (!versionKey) {
      return JSON.stringify({
        'message': 'No version key specified'
      });
    }
    const params = {siteId};
    const body = {
      versionKey
    }
    const url = `${this.apiClient.host}/documents/${documentId}/versions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentAccessAttributes({siteId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No site ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }   
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/accessAttributes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocumentAccessAttributes({siteId, documentId, addDocumentAccessAttributesParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No site ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/accessAttributes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addDocumentAccessAttributesParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocumentAccessAttributes({siteId, documentId, addDocumentAccessAttributesParameters}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No site ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/documents/${documentId}/accessAttributes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', addDocumentAccessAttributesParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteDocumentAccessAttributes({siteId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No site ID specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};

    const url = `${this.apiClient.host}/documents/${documentId}/accessAttributes${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentActions({siteId, documentId, limit = null, next = null}) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/actions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async postDocumentActions({siteId, documentId, actions}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    if (!actions) {
      return JSON.stringify({
        'message': 'No actions specified'
      });
    }
    const params = {siteId};
    const body = {
      actions
    }
    const url = `${this.apiClient.host}/documents/${documentId}/actions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getWorkflowsInDocument({siteId, documentId, limit = null, next = null}) {
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
    const url = `${this.apiClient.host}/documents/${documentId}/workflows${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDecisionToDocumentWorkflow({siteId, documentId, workflowId, addDecisionParameters}) {
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
    const url = `${this.apiClient.host}/documents/${documentId}/workflows/${workflowId}/decisions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addDecisionParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUpload({siteId, path}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (path) {
      params.path = path;
    }
    const url = `${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUploadWithBody({siteId, uploadBody, contentLength = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (contentLength) {
      params.contentLength = contentLength;
    }
    const url = `${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', uploadBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForDocumentReplacementUpload({siteId, documentId, path = null, contentLength = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (path) {
      params.path = path;
    }
    if (contentLength) {
      params.contentLength = contentLength;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async postDocumentCompress({siteId, documentIds}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentIds) {
      return JSON.stringify({
        'message': 'No document IDs specified'
      });
    }
    const params = {siteId};
    const body = {
      documentIds
    }
    const url = `${this.apiClient.host}/documents/compress${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getUserActivities({siteId, userId = null, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (userId) {
      params.userId = siteId;
    }
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/userActivities${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentUserActivities({siteId, documentId, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/userActivities${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getDocumentSyncs({siteId, documentId, limit = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    const url = `${this.apiClient.host}/documents/${documentId}/syncs${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async editDocumentWithOnlyoffice({siteId, documentId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/onlyoffice/${documentId}/edit${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async createDocumentWithOnlyoffice({siteId, extension, path = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!extension) {
      return JSON.stringify({
        'message': 'No extension specified'
      });
    }
    const params = {siteId};
    if (path) {
      params.path = path
    }
    const body = {
      extension
    };
    const url = `${this.apiClient.host}/onlyoffice/new${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async moveDocument({siteId, source, target}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const body = {
      source,
      target
    };
    const url = `${this.apiClient.host}/indices/folder/move${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getFolders({siteId, indexKey, limit = null, next = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    if (indexKey) {
      params.indexKey = indexKey;
    }
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/folders${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }


  async createFolder({siteId, path}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const body = {
      path
    };
    const url = `${this.apiClient.host}/documents${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteFolder({siteId, indexKey}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/indices/folder/${indexKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getESignatureConfig({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/esignature/docusign/config${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setESignatureConfig({siteId, privateKey, userId, clientId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const body = {
      privateKey,
      userId,
      clientId
    };
    const url = `${this.apiClient.host}/esignature/docusign/config${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PUT', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async sendForDocusignESignature({siteId, documentId, emailSubject = '', status = 'created', developmentMode = true, signers = [], carbonCopies = []}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!documentId) {
      return JSON.stringify({
        'message': 'No documentId specified'
      });
    }
    const params = {siteId};
    const body = {
      status,
      developmentMode,
      emailSubject,
      signers
    };
    if (carbonCopies.length) {
      body.carbonCopies = carbonCopies
    }
    const url = `${this.apiClient.host}/esignature/docusign/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getExaminePdfUploadUrl({siteId}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/objects/examine/pdf${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getExaminePdfDetails({siteId, objectId = null}) {
    if (!siteId) {
      return JSON.stringify({
        'message': 'No siteId specified'
      });
    }
    if (!objectId) {
      return JSON.stringify({
        'message': 'No objectId specified'
      });
    }
    const params = {siteId};
    const url = `${this.apiClient.host}/objects/examine/${objectId}/pdf${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  buildDocumentParametersForAddOrUpdate({content, contentType, path, tags}) {
    return new AddOrUpdateDocumentParameters(content, contentType, path, tags);
  }

  buildDocumentTagParametersForAdd({key, value}) {
    return new AddDocumentTagParameters(key, value);
  }

}

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

  addChildDocument({content, contentType, path, tags, actions}) {
    const document = new AddOrUpdateDocumentParameters(content, contentType, path, tags, actions);
    this.documents.push(document);
  }

  addAttachment({path, tags}) {
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