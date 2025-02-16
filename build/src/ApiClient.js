import { CognitoClient } from './CognitoClient.js';

export class ApiClient {
    
  host = 'api-demo.tryformkiq.com';
  validDateRegExp = /^d{4}-d{2}-d{2}$/;
  validTZRegExp = /(([+-]?)(d{2}):?(d{0,2}))/;
  userPoolId = ''
  clientId = ''

  get instance() {
		return ApiClient.instance;
	}

	set instance(value) {
		ApiClient.instance = value;
	}

  constructor(host, userPoolId, clientId) {
    if (host) {
      this.host = host?.replace(/\/+$/, ""); // Remove extra trailing slash
    }
    if (userPoolId && clientId) {
      this.userPoolId = userPoolId;
      this.clientId = clientId;
      this.buildCognitoClient(userPoolId, clientId);
    }
    if (!ApiClient.instance) { 
      ApiClient.instance = this;
    }
  }

  async logout() {
    this.cognitoClient.removeUser();
  }

  buildCognitoClient(userPoolId, clientId) {
    this.cognitoClient = new CognitoClient(userPoolId, clientId);
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

  buildOptions(method, body, headers, stripAuthentication) {
    const options = {
      method
    };
    if (!headers) {
      headers = {};
    }
    if (!stripAuthentication && this.cognitoClient && this.cognitoClient.accessToken) {
      headers['Authorization'] = this.cognitoClient.accessToken;
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
      fetch(url, options)
        .then(r => r.json().then(data => ({httpStatus: r.status, body: data})))
        .then(obj => {
          response = obj.body;
          if (!response.status) {
            response.status = obj.httpStatus;
          }
          resolve();
        })
        .catch(error => {
          // Handle "failed to fetch" errors here
          if (error.message === "Failed to fetch") {
            console.error('Fetch failed, but execution continues:', error);
            // You can set a default response or perform other actions
            response = { status: 'fetch_failed', error: error };
          } else {
            // Handle other errors or rethrow them
            console.error('Unhandled error:', error);
          }
          resolve(); // Resolve the promise even in case of error
        });
    }));    
    return response;
  }

  async uploadFile(url, file, onProgressCallback) {
    let response;
    await Promise.resolve(new Promise((resolve) => {
      var xhttp = new XMLHttpRequest();
      xhttp.open("PUT", url, true);
      xhttp.setRequestHeader('Content-Type', file.type);
      xhttp.upload.onprogress = onProgressCallback
      xhttp.onreadystatechange = function() {
        if (this.status == 200) {          
          response = {
            status: this.status,
            message: 'File uploaded successfully'
          };
        } else {
          response = {
            status: this.status,
            message: 'An unexpected error has occurred'
          };
        }
        resolve();      
      };
      xhttp.send(file);
    }));
    return response;
  }

}
