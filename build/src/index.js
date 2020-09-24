import { ApiClient } from './ApiClient.js';
import { DocumentsApi } from './api/DocumentsApi.js';

export class FormkiqClient {
    constructor(host) {
        this.ApiClient = new ApiClient(host);
        this.DocumentsApi = new DocumentsApi();
    }
}