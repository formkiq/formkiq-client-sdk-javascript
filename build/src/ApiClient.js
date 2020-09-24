export class ApiClient {
    
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