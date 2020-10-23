export class StorageClient {

  expiry_ts_prefix = 'expiry_ts_';

  get instance() {
		return StorageClient.instance;
	}

	set instance(value) {
		StorageClient.instance = value;
  }

  constructor() {
    this.initializeStorage();
    if (!StorageClient.instance) { 
      StorageClient.instance = this;
    }
  }

  initializeStorage() {
    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      const localStorage = new LocalStorage('./scratch');
    }
  }

  getItem(key) {
    if (this.isExpired(key)) {
      localStorage.removeItem(key);
      this.removeItemExpiry(key);
      return null;
    }
    return localStorage.getItem(key);
  }

  setItem(key, value, expiration) {
    localStorage.setItem(key, value);
    if (expiration) {
      localStorage.setItemExpiry(key, expiration);
    }
  }

  getJson(key) {
    if (this.isExpired(key)) {
      localStorage.removeItem(key);
      this.removeItemExpiry(key);
      return null;
    }
    return JSON.parse(localStorage.getItem(key));
  }

  setJson(key, value, expiration) {
    localStorage.setItem(key, JSON.stringify(value));
    if (expiration) {
      localStorage.setItemExpiry(key, expiration);
    }
  }

  getItemExpiry(key) {
    return localStorage.getItem(`${expiry_ts_prefix}${key}`);
  }
  
  setItemExpiry(key, expiration) {
    localStorage.setItem(`${expiry_ts_prefix}${key}`, this.getTimestamp() + expiration);
  }

  removeItemExpiry(key) {
    localStorage.removeItem(`${expiry_ts_prefix}${key}`);
  }

  getTimeLeft(key) {
    var expireTime = parseInt(localStorage.getItem(`${expiry_ts_prefix}${key}`));
    if (expireTime && !isNaN(expireTime)) {
      return expireTime - this.getTimestamp();
    }
    return null;
  }

  isExpired(key) {
    var timeLeft = this.getTimeLeft(key);
    return timeLeft !== null && timeLeft <= 0;
  }

  getTimestamp() {
    return Math.floor(((new Date).getTime()) / 1000);
  }

}
