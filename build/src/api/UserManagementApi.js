import { ApiClient } from '../ApiClient.js';

export class UserManagementApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!UserManagementApi.instance) {
      UserManagementApi.instance = this;
    }
  }

  get instance() {
    return UserManagementApi.instance;
  }

  set instance(value) {
    UserManagementApi.instance = value;
  }

  async getGroups({limit = null, next = null}) {
    const params = {};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/groups${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addGroup({groupBody}) {
    if (!groupBody) {
      return JSON.stringify({
        'message': 'No groupBody specified'
      });
    }
    const url = `${this.apiClient.host}/groups`;
    const options = this.apiClient.buildOptions('POST', groupBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteGroup({groupName}) {
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    const url = `${this.apiClient.host}/groups/${groupName}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getGroupUsers({groupName, limit = null, next = null}) {
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    const params = {groupName};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/groups/${groupName}/users${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addUserToGroup({groupName, userBody}) {
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    if (!userBody) {
      return JSON.stringify({
        'message': 'No userBody specified'
      });
    }
    const url = `${this.apiClient.host}/groups/${groupName}/users`;
    const options = this.apiClient.buildOptions('POST', userBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteUserFromGroup({groupName, username}){
    if (!groupName) {
      return JSON.stringify({
        'message': 'No groupName specified'
      });
    }
    if (!username) {
      return JSON.stringify({
        'message': 'No username specified'
      });
    }
    const url = `${this.apiClient.host}/groups/${groupName}/users/${username}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getUsers({limit = null, next = null}) {
    const params = {siteId};
    if (limit) {
      params.limit = limit;
    }
    if (next && next.length) {
      params.next = next;
    }
    const url = `${this.apiClient.host}/users${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addUser({userBody}) {
    if (!userBody) {
      return JSON.stringify({
        'message': 'No userBody specified'
      });
    }
    const url = `${this.apiClient.host}/users`;
    const options = this.apiClient.buildOptions('POST', userBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getUser({username}) {
    if (!username) {
      return JSON.stringify({
        'message': 'No username specified'
      });
    }
    const url = `${this.apiClient.host}/users/${username}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteUser({username}) {
    if (!username) {
      return JSON.stringify({
        'message': 'No username specified'
      });
    }
    const url = `${this.apiClient.host}/users/${username}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getUserGroups({username}) {
    if (!username) {
      return JSON.stringify({
        'message': 'No username specified'
      });
    }
    const url = `${this.apiClient.host}/users/${username}/groups`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setUserOperation({username, userOperation}) {
    if (!username) {
      return JSON.stringify({
        'message': 'No username specified'
      });
    }
    if (!userOperation) {
      return JSON.stringify({
        'message': 'No userOperation specified'
      });
    }
    const url = `${this.apiClient.host}/users/${username}/${userOperation}`;
    const options = this.apiClient.buildOptions('PUT',);
    return await this.apiClient.fetchAndRespond(url, options);
  }

}
