'use strict';

var exports = {"__esModule": true};

Object.defineProperty(exports, '__esModule', { value: true });

class ApiClient {
    
  host = 'api-demo.tryformkiq.com';
  authorizationHeader = [];
  validDateRegExp = /^d{4}-d{2}-d{2}$/;
  validTZRegExp = /(([+-]?)(d{2}):?(d{0,2}))/;

  get instance() {
		return ApiClient.instance;
	}

	set instance(value) {
		ApiClient.instance = value;
	}

  constructor(host) {
    if (host) {
      this.host = host;   
    }
    if (!ApiClient.instance) { 
      ApiClient.instance = this;
		}
  }

  buildAuthorization(token) {
    this.authorizationHeader = [
      'Authorization:',
      token
    ];
  }

  buildQueryString(params) {
    var arr = Object.keys(params).map(function (k) {
      return k + '=' + encodeURIComponent(params[k])
    });
    if (arr.length) {
      return '?' + arr.join('&');
    }
    return '';
  }

  buildOptions(method, body, headers) {
    const options = {
      method
    };
    if (!headers) {
      headers = {};
    }
    if (this.authorizationHeader && this.authorizationHeader.length) {
      headers['Authorization'] = this.authorizationHeader[1];
    }
    if (body) {
      if (typeof body === 'string') {
        options.body = body;
      } else if (typeof body === 'object') {
        options.body = JSON.stringify(body);
      }
    }
    options.headers = headers;
    return options;
  }

  async fetchAndRespond(url, options) {
    let response;
    await Promise.resolve(new Promise((resolve) => {
      fetch(url, options).then(response => response.json())
      .then(data => {
        response = data;
        resolve();
      });
    }));
    return response;
  }

}

class DocumentsApi {

  constructor(apiClient) {
		this.apiClient = apiClient || ApiClient.instance;
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

  buildDocumentParametersForAddOrUpdate(content, contentType, path, tags) {
    return new AddOrUpdateDocumentParameters(content, contentType, path, tags);
  }

  buildDocumentTagParametersForAdd(key, value) {
    return new AddDocumentTagParameters(key, value);
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

  async getDocumentUrl(documentId) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}/url`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
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

}

class AddOrUpdateDocumentParameters {

  constructor(content, contentType, path, tags) {
    if (content) {
      this.content = btoa(content);
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

}

class AddDocumentTagParameters {

  constructor(key, value) {
    if (key) {
      this.key = key;
    }
    if (value) {
      this.value = value;
    }
  }

}

class FormkiqClient {
    constructor(host) {
        this.ApiClient = new ApiClient(host);
        this.DocumentsApi = new DocumentsApi();
    }
}

exports.FormkiqClient = FormkiqClient;
