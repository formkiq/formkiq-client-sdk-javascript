import { ApiClient } from '../ApiClient.js';

export class PresetsApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!PresetsApi.instance) { 
      PresetsApi.instance = this;
		}
  }

  get instance() {
		return PresetsApi.instance;
  }
  
  set instance(value) {
		PresetsApi.instance = value;
	}
    
  async getPresets(siteId, previous, next, limit) {
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
    const url = `${this.apiClient.host}/presets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addPreset(addPresetParameters, siteId) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/presets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addPresetParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deletePreset(presetId, siteId) {
    if (!presetId) {
      return JSON.stringify({
        'message': 'No preset ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/presets/${presetId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getPresetTags(presetId) {
    if (!presetId) {
      return JSON.stringify({
        'message': 'No preset ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/presets/${presetId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addPresetTag(presetId, addPresetTagParameters) {
    if (!presetId) {
      return JSON.stringify({
        'message': 'No preset ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/presets/${presetId}/tags${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addPresetTagParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deletePresetTag(presetId, tagKey) {
    if (!presetId) {
      return JSON.stringify({
        'message': 'No preset ID specified'
      });
    }
    if (!tagKey) {
      return JSON.stringify({
        'message': 'No tag key specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `${this.apiClient.host}/presets/${presetId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  buildPresetParametersForAdd(name, tags) {
    return new AddPresetParameters(name, tags);
  }

  buildPresetTagParametersForAdd(key, value) {
    return new AddPresetTagParameters(key, value);
  }

}

export class AddPresetParameters {

  constructor(name, tags) {
    if (name) {
      this.name = name;
    }
    if (tags) {
      this.tags = tags;
    }
  }

}

export class AddPresetTagParameters {

  constructor(key, value) {
    if (key) {
      this.key = key;
    }
    if (value) {
      this.value = value;
    }
  }

}