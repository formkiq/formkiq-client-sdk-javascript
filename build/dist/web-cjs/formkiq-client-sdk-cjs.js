'use strict';

var exports = {"__esModule": true};

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/** @class */
var AuthenticationDetails = /*#__PURE__*/function () {
  /**
   * Constructs a new AuthenticationDetails object
   * @param {object=} data Creation options.
   * @param {string} data.Username User being authenticated.
   * @param {string} data.Password Plain-text password to authenticate with.
   * @param {(AttributeArg[])?} data.ValidationData Application extra metadata.
   * @param {(AttributeArg[])?} data.AuthParamaters Authentication paramaters for custom auth.
   */
  function AuthenticationDetails(data) {
    var _ref = data || {},
      ValidationData = _ref.ValidationData,
      Username = _ref.Username,
      Password = _ref.Password,
      AuthParameters = _ref.AuthParameters,
      ClientMetadata = _ref.ClientMetadata;
    this.validationData = ValidationData || {};
    this.authParameters = AuthParameters || {};
    this.clientMetadata = ClientMetadata || {};
    this.username = Username;
    this.password = Password;
  }

  /**
   * @returns {string} the record's username
   */
  var _proto = AuthenticationDetails.prototype;
  _proto.getUsername = function getUsername() {
    return this.username;
  }

  /**
   * @returns {string} the record's password
   */;
  _proto.getPassword = function getPassword() {
    return this.password;
  }

  /**
   * @returns {Array} the record's validationData
   */;
  _proto.getValidationData = function getValidationData() {
    return this.validationData;
  }

  /**
   * @returns {Array} the record's authParameters
   */;
  _proto.getAuthParameters = function getAuthParameters() {
    return this.authParameters;
  }

  /**
   * @returns {ClientMetadata} the clientMetadata for a Lambda trigger
   */;
  _proto.getClientMetadata = function getClientMetadata() {
    return this.clientMetadata;
  };
  return AuthenticationDetails;
}();

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var crypto;

// Native crypto from window (Browser)
if (typeof window !== 'undefined' && window.crypto) {
  crypto = window.crypto;
}

// Native (experimental IE 11) crypto from window (Browser)
if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
  crypto = window.msCrypto;
}

// Native crypto from global (NodeJS)
if (!crypto && typeof global$1 !== 'undefined' && global$1.crypto) {
  crypto = global$1.crypto;
}

// Native crypto import via require (NodeJS)
if (!crypto && typeof require === 'function') {
  try {
    crypto = require('crypto');
  } catch (err) {}
}

/*
 * Cryptographically secure pseudorandom number generator
 * As Math.random() is cryptographically not safe to use
 */
function cryptoSecureRandomInt() {
  if (crypto) {
    // Use getRandomValues method (Browser)
    if (typeof crypto.getRandomValues === 'function') {
      try {
        return crypto.getRandomValues(new Uint32Array(1))[0];
      } catch (err) {}
    }

    // Use randomBytes method (NodeJS)
    if (typeof crypto.randomBytes === 'function') {
      try {
        return crypto.randomBytes(4).readInt32LE();
      } catch (err) {}
    }
  }
  throw new Error('Native crypto module could not be used to get secure random number.');
}

/**
 * Hex encoding strategy.
 * Converts a word array to a hex string.
 * @param {WordArray} wordArray The word array.
 * @return {string} The hex string.
 * @static
 */
function hexStringify(wordArray) {
  // Shortcuts
  var words = wordArray.words;
  var sigBytes = wordArray.sigBytes;

  // Convert
  var hexChars = [];
  for (var i = 0; i < sigBytes; i++) {
    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
    hexChars.push((bite >>> 4).toString(16));
    hexChars.push((bite & 0x0f).toString(16));
  }
  return hexChars.join('');
}
var WordArray = /*#__PURE__*/function () {
  function WordArray(words, sigBytes) {
    words = this.words = words || [];
    if (sigBytes != undefined) {
      this.sigBytes = sigBytes;
    } else {
      this.sigBytes = words.length * 4;
    }
  }
  var _proto = WordArray.prototype;
  _proto.random = function random(nBytes) {
    var words = [];
    for (var i = 0; i < nBytes; i += 4) {
      words.push(cryptoSecureRandomInt());
    }
    return new WordArray(words, nBytes);
  };
  _proto.toString = function toString() {
    return hexStringify(this);
  };
  return WordArray;
}();

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

var tslib_es6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  __extends: __extends,
  get __assign () { return __assign; },
  __rest: __rest,
  __decorate: __decorate,
  __param: __param,
  __metadata: __metadata,
  __awaiter: __awaiter,
  __generator: __generator,
  __createBinding: __createBinding,
  __exportStar: __exportStar,
  __values: __values,
  __read: __read,
  __spread: __spread,
  __spreadArrays: __spreadArrays,
  __await: __await,
  __asyncGenerator: __asyncGenerator,
  __asyncDelegator: __asyncDelegator,
  __asyncValues: __asyncValues,
  __makeTemplateObject: __makeTemplateObject,
  __importStar: __importStar,
  __importDefault: __importDefault,
  __classPrivateFieldGet: __classPrivateFieldGet,
  __classPrivateFieldSet: __classPrivateFieldSet
});

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_HASHABLE_LENGTH = exports.INIT = exports.KEY = exports.DIGEST_LENGTH = exports.BLOCK_SIZE = void 0;
/**
 * @internal
 */
exports.BLOCK_SIZE = 64;
/**
 * @internal
 */
exports.DIGEST_LENGTH = 32;
/**
 * @internal
 */
exports.KEY = new Uint32Array([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
]);
/**
 * @internal
 */
exports.INIT = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];
/**
 * @internal
 */
exports.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;

});

var RawSha256_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawSha256 = void 0;

/**
 * @internal
 */
var RawSha256 = /** @class */ (function () {
    function RawSha256() {
        this.state = Int32Array.from(constants.INIT);
        this.temp = new Int32Array(64);
        this.buffer = new Uint8Array(64);
        this.bufferLength = 0;
        this.bytesHashed = 0;
        /**
         * @internal
         */
        this.finished = false;
    }
    RawSha256.prototype.update = function (data) {
        if (this.finished) {
            throw new Error("Attempted to update an already finished hash.");
        }
        var position = 0;
        var byteLength = data.byteLength;
        this.bytesHashed += byteLength;
        if (this.bytesHashed * 8 > constants.MAX_HASHABLE_LENGTH) {
            throw new Error("Cannot hash more than 2^53 - 1 bits");
        }
        while (byteLength > 0) {
            this.buffer[this.bufferLength++] = data[position++];
            byteLength--;
            if (this.bufferLength === constants.BLOCK_SIZE) {
                this.hashBuffer();
                this.bufferLength = 0;
            }
        }
    };
    RawSha256.prototype.digest = function () {
        if (!this.finished) {
            var bitsHashed = this.bytesHashed * 8;
            var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
            var undecoratedLength = this.bufferLength;
            bufferView.setUint8(this.bufferLength++, 0x80);
            // Ensure the final block has enough room for the hashed length
            if (undecoratedLength % constants.BLOCK_SIZE >= constants.BLOCK_SIZE - 8) {
                for (var i = this.bufferLength; i < constants.BLOCK_SIZE; i++) {
                    bufferView.setUint8(i, 0);
                }
                this.hashBuffer();
                this.bufferLength = 0;
            }
            for (var i = this.bufferLength; i < constants.BLOCK_SIZE - 8; i++) {
                bufferView.setUint8(i, 0);
            }
            bufferView.setUint32(constants.BLOCK_SIZE - 8, Math.floor(bitsHashed / 0x100000000), true);
            bufferView.setUint32(constants.BLOCK_SIZE - 4, bitsHashed);
            this.hashBuffer();
            this.finished = true;
        }
        // The value in state is little-endian rather than big-endian, so flip
        // each word into a new Uint8Array
        var out = new Uint8Array(constants.DIGEST_LENGTH);
        for (var i = 0; i < 8; i++) {
            out[i * 4] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return out;
    };
    RawSha256.prototype.hashBuffer = function () {
        var _a = this, buffer = _a.buffer, state = _a.state;
        var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
        for (var i = 0; i < constants.BLOCK_SIZE; i++) {
            if (i < 16) {
                this.temp[i] =
                    ((buffer[i * 4] & 0xff) << 24) |
                        ((buffer[i * 4 + 1] & 0xff) << 16) |
                        ((buffer[i * 4 + 2] & 0xff) << 8) |
                        (buffer[i * 4 + 3] & 0xff);
            }
            else {
                var u = this.temp[i - 2];
                var t1_1 = ((u >>> 17) | (u << 15)) ^ ((u >>> 19) | (u << 13)) ^ (u >>> 10);
                u = this.temp[i - 15];
                var t2_1 = ((u >>> 7) | (u << 25)) ^ ((u >>> 18) | (u << 14)) ^ (u >>> 3);
                this.temp[i] =
                    ((t1_1 + this.temp[i - 7]) | 0) + ((t2_1 + this.temp[i - 16]) | 0);
            }
            var t1 = ((((((state4 >>> 6) | (state4 << 26)) ^
                ((state4 >>> 11) | (state4 << 21)) ^
                ((state4 >>> 25) | (state4 << 7))) +
                ((state4 & state5) ^ (~state4 & state6))) |
                0) +
                ((state7 + ((constants.KEY[i] + this.temp[i]) | 0)) | 0)) |
                0;
            var t2 = ((((state0 >>> 2) | (state0 << 30)) ^
                ((state0 >>> 13) | (state0 << 19)) ^
                ((state0 >>> 22) | (state0 << 10))) +
                ((state0 & state1) ^ (state0 & state2) ^ (state1 & state2))) |
                0;
            state7 = state6;
            state6 = state5;
            state5 = state4;
            state4 = (state3 + t1) | 0;
            state3 = state2;
            state2 = state1;
            state1 = state0;
            state0 = (t1 + t2) | 0;
        }
        state[0] += state0;
        state[1] += state1;
        state[2] += state2;
        state[3] += state3;
        state[4] += state4;
        state[5] += state5;
        state[6] += state6;
        state[7] += state7;
    };
    return RawSha256;
}());
exports.RawSha256 = RawSha256;

});

// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToBuffer = void 0;
var util_utf8_browser_1 = require("@aws-sdk/util-utf8-browser");
// Quick polyfill
var fromUtf8 = typeof Buffer !== "undefined" && Buffer.from
    ? function (input) { return Buffer.from(input, "utf8"); }
    : util_utf8_browser_1.fromUtf8;
function convertToBuffer(data) {
    // Already a Uint8, do nothing
    if (data instanceof Uint8Array)
        return data;
    if (typeof data === "string") {
        return fromUtf8(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
}
exports.convertToBuffer = convertToBuffer;

var convertToBuffer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var isEmptyData_1 = createCommonjsModule(function (module, exports) {
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyData = void 0;
function isEmptyData(data) {
    if (typeof data === "string") {
        return data.length === 0;
    }
    return data.byteLength === 0;
}
exports.isEmptyData = isEmptyData;

});

var numToUint8_1 = createCommonjsModule(function (module, exports) {
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.numToUint8 = void 0;
function numToUint8(num) {
    return new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        num & 0x000000ff,
    ]);
}
exports.numToUint8 = numToUint8;

});

var uint32ArrayFrom_1 = createCommonjsModule(function (module, exports) {
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint32ArrayFrom = void 0;
// IE 11 does not support Array.from, so we do it manually
function uint32ArrayFrom(a_lookUpTable) {
    if (!Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
            return_array[a_index] = a_lookUpTable[a_index];
        }
        return return_array;
    }
    return Uint32Array.from(a_lookUpTable);
}
exports.uint32ArrayFrom = uint32ArrayFrom;

});

var convertToBuffer_1 = /*@__PURE__*/getAugmentedNamespace(convertToBuffer$1);

var build = createCommonjsModule(function (module, exports) {
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint32ArrayFrom = exports.numToUint8 = exports.isEmptyData = exports.convertToBuffer = void 0;

Object.defineProperty(exports, "convertToBuffer", { enumerable: true, get: function () { return convertToBuffer_1.convertToBuffer; } });

Object.defineProperty(exports, "isEmptyData", { enumerable: true, get: function () { return isEmptyData_1.isEmptyData; } });

Object.defineProperty(exports, "numToUint8", { enumerable: true, get: function () { return numToUint8_1.numToUint8; } });

Object.defineProperty(exports, "uint32ArrayFrom", { enumerable: true, get: function () { return uint32ArrayFrom_1.uint32ArrayFrom; } });

});

var tslib_1 = /*@__PURE__*/getAugmentedNamespace(tslib_es6);

var jsSha256 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sha256 = void 0;




var Sha256 = /** @class */ (function () {
    function Sha256(secret) {
        this.hash = new RawSha256_1.RawSha256();
        if (secret) {
            this.outer = new RawSha256_1.RawSha256();
            var inner = bufferFromSecret(secret);
            var outer = new Uint8Array(constants.BLOCK_SIZE);
            outer.set(inner);
            for (var i = 0; i < constants.BLOCK_SIZE; i++) {
                inner[i] ^= 0x36;
                outer[i] ^= 0x5c;
            }
            this.hash.update(inner);
            this.outer.update(outer);
            // overwrite the copied key in memory
            for (var i = 0; i < inner.byteLength; i++) {
                inner[i] = 0;
            }
        }
    }
    Sha256.prototype.update = function (toHash) {
        if ((0, build.isEmptyData)(toHash) || this.error) {
            return;
        }
        try {
            this.hash.update((0, build.convertToBuffer)(toHash));
        }
        catch (e) {
            this.error = e;
        }
    };
    /* This synchronous method keeps compatibility
     * with the v2 aws-sdk.
     */
    Sha256.prototype.digestSync = function () {
        if (this.error) {
            throw this.error;
        }
        if (this.outer) {
            if (!this.outer.finished) {
                this.outer.update(this.hash.digest());
            }
            return this.outer.digest();
        }
        return this.hash.digest();
    };
    /* The underlying digest method here is synchronous.
     * To keep the same interface with the other hash functions
     * the default is to expose this as an async method.
     * However, it can sometimes be useful to have a sync method.
     */
    Sha256.prototype.digest = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2 /*return*/, this.digestSync()];
            });
        });
    };
    return Sha256;
}());
exports.Sha256 = Sha256;
function bufferFromSecret(secret) {
    var input = (0, build.convertToBuffer)(secret);
    if (input.byteLength > constants.BLOCK_SIZE) {
        var bufferHash = new RawSha256_1.RawSha256();
        bufferHash.update(input);
        input = bufferHash.digest();
    }
    var buffer = new Uint8Array(constants.BLOCK_SIZE);
    buffer.set(input);
    return buffer;
}

});

var build$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

(0, tslib_1.__exportStar)(jsSha256, exports);

});

// A small implementation of BigInteger based on http://www-cs-students.stanford.edu/~tjw/jsbn/

/*
 * Copyright (c) 2003-2005  Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */

// (public) Constructor
function BigInteger(a, b) {
  if (a != null) this.fromString(a, b);
}

// return new, unset BigInteger
function nbi() {
  return new BigInteger(null);
}

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = (canary & 0xffffff) == 0xefcafe;

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff,
    xh = x >> 15;
  while (--n >= 0) {
    var l = this[i] & 0x7fff;
    var h = this[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w[j++] = l & 0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff,
    xh = x >> 14;
  while (--n >= 0) {
    var l = this[i] & 0x3fff;
    var h = this[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w[j++] = l & 0xfffffff;
  }
  return c;
}
var inBrowser = typeof navigator !== 'undefined';
if (inBrowser && j_lm && navigator.appName == 'Microsoft Internet Explorer') {
  BigInteger.prototype.am = am2;
  dbits = 30;
} else if (inBrowser && j_lm && navigator.appName != 'Netscape') {
  BigInteger.prototype.am = am1;
  dbits = 26;
} else {
  // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
var BI_RC = new Array();
var rr, vv;
rr = '0'.charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = 'a'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = 'A'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
function int2char(n) {
  return BI_RM.charAt(n);
}
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return c == null ? -1 : c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = x < 0 ? -1 : 0;
  if (x > 0) this[0] = x;else if (x < -1) this[0] = x + this.DV;else this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var k;
  if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else throw new Error('Only radix 2, 4, 8, 16, 32 are supported');
  this.t = 0;
  this.s = 0;
  var i = s.length,
    mi = false,
    sh = 0;
  while (--i >= 0) {
    var x = intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == '-') mi = true;
      continue;
    }
    mi = false;
    if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
      this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
      this[this.t++] = x >> this.DB - sh;
    } else this[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
  }
  this.clamp();
  if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM;
  while (this.t > 0 && this[this.t - 1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if (this.s < 0) return '-' + this.negate().toString(b);
  var k;
  if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else throw new Error('Only radix 2, 4, 8, 16, 32 are supported');
  var km = (1 << k) - 1,
    d,
    m = false,
    r = '',
    i = this.t;
  var p = this.DB - i * this.DB % k;
  if (i-- > 0) {
    if (p < this.DB && (d = this[i] >> p) > 0) {
      m = true;
      r = int2char(d);
    }
    while (i >= 0) {
      if (p < k) {
        d = (this[i] & (1 << p) - 1) << k - p;
        d |= this[--i] >> (p += this.DB - k);
      } else {
        d = this[i] >> (p -= k) & km;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if (d > 0) m = true;
      if (m) r += int2char(d);
    }
  }
  return m ? r : '0';
}

// (public) -this
function bnNegate() {
  var r = nbi();
  BigInteger.ZERO.subTo(this, r);
  return r;
}

// (public) |this|
function bnAbs() {
  return this.s < 0 ? this.negate() : this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s;
  if (r != 0) return r;
  var i = this.t;
  r = i - a.t;
  if (r != 0) return this.s < 0 ? -r : r;
  while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1,
    t;
  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }
  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }
  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }
  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }
  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0;
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i;
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
  for (i = n - 1; i >= 0; --i) r[i] = 0;
  r.t = this.t + n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i];
  r.t = Math.max(this.t - n, 0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / this.DB),
    c = this.s << bs & this.DM,
    i;
  for (i = this.t - 1; i >= 0; --i) {
    r[i + ds + 1] = this[i] >> cbs | c;
    c = (this[i] & bm) << bs;
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t + ds + 1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  r.s = this.s;
  var ds = Math.floor(n / this.DB);
  if (ds >= this.t) {
    r.t = 0;
    return;
  }
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << bs) - 1;
  r[0] = this[ds] >> bs;
  for (var i = ds + 1; i < this.t; ++i) {
    r[i - ds - 1] |= (this[i] & bm) << cbs;
    r[i - ds] = this[i] >> bs;
  }
  if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
  r.t = this.t - ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] - a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c -= a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs();
  var i = x.t;
  r.t = i + y.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
  r.s = 0;
  r.clamp();
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2 * x.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1);
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
      r[i + x.t] -= x.DV;
      r[i + x.t + 1] = 1;
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var pm = m.abs();
  if (pm.t <= 0) return;
  var pt = this.abs();
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
  }
  if (r == null) r = nbi();
  var y = nbi(),
    ts = this.s,
    ms = m.s;
  var nsh = this.DB - nbits(pm[pm.t - 1]);
  // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y);
    pt.lShiftTo(nsh, r);
  } else {
    pm.copyTo(y);
    pt.copyTo(r);
  }
  var ys = y.t;
  var y0 = y[ys - 1];
  if (y0 == 0) return;
  var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
  var d1 = this.FV / yt,
    d2 = (1 << this.F1) / yt,
    e = 1 << this.F2;
  var i = r.t,
    j = i - ys,
    t = q == null ? nbi() : q;
  y.dlShiftTo(j, t);
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t, r);
  }
  BigInteger.ONE.dlShiftTo(ys, t);
  t.subTo(y, y);
  // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0;
  while (--j >= 0) {
    // Estimate quotient digit
    var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
      // Try it out
      y.dlShiftTo(j, t);
      r.subTo(t, r);
      while (r[i] < --qd) r.subTo(t, r);
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q);
    if (ts != ms) BigInteger.ZERO.subTo(q, q);
  }
  r.t = ys;
  r.clamp();
  if (nsh > 0) r.rShiftTo(nsh, r);
  // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a, null, r);
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
  return r;
}

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0;
  var x = this[0];
  if ((x & 1) == 0) return 0;
  var y = x & 3;
  // y == 1/x mod 2^2
  y = y * (2 - (x & 0xf) * y) & 0xf;
  // y == 1/x mod 2^4
  y = y * (2 - (x & 0xff) * y) & 0xff;
  // y == 1/x mod 2^8
  y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff;
  // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = y * (2 - x * y % this.DV) % this.DV;
  // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return y > 0 ? this.DV - y : -y;
}
function bnEquals(a) {
  return this.compareTo(a) == 0;
}

// (protected) r = this + a
function bnpAddTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] + a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c += a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c += a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c > 0) r[i++] = c;else if (c < -1) r[i++] = this.DV + c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) {
  var r = nbi();
  this.addTo(a, r);
  return r;
}

// (public) this - a
function bnSubtract(a) {
  var r = nbi();
  this.subTo(a, r);
  return r;
}

// (public) this * a
function bnMultiply(a) {
  var r = nbi();
  this.multiplyTo(a, r);
  return r;
}

// (public) this / a
function bnDivide(a) {
  var r = nbi();
  this.divRemTo(a, r, null);
  return r;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp & 0x7fff;
  this.mph = this.mp >> 15;
  this.um = (1 << m.DB - 15) - 1;
  this.mt2 = 2 * m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t, r);
  r.divRemTo(this.m, null, r);
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2)
  // pad x so am has enough room later
  x[x.t++] = 0;
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff;
    var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t;
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    // propagate carry
    while (x[j] >= x.DV) {
      x[j] -= x.DV;
      x[++j]++;
    }
  }
  x.clamp();
  x.drShiftTo(this.m.t, x);
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m, callback) {
  var i = e.bitLength(),
    k,
    r = nbv(1),
    z = new Montgomery(m);
  if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;

  // precomputation
  var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1;
  g[1] = z.convert(this);
  if (k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1], g2);
    while (n <= km) {
      g[n] = nbi();
      z.mulTo(g2, g[n - 2], g[n]);
      n += 2;
    }
  }
  var j = e.t - 1,
    w,
    is1 = true,
    r2 = nbi(),
    t;
  i = nbits(e[j]) - 1;
  while (j >= 0) {
    if (i >= k1) w = e[j] >> i - k1 & km;else {
      w = (e[j] & (1 << i + 1) - 1) << k1 - i;
      if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
    }
    n = k;
    while ((w & 1) == 0) {
      w >>= 1;
      --n;
    }
    if ((i -= n) < 0) {
      i += this.DB;
      --j;
    }
    if (is1) {
      // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    } else {
      while (n > 1) {
        z.sqrTo(r, r2);
        z.sqrTo(r2, r);
        n -= 2;
      }
      if (n > 0) z.sqrTo(r, r2);else {
        t = r;
        r = r2;
        r2 = t;
      }
      z.mulTo(r2, g[w], r);
    }
    while (j >= 0 && (e[j] & 1 << i) == 0) {
      z.sqrTo(r, r2);
      t = r;
      r = r2;
      r2 = t;
      if (--i < 0) {
        i = this.DB - 1;
        --j;
      }
    }
  }
  var result = z.revert(r);
  callback(null, result);
  return result;
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.addTo = bnpAddTo;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.modPow = bnModPow;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns a Buffer with a sequence of random nBytes
 *
 * @param {number} nBytes
 * @returns {Buffer} fixed-length sequence of random bytes
 */

function randomBytes(nBytes) {
  return Buffer.from(new WordArray().random(nBytes).toString(), 'hex');
}

/**
 * Tests if a hex string has it most significant bit set (case-insensitive regex)
 */
var HEX_MSB_REGEX = /^[89a-f]/i;
var initN = 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1' + '29024E088A67CC74020BBEA63B139B22514A08798E3404DD' + 'EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245' + 'E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' + 'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3D' + 'C2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F' + '83655D23DCA3AD961C62F356208552BB9ED529077096966D' + '670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B' + 'E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9' + 'DE2BCBF6955817183995497CEA956AE515D2261898FA0510' + '15728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64' + 'ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7' + 'ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6B' + 'F12FFA06D98A0864D87602733EC86A64521F2B18177B200C' + 'BBE117577A615D6C770988C0BAD946E208E24FA074E5AB31' + '43DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF';
var newPasswordRequiredChallengeUserAttributePrefix = 'userAttributes.';

/** @class */
var AuthenticationHelper = /*#__PURE__*/function () {
  /**
   * Constructs a new AuthenticationHelper object
   * @param {string} PoolName Cognito user pool name.
   */
  function AuthenticationHelper(PoolName) {
    this.N = new BigInteger(initN, 16);
    this.g = new BigInteger('2', 16);
    this.k = new BigInteger(this.hexHash("" + this.padHex(this.N) + this.padHex(this.g)), 16);
    this.smallAValue = this.generateRandomSmallA();
    this.getLargeAValue(function () {});
    this.infoBits = Buffer.from('Caldera Derived Key', 'utf8');
    this.poolName = PoolName;
  }

  /**
   * @returns {BigInteger} small A, a random number
   */
  var _proto = AuthenticationHelper.prototype;
  _proto.getSmallAValue = function getSmallAValue() {
    return this.smallAValue;
  }

  /**
   * @param {nodeCallback<BigInteger>} callback Called with (err, largeAValue)
   * @returns {void}
   */;
  _proto.getLargeAValue = function getLargeAValue(callback) {
    var _this = this;
    if (this.largeAValue) {
      callback(null, this.largeAValue);
    } else {
      this.calculateA(this.smallAValue, function (err, largeAValue) {
        if (err) {
          callback(err, null);
        }
        _this.largeAValue = largeAValue;
        callback(null, _this.largeAValue);
      });
    }
  }

  /**
   * helper function to generate a random big integer
   * @returns {BigInteger} a random value.
   * @private
   */;
  _proto.generateRandomSmallA = function generateRandomSmallA() {
    // This will be interpreted as a postive 128-bit integer
    var hexRandom = randomBytes(128).toString('hex');
    var randomBigInt = new BigInteger(hexRandom, 16);

    // There is no need to do randomBigInt.mod(this.N - 1) as N (3072-bit) is > 128 bytes (1024-bit)

    return randomBigInt;
  }

  /**
   * helper function to generate a random string
   * @returns {string} a random value.
   * @private
   */;
  _proto.generateRandomString = function generateRandomString() {
    return randomBytes(40).toString('base64');
  }

  /**
   * @returns {string} Generated random value included in password hash.
   */;
  _proto.getRandomPassword = function getRandomPassword() {
    return this.randomPassword;
  }

  /**
   * @returns {string} Generated random value included in devices hash.
   */;
  _proto.getSaltDevices = function getSaltDevices() {
    return this.SaltToHashDevices;
  }

  /**
   * @returns {string} Value used to verify devices.
   */;
  _proto.getVerifierDevices = function getVerifierDevices() {
    return this.verifierDevices;
  }

  /**
   * Generate salts and compute verifier.
   * @param {string} deviceGroupKey Devices to generate verifier for.
   * @param {string} username User to generate verifier for.
   * @param {nodeCallback<null>} callback Called with (err, null)
   * @returns {void}
   */;
  _proto.generateHashDevice = function generateHashDevice(deviceGroupKey, username, callback) {
    var _this2 = this;
    this.randomPassword = this.generateRandomString();
    var combinedString = "" + deviceGroupKey + username + ":" + this.randomPassword;
    var hashedString = this.hash(combinedString);
    var hexRandom = randomBytes(16).toString('hex');

    // The random hex will be unambiguously represented as a postive integer
    this.SaltToHashDevices = this.padHex(new BigInteger(hexRandom, 16));
    this.g.modPow(new BigInteger(this.hexHash(this.SaltToHashDevices + hashedString), 16), this.N, function (err, verifierDevicesNotPadded) {
      if (err) {
        callback(err, null);
      }
      _this2.verifierDevices = _this2.padHex(verifierDevicesNotPadded);
      callback(null, null);
    });
  }

  /**
   * Calculate the client's public value A = g^a%N
   * with the generated random number a
   * @param {BigInteger} a Randomly generated small A.
   * @param {nodeCallback<BigInteger>} callback Called with (err, largeAValue)
   * @returns {void}
   * @private
   */;
  _proto.calculateA = function calculateA(a, callback) {
    var _this3 = this;
    this.g.modPow(a, this.N, function (err, A) {
      if (err) {
        callback(err, null);
      }
      if (A.mod(_this3.N).equals(BigInteger.ZERO)) {
        callback(new Error('Illegal paramater. A mod N cannot be 0.'), null);
      }
      callback(null, A);
    });
  }

  /**
   * Calculate the client's value U which is the hash of A and B
   * @param {BigInteger} A Large A value.
   * @param {BigInteger} B Server B value.
   * @returns {BigInteger} Computed U value.
   * @private
   */;
  _proto.calculateU = function calculateU(A, B) {
    this.UHexHash = this.hexHash(this.padHex(A) + this.padHex(B));
    var finalU = new BigInteger(this.UHexHash, 16);
    return finalU;
  }

  /**
   * Calculate a hash from a bitArray
   * @param {Buffer} buf Value to hash.
   * @returns {String} Hex-encoded hash.
   * @private
   */;
  _proto.hash = function hash(buf) {
    var awsCryptoHash = new build$1.Sha256();
    awsCryptoHash.update(buf);
    var resultFromAWSCrypto = awsCryptoHash.digestSync();
    var hashHex = Buffer.from(resultFromAWSCrypto).toString('hex');
    return new Array(64 - hashHex.length).join('0') + hashHex;
  }

  /**
   * Calculate a hash from a hex string
   * @param {String} hexStr Value to hash.
   * @returns {String} Hex-encoded hash.
   * @private
   */;
  _proto.hexHash = function hexHash(hexStr) {
    return this.hash(Buffer.from(hexStr, 'hex'));
  }

  /**
   * Standard hkdf algorithm
   * @param {Buffer} ikm Input key material.
   * @param {Buffer} salt Salt value.
   * @returns {Buffer} Strong key material.
   * @private
   */;
  _proto.computehkdf = function computehkdf(ikm, salt) {
    var infoBitsBuffer = Buffer.concat([this.infoBits, Buffer.from(String.fromCharCode(1), 'utf8')]);
    var awsCryptoHash = new build$1.Sha256(salt);
    awsCryptoHash.update(ikm);
    var resultFromAWSCryptoPrk = awsCryptoHash.digestSync();
    var awsCryptoHashHmac = new build$1.Sha256(resultFromAWSCryptoPrk);
    awsCryptoHashHmac.update(infoBitsBuffer);
    var resultFromAWSCryptoHmac = awsCryptoHashHmac.digestSync();
    var hashHexFromAWSCrypto = resultFromAWSCryptoHmac;
    var currentHex = hashHexFromAWSCrypto.slice(0, 16);
    return currentHex;
  }

  /**
   * Calculates the final hkdf based on computed S value, and computed U value and the key
   * @param {String} username Username.
   * @param {String} password Password.
   * @param {BigInteger} serverBValue Server B value.
   * @param {BigInteger} salt Generated salt.
   * @param {nodeCallback<Buffer>} callback Called with (err, hkdfValue)
   * @returns {void}
   */;
  _proto.getPasswordAuthenticationKey = function getPasswordAuthenticationKey(username, password, serverBValue, salt, callback) {
    var _this4 = this;
    if (serverBValue.mod(this.N).equals(BigInteger.ZERO)) {
      throw new Error('B cannot be zero.');
    }
    this.UValue = this.calculateU(this.largeAValue, serverBValue);
    if (this.UValue.equals(BigInteger.ZERO)) {
      throw new Error('U cannot be zero.');
    }
    var usernamePassword = "" + this.poolName + username + ":" + password;
    var usernamePasswordHash = this.hash(usernamePassword);
    var xValue = new BigInteger(this.hexHash(this.padHex(salt) + usernamePasswordHash), 16);
    this.calculateS(xValue, serverBValue, function (err, sValue) {
      if (err) {
        callback(err, null);
      }
      var hkdf = _this4.computehkdf(Buffer.from(_this4.padHex(sValue), 'hex'), Buffer.from(_this4.padHex(_this4.UValue), 'hex'));
      callback(null, hkdf);
    });
  }

  /**
   * Calculates the S value used in getPasswordAuthenticationKey
   * @param {BigInteger} xValue Salted password hash value.
   * @param {BigInteger} serverBValue Server B value.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.calculateS = function calculateS(xValue, serverBValue, callback) {
    var _this5 = this;
    this.g.modPow(xValue, this.N, function (err, gModPowXN) {
      if (err) {
        callback(err, null);
      }
      var intValue2 = serverBValue.subtract(_this5.k.multiply(gModPowXN));
      intValue2.modPow(_this5.smallAValue.add(_this5.UValue.multiply(xValue)), _this5.N, function (err2, result) {
        if (err2) {
          callback(err2, null);
        }
        callback(null, result.mod(_this5.N));
      });
    });
  }

  /**
   * Return constant newPasswordRequiredChallengeUserAttributePrefix
   * @return {newPasswordRequiredChallengeUserAttributePrefix} constant prefix value
   */;
  _proto.getNewPasswordRequiredChallengeUserAttributePrefix = function getNewPasswordRequiredChallengeUserAttributePrefix() {
    return newPasswordRequiredChallengeUserAttributePrefix;
  }

  /**
   * Returns an unambiguous, even-length hex string of the two's complement encoding of an integer.
   *
   * It is compatible with the hex encoding of Java's BigInteger's toByteArray(), wich returns a
   * byte array containing the two's-complement representation of a BigInteger. The array contains
   * the minimum number of bytes required to represent the BigInteger, including at least one sign bit.
   *
   * Examples showing how ambiguity is avoided by left padding with:
   * 	"00" (for positive values where the most-significant-bit is set)
   *  "FF" (for negative values where the most-significant-bit is set)
   *
   * padHex(bigInteger.fromInt(-236))  === "FF14"
   * padHex(bigInteger.fromInt(20))    === "14"
   *
   * padHex(bigInteger.fromInt(-200))  === "FF38"
   * padHex(bigInteger.fromInt(56))    === "38"
   *
   * padHex(bigInteger.fromInt(-20))   === "EC"
   * padHex(bigInteger.fromInt(236))   === "00EC"
   *
   * padHex(bigInteger.fromInt(-56))   === "C8"
   * padHex(bigInteger.fromInt(200))   === "00C8"
   *
   * @param {BigInteger} bigInt Number to encode.
   * @returns {String} even-length hex string of the two's complement encoding.
   */;
  _proto.padHex = function padHex(bigInt) {
    if (!(bigInt instanceof BigInteger)) {
      throw new Error('Not a BigInteger');
    }
    var isNegative = bigInt.compareTo(BigInteger.ZERO) < 0;

    /* Get a hex string for abs(bigInt) */
    var hexStr = bigInt.abs().toString(16);

    /* Pad hex to even length if needed */
    hexStr = hexStr.length % 2 !== 0 ? "0" + hexStr : hexStr;

    /* Prepend "00" if the most significant bit is set */
    hexStr = HEX_MSB_REGEX.test(hexStr) ? "00" + hexStr : hexStr;
    if (isNegative) {
      /* Flip the bits of the representation */
      var invertedNibbles = hexStr.split('').map(function (x) {
        var invertedNibble = ~parseInt(x, 16) & 0xf;
        return '0123456789ABCDEF'.charAt(invertedNibble);
      }).join('');

      /* After flipping the bits, add one to get the 2's complement representation */
      var flippedBitsBI = new BigInteger(invertedNibbles, 16).add(BigInteger.ONE);
      hexStr = flippedBitsBI.toString(16);

      /*
      For hex strings starting with 'FF8', 'FF' can be dropped, e.g. 0xFFFF80=0xFF80=0x80=-128
      		Any sequence of '1' bits on the left can always be substituted with a single '1' bit
      without changing the represented value.
      		This only happens in the case when the input is 80...00
      */
      if (hexStr.toUpperCase().startsWith('FF8')) {
        hexStr = hexStr.substring(2);
      }
    }
    return hexStr;
  };
  return AuthenticationHelper;
}();

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/** @class */
var CognitoJwtToken = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoJwtToken object
   * @param {string=} token The JWT token.
   */
  function CognitoJwtToken(token) {
    // Assign object
    this.jwtToken = token || '';
    this.payload = this.decodePayload();
  }

  /**
   * @returns {string} the record's token.
   */
  var _proto = CognitoJwtToken.prototype;
  _proto.getJwtToken = function getJwtToken() {
    return this.jwtToken;
  }

  /**
   * @returns {int} the token's expiration (exp member).
   */;
  _proto.getExpiration = function getExpiration() {
    return this.payload.exp;
  }

  /**
   * @returns {int} the token's "issued at" (iat member).
   */;
  _proto.getIssuedAt = function getIssuedAt() {
    return this.payload.iat;
  }

  /**
   * @returns {object} the token's payload.
   */;
  _proto.decodePayload = function decodePayload() {
    var payload = this.jwtToken.split('.')[1];
    try {
      return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    } catch (err) {
      return {};
    }
  };
  return CognitoJwtToken;
}();

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/** @class */
var CognitoAccessToken = /*#__PURE__*/function (_CognitoJwtToken) {
  _inheritsLoose(CognitoAccessToken, _CognitoJwtToken);
  /**
   * Constructs a new CognitoAccessToken object
   * @param {string=} AccessToken The JWT access token.
   */
  function CognitoAccessToken(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      AccessToken = _ref.AccessToken;
    return _CognitoJwtToken.call(this, AccessToken || '') || this;
  }
  return CognitoAccessToken;
}(CognitoJwtToken);

function _inheritsLoose$1(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf$1(subClass, superClass); }
function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

/** @class */
var CognitoIdToken = /*#__PURE__*/function (_CognitoJwtToken) {
  _inheritsLoose$1(CognitoIdToken, _CognitoJwtToken);
  /**
   * Constructs a new CognitoIdToken object
   * @param {string=} IdToken The JWT Id token
   */
  function CognitoIdToken(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      IdToken = _ref.IdToken;
    return _CognitoJwtToken.call(this, IdToken || '') || this;
  }
  return CognitoIdToken;
}(CognitoJwtToken);

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/** @class */
var CognitoRefreshToken = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoRefreshToken object
   * @param {string=} RefreshToken The JWT refresh token.
   */
  function CognitoRefreshToken(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      RefreshToken = _ref.RefreshToken;
    // Assign object
    this.token = RefreshToken || '';
  }

  /**
   * @returns {string} the record's token.
   */
  var _proto = CognitoRefreshToken.prototype;
  _proto.getToken = function getToken() {
    return this.token;
  };
  return CognitoRefreshToken;
}();

// generated by genversion
var version = '5.0.4';

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var BASE_USER_AGENT = "aws-amplify/" + version;
var Platform = {
  userAgent: BASE_USER_AGENT + " js",
  product: '',
  navigator: null,
  isReactNative: false
};
if (typeof navigator !== 'undefined' && navigator.product) {
  Platform.product = navigator.product || '';
  Platform.navigator = navigator || null;
  switch (navigator.product) {
    case 'ReactNative':
      Platform.userAgent = BASE_USER_AGENT + " react-native";
      Platform.isReactNative = true;
      break;
    default:
      Platform.userAgent = BASE_USER_AGENT + " js";
      Platform.isReactNative = false;
      break;
  }
}
var getUserAgent = function getUserAgent() {
  return Platform.userAgent;
};

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/** @class */
var CognitoUserSession = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoUserSession object
   * @param {CognitoIdToken} IdToken The session's Id token.
   * @param {CognitoRefreshToken=} RefreshToken The session's refresh token.
   * @param {CognitoAccessToken} AccessToken The session's access token.
   * @param {int} ClockDrift The saved computer's clock drift or undefined to force calculation.
   */
  function CognitoUserSession(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      IdToken = _ref.IdToken,
      RefreshToken = _ref.RefreshToken,
      AccessToken = _ref.AccessToken,
      ClockDrift = _ref.ClockDrift;
    if (AccessToken == null || IdToken == null) {
      throw new Error('Id token and Access Token must be present.');
    }
    this.idToken = IdToken;
    this.refreshToken = RefreshToken;
    this.accessToken = AccessToken;
    this.clockDrift = ClockDrift === undefined ? this.calculateClockDrift() : ClockDrift;
  }

  /**
   * @returns {CognitoIdToken} the session's Id token
   */
  var _proto = CognitoUserSession.prototype;
  _proto.getIdToken = function getIdToken() {
    return this.idToken;
  }

  /**
   * @returns {CognitoRefreshToken} the session's refresh token
   */;
  _proto.getRefreshToken = function getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * @returns {CognitoAccessToken} the session's access token
   */;
  _proto.getAccessToken = function getAccessToken() {
    return this.accessToken;
  }

  /**
   * @returns {int} the session's clock drift
   */;
  _proto.getClockDrift = function getClockDrift() {
    return this.clockDrift;
  }

  /**
   * @returns {int} the computer's clock drift
   */;
  _proto.calculateClockDrift = function calculateClockDrift() {
    var now = Math.floor(new Date() / 1000);
    var iat = Math.min(this.accessToken.getIssuedAt(), this.idToken.getIssuedAt());
    return now - iat;
  }

  /**
   * Checks to see if the session is still valid based on session expiry information found
   * in tokens and the current time (adjusted with clock drift)
   * @returns {boolean} if the session is still valid
   */;
  _proto.isValid = function isValid() {
    var now = Math.floor(new Date() / 1000);
    var adjusted = now - this.clockDrift;
    return adjusted < this.accessToken.getExpiration() && adjusted < this.idToken.getExpiration();
  };
  return CognitoUserSession;
}();

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** @class */
var DateHelper = /*#__PURE__*/function () {
  function DateHelper() {}
  var _proto = DateHelper.prototype;
  /**
   * @returns {string} The current time in "ddd MMM D HH:mm:ss UTC YYYY" format.
   */
  _proto.getNowString = function getNowString() {
    var now = new Date();
    var weekDay = weekNames[now.getUTCDay()];
    var month = monthNames[now.getUTCMonth()];
    var day = now.getUTCDate();
    var hours = now.getUTCHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    var minutes = now.getUTCMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var seconds = now.getUTCSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var year = now.getUTCFullYear();

    // ddd MMM D HH:mm:ss UTC YYYY
    var dateNow = weekDay + " " + month + " " + day + " " + hours + ":" + minutes + ":" + seconds + " UTC " + year;
    return dateNow;
  };
  return DateHelper;
}();

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/** @class */
var CognitoUserAttribute = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoUserAttribute object
   * @param {string=} Name The record's name
   * @param {string=} Value The record's value
   */
  function CognitoUserAttribute(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      Name = _ref.Name,
      Value = _ref.Value;
    this.Name = Name || '';
    this.Value = Value || '';
  }

  /**
   * @returns {string} the record's value.
   */
  var _proto = CognitoUserAttribute.prototype;
  _proto.getValue = function getValue() {
    return this.Value;
  }

  /**
   * Sets the record's value.
   * @param {string} value The new value.
   * @returns {CognitoUserAttribute} The record for method chaining.
   */;
  _proto.setValue = function setValue(value) {
    this.Value = value;
    return this;
  }

  /**
   * @returns {string} the record's name.
   */;
  _proto.getName = function getName() {
    return this.Name;
  }

  /**
   * Sets the record's name
   * @param {string} name The new name.
   * @returns {CognitoUserAttribute} The record for method chaining.
   */;
  _proto.setName = function setName(name) {
    this.Name = name;
    return this;
  }

  /**
   * @returns {string} a string representation of the record.
   */;
  _proto.toString = function toString() {
    return JSON.stringify(this);
  }

  /**
   * @returns {object} a flat object representing the record.
   */;
  _proto.toJSON = function toJSON() {
    return {
      Name: this.Name,
      Value: this.Value
    };
  };
  return CognitoUserAttribute;
}();

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

var dataMemory = {};

/** @class */
var MemoryStorage = /*#__PURE__*/function () {
  function MemoryStorage() {}
  /**
   * This is used to set a specific item in storage
   * @param {string} key - the key for the item
   * @param {object} value - the value
   * @returns {string} value that was set
   */
  MemoryStorage.setItem = function setItem(key, value) {
    dataMemory[key] = value;
    return dataMemory[key];
  }

  /**
   * This is used to get a specific key from storage
   * @param {string} key - the key for the item
   * This is used to clear the storage
   * @returns {string} the data item
   */;
  MemoryStorage.getItem = function getItem(key) {
    return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
  }

  /**
   * This is used to remove an item from storage
   * @param {string} key - the key being set
   * @returns {boolean} return true
   */;
  MemoryStorage.removeItem = function removeItem(key) {
    return delete dataMemory[key];
  }

  /**
   * This is used to clear the storage
   * @returns {string} nothing
   */;
  MemoryStorage.clear = function clear() {
    dataMemory = {};
    return dataMemory;
  };
  return MemoryStorage;
}();

/** @class */
var StorageHelper = /*#__PURE__*/function () {
  /**
   * This is used to get a storage object
   * @returns {object} the storage
   */
  function StorageHelper() {
    try {
      this.storageWindow = window.localStorage;
      this.storageWindow.setItem('aws.cognito.test-ls', 1);
      this.storageWindow.removeItem('aws.cognito.test-ls');
    } catch (exception) {
      this.storageWindow = MemoryStorage;
    }
  }

  /**
   * This is used to return the storage
   * @returns {object} the storage
   */
  var _proto = StorageHelper.prototype;
  _proto.getStorage = function getStorage() {
    return this.storageWindow;
  };
  return StorageHelper;
}();

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @callback nodeCallback
 * @template T result
 * @param {*} err The operation failure reason, or null.
 * @param {T} result The operation result.
 */

/**
 * @callback onFailure
 * @param {*} err Failure reason.
 */

/**
 * @callback onSuccess
 * @template T result
 * @param {T} result The operation result.
 */

/**
 * @callback mfaRequired
 * @param {*} details MFA challenge details.
 */

/**
 * @callback customChallenge
 * @param {*} details Custom challenge details.
 */

/**
 * @callback inputVerificationCode
 * @param {*} data Server response.
 */

/**
 * @callback authSuccess
 * @param {CognitoUserSession} session The new session.
 * @param {bool=} userConfirmationNecessary User must be confirmed.
 */

var isNavigatorAvailable = typeof navigator !== 'undefined';
var userAgent = isNavigatorAvailable ? Platform.isReactNative ? 'react-native' : navigator.userAgent : 'nodejs';

/** @class */
var CognitoUser = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoUser object
   * @param {object} data Creation options
   * @param {string} data.Username The user's username.
   * @param {CognitoUserPool} data.Pool Pool containing the user.
   * @param {object} data.Storage Optional storage object.
   */
  function CognitoUser(data) {
    if (data == null || data.Username == null || data.Pool == null) {
      throw new Error('Username and Pool information are required.');
    }
    this.username = data.Username || '';
    this.pool = data.Pool;
    this.Session = null;
    this.client = data.Pool.client;
    this.signInUserSession = null;
    this.authenticationFlowType = 'USER_SRP_AUTH';
    this.storage = data.Storage || new StorageHelper().getStorage();
    this.keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId();
    this.userDataKey = this.keyPrefix + "." + this.username + ".userData";
  }

  /**
   * Sets the session for this user
   * @param {CognitoUserSession} signInUserSession the session
   * @returns {void}
   */
  var _proto = CognitoUser.prototype;
  _proto.setSignInUserSession = function setSignInUserSession(signInUserSession) {
    this.clearCachedUserData();
    this.signInUserSession = signInUserSession;
    this.cacheTokens();
  }

  /**
   * @returns {CognitoUserSession} the current session for this user
   */;
  _proto.getSignInUserSession = function getSignInUserSession() {
    return this.signInUserSession;
  }

  /**
   * @returns {string} the user's username
   */;
  _proto.getUsername = function getUsername() {
    return this.username;
  }

  /**
   * @returns {String} the authentication flow type
   */;
  _proto.getAuthenticationFlowType = function getAuthenticationFlowType() {
    return this.authenticationFlowType;
  }

  /**
   * sets authentication flow type
   * @param {string} authenticationFlowType New value.
   * @returns {void}
   */;
  _proto.setAuthenticationFlowType = function setAuthenticationFlowType(authenticationFlowType) {
    this.authenticationFlowType = authenticationFlowType;
  }

  /**
   * This is used for authenticating the user through the custom authentication flow.
   * @param {AuthenticationDetails} authDetails Contains the authentication data
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {customChallenge} callback.customChallenge Custom challenge
   *        response required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @returns {void}
   */;
  _proto.initiateAuth = function initiateAuth(authDetails, callback) {
    var _this = this;
    var authParameters = authDetails.getAuthParameters();
    authParameters.USERNAME = this.username;
    var clientMetaData = Object.keys(authDetails.getValidationData()).length !== 0 ? authDetails.getValidationData() : authDetails.getClientMetadata();
    var jsonReq = {
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: this.pool.getClientId(),
      AuthParameters: authParameters,
      ClientMetadata: clientMetaData
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('InitiateAuth', jsonReq, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      var challengeName = data.ChallengeName;
      var challengeParameters = data.ChallengeParameters;
      if (challengeName === 'CUSTOM_CHALLENGE') {
        _this.Session = data.Session;
        return callback.customChallenge(challengeParameters);
      }
      _this.signInUserSession = _this.getCognitoUserSession(data.AuthenticationResult);
      _this.cacheTokens();
      return callback.onSuccess(_this.signInUserSession);
    });
  }

  /**
   * This is used for authenticating the user.
   * stuff
   * @param {AuthenticationDetails} authDetails Contains the authentication data
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {newPasswordRequired} callback.newPasswordRequired new
   *        password and any required attributes are required to continue
   * @param {mfaRequired} callback.mfaRequired MFA code
   *        required to continue.
   * @param {customChallenge} callback.customChallenge Custom challenge
   *        response required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @returns {void}
   */;
  _proto.authenticateUser = function authenticateUser(authDetails, callback) {
    if (this.authenticationFlowType === 'USER_PASSWORD_AUTH') {
      return this.authenticateUserPlainUsernamePassword(authDetails, callback);
    } else if (this.authenticationFlowType === 'USER_SRP_AUTH' || this.authenticationFlowType === 'CUSTOM_AUTH') {
      return this.authenticateUserDefaultAuth(authDetails, callback);
    }
    return callback.onFailure(new Error('Authentication flow type is invalid.'));
  }

  /**
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   * It calls the AuthenticationHelper for SRP related
   * stuff
   * @param {AuthenticationDetails} authDetails Contains the authentication data
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {newPasswordRequired} callback.newPasswordRequired new
   *        password and any required attributes are required to continue
   * @param {mfaRequired} callback.mfaRequired MFA code
   *        required to continue.
   * @param {customChallenge} callback.customChallenge Custom challenge
   *        response required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @returns {void}
   */;
  _proto.authenticateUserDefaultAuth = function authenticateUserDefaultAuth(authDetails, callback) {
    var _this2 = this;
    var authenticationHelper = new AuthenticationHelper(this.pool.getUserPoolName());
    var dateHelper = new DateHelper();
    var serverBValue;
    var salt;
    var authParameters = {};
    if (this.deviceKey != null) {
      authParameters.DEVICE_KEY = this.deviceKey;
    }
    authParameters.USERNAME = this.username;
    authenticationHelper.getLargeAValue(function (errOnAValue, aValue) {
      // getLargeAValue callback start
      if (errOnAValue) {
        callback.onFailure(errOnAValue);
      }
      authParameters.SRP_A = aValue.toString(16);
      if (_this2.authenticationFlowType === 'CUSTOM_AUTH') {
        authParameters.CHALLENGE_NAME = 'SRP_A';
      }
      var clientMetaData = Object.keys(authDetails.getValidationData()).length !== 0 ? authDetails.getValidationData() : authDetails.getClientMetadata();
      var jsonReq = {
        AuthFlow: _this2.authenticationFlowType,
        ClientId: _this2.pool.getClientId(),
        AuthParameters: authParameters,
        ClientMetadata: clientMetaData
      };
      if (_this2.getUserContextData(_this2.username)) {
        jsonReq.UserContextData = _this2.getUserContextData(_this2.username);
      }
      _this2.client.request('InitiateAuth', jsonReq, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        var challengeParameters = data.ChallengeParameters;
        _this2.username = challengeParameters.USER_ID_FOR_SRP;
        _this2.userDataKey = _this2.keyPrefix + "." + _this2.username + ".userData";
        serverBValue = new BigInteger(challengeParameters.SRP_B, 16);
        salt = new BigInteger(challengeParameters.SALT, 16);
        _this2.getCachedDeviceKeyAndPassword();
        authenticationHelper.getPasswordAuthenticationKey(_this2.username, authDetails.getPassword(), serverBValue, salt, function (errOnHkdf, hkdf) {
          // getPasswordAuthenticationKey callback start
          if (errOnHkdf) {
            callback.onFailure(errOnHkdf);
          }
          var dateNow = dateHelper.getNowString();
          var concatBuffer = Buffer.concat([Buffer.from(_this2.pool.getUserPoolName(), 'utf8'), Buffer.from(_this2.username, 'utf8'), Buffer.from(challengeParameters.SECRET_BLOCK, 'base64'), Buffer.from(dateNow, 'utf8')]);
          var awsCryptoHash = new build$1.Sha256(hkdf);
          awsCryptoHash.update(concatBuffer);
          var resultFromAWSCrypto = awsCryptoHash.digestSync();
          var signatureString = Buffer.from(resultFromAWSCrypto).toString('base64');
          var challengeResponses = {};
          challengeResponses.USERNAME = _this2.username;
          challengeResponses.PASSWORD_CLAIM_SECRET_BLOCK = challengeParameters.SECRET_BLOCK;
          challengeResponses.TIMESTAMP = dateNow;
          challengeResponses.PASSWORD_CLAIM_SIGNATURE = signatureString;
          if (_this2.deviceKey != null) {
            challengeResponses.DEVICE_KEY = _this2.deviceKey;
          }
          var respondToAuthChallenge = function respondToAuthChallenge(challenge, challengeCallback) {
            return _this2.client.request('RespondToAuthChallenge', challenge, function (errChallenge, dataChallenge) {
              if (errChallenge && errChallenge.code === 'ResourceNotFoundException' && errChallenge.message.toLowerCase().indexOf('device') !== -1) {
                challengeResponses.DEVICE_KEY = null;
                _this2.deviceKey = null;
                _this2.randomPassword = null;
                _this2.deviceGroupKey = null;
                _this2.clearCachedDeviceKeyAndPassword();
                return respondToAuthChallenge(challenge, challengeCallback);
              }
              return challengeCallback(errChallenge, dataChallenge);
            });
          };
          var jsonReqResp = {
            ChallengeName: 'PASSWORD_VERIFIER',
            ClientId: _this2.pool.getClientId(),
            ChallengeResponses: challengeResponses,
            Session: data.Session,
            ClientMetadata: clientMetaData
          };
          if (_this2.getUserContextData()) {
            jsonReqResp.UserContextData = _this2.getUserContextData();
          }
          respondToAuthChallenge(jsonReqResp, function (errAuthenticate, dataAuthenticate) {
            if (errAuthenticate) {
              return callback.onFailure(errAuthenticate);
            }
            return _this2.authenticateUserInternal(dataAuthenticate, authenticationHelper, callback);
          });
          return undefined;
          // getPasswordAuthenticationKey callback end
        });

        return undefined;
      });
      // getLargeAValue callback end
    });
  }

  /**
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   * @param {AuthenticationDetails} authDetails Contains the authentication data.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {mfaRequired} callback.mfaRequired MFA code
   *        required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @returns {void}
   */;
  _proto.authenticateUserPlainUsernamePassword = function authenticateUserPlainUsernamePassword(authDetails, callback) {
    var _this3 = this;
    var authParameters = {};
    authParameters.USERNAME = this.username;
    authParameters.PASSWORD = authDetails.getPassword();
    if (!authParameters.PASSWORD) {
      callback.onFailure(new Error('PASSWORD parameter is required'));
      return;
    }
    var authenticationHelper = new AuthenticationHelper(this.pool.getUserPoolName());
    this.getCachedDeviceKeyAndPassword();
    if (this.deviceKey != null) {
      authParameters.DEVICE_KEY = this.deviceKey;
    }
    var clientMetaData = Object.keys(authDetails.getValidationData()).length !== 0 ? authDetails.getValidationData() : authDetails.getClientMetadata();
    var jsonReq = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.pool.getClientId(),
      AuthParameters: authParameters,
      ClientMetadata: clientMetaData
    };
    if (this.getUserContextData(this.username)) {
      jsonReq.UserContextData = this.getUserContextData(this.username);
    }
    // USER_PASSWORD_AUTH happens in a single round-trip: client sends userName and password,
    // Cognito UserPools verifies password and returns tokens.
    this.client.request('InitiateAuth', jsonReq, function (err, authResult) {
      if (err) {
        return callback.onFailure(err);
      }
      return _this3.authenticateUserInternal(authResult, authenticationHelper, callback);
    });
  }

  /**
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   * @param {object} dataAuthenticate authentication data
   * @param {object} authenticationHelper helper created
   * @param {callback} callback passed on from caller
   * @returns {void}
   */;
  _proto.authenticateUserInternal = function authenticateUserInternal(dataAuthenticate, authenticationHelper, callback) {
    var _this4 = this;
    var challengeName = dataAuthenticate.ChallengeName;
    var challengeParameters = dataAuthenticate.ChallengeParameters;
    if (challengeName === 'SMS_MFA') {
      this.Session = dataAuthenticate.Session;
      return callback.mfaRequired(challengeName, challengeParameters);
    }
    if (challengeName === 'SELECT_MFA_TYPE') {
      this.Session = dataAuthenticate.Session;
      return callback.selectMFAType(challengeName, challengeParameters);
    }
    if (challengeName === 'MFA_SETUP') {
      this.Session = dataAuthenticate.Session;
      return callback.mfaSetup(challengeName, challengeParameters);
    }
    if (challengeName === 'SOFTWARE_TOKEN_MFA') {
      this.Session = dataAuthenticate.Session;
      return callback.totpRequired(challengeName, challengeParameters);
    }
    if (challengeName === 'CUSTOM_CHALLENGE') {
      this.Session = dataAuthenticate.Session;
      return callback.customChallenge(challengeParameters);
    }
    if (challengeName === 'NEW_PASSWORD_REQUIRED') {
      this.Session = dataAuthenticate.Session;
      var userAttributes = null;
      var rawRequiredAttributes = null;
      var requiredAttributes = [];
      var userAttributesPrefix = authenticationHelper.getNewPasswordRequiredChallengeUserAttributePrefix();
      if (challengeParameters) {
        userAttributes = JSON.parse(dataAuthenticate.ChallengeParameters.userAttributes);
        rawRequiredAttributes = JSON.parse(dataAuthenticate.ChallengeParameters.requiredAttributes);
      }
      if (rawRequiredAttributes) {
        for (var i = 0; i < rawRequiredAttributes.length; i++) {
          requiredAttributes[i] = rawRequiredAttributes[i].substr(userAttributesPrefix.length);
        }
      }
      return callback.newPasswordRequired(userAttributes, requiredAttributes);
    }
    if (challengeName === 'DEVICE_SRP_AUTH') {
      this.Session = dataAuthenticate.Session;
      this.getDeviceResponse(callback);
      return undefined;
    }
    this.signInUserSession = this.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
    this.challengeName = challengeName;
    this.cacheTokens();
    var newDeviceMetadata = dataAuthenticate.AuthenticationResult.NewDeviceMetadata;
    if (newDeviceMetadata == null) {
      return callback.onSuccess(this.signInUserSession);
    }
    authenticationHelper.generateHashDevice(dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey, dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey, function (errGenHash) {
      if (errGenHash) {
        return callback.onFailure(errGenHash);
      }
      var deviceSecretVerifierConfig = {
        Salt: Buffer.from(authenticationHelper.getSaltDevices(), 'hex').toString('base64'),
        PasswordVerifier: Buffer.from(authenticationHelper.getVerifierDevices(), 'hex').toString('base64')
      };
      _this4.verifierDevices = deviceSecretVerifierConfig.PasswordVerifier;
      _this4.deviceGroupKey = newDeviceMetadata.DeviceGroupKey;
      _this4.randomPassword = authenticationHelper.getRandomPassword();
      _this4.client.request('ConfirmDevice', {
        DeviceKey: newDeviceMetadata.DeviceKey,
        AccessToken: _this4.signInUserSession.getAccessToken().getJwtToken(),
        DeviceSecretVerifierConfig: deviceSecretVerifierConfig,
        DeviceName: userAgent
      }, function (errConfirm, dataConfirm) {
        if (errConfirm) {
          return callback.onFailure(errConfirm);
        }
        _this4.deviceKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey;
        _this4.cacheDeviceKeyAndPassword();
        if (dataConfirm.UserConfirmationNecessary === true) {
          return callback.onSuccess(_this4.signInUserSession, dataConfirm.UserConfirmationNecessary);
        }
        return callback.onSuccess(_this4.signInUserSession);
      });
      return undefined;
    });
    return undefined;
  }

  /**
   * This method is user to complete the NEW_PASSWORD_REQUIRED challenge.
   * Pass the new password with any new user attributes to be updated.
   * User attribute keys must be of format userAttributes.<attribute_name>.
   * @param {string} newPassword new password for this user
   * @param {object} requiredAttributeData map with values for all required attributes
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {mfaRequired} callback.mfaRequired MFA code required to continue.
   * @param {customChallenge} callback.customChallenge Custom challenge
   *         response required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.completeNewPasswordChallenge = function completeNewPasswordChallenge(newPassword, requiredAttributeData, callback, clientMetadata) {
    var _this5 = this;
    if (!newPassword) {
      return callback.onFailure(new Error('New password is required.'));
    }
    var authenticationHelper = new AuthenticationHelper(this.pool.getUserPoolName());
    var userAttributesPrefix = authenticationHelper.getNewPasswordRequiredChallengeUserAttributePrefix();
    var finalUserAttributes = {};
    if (requiredAttributeData) {
      Object.keys(requiredAttributeData).forEach(function (key) {
        finalUserAttributes[userAttributesPrefix + key] = requiredAttributeData[key];
      });
    }
    finalUserAttributes.NEW_PASSWORD = newPassword;
    finalUserAttributes.USERNAME = this.username;
    var jsonReq = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.pool.getClientId(),
      ChallengeResponses: finalUserAttributes,
      Session: this.Session,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('RespondToAuthChallenge', jsonReq, function (errAuthenticate, dataAuthenticate) {
      if (errAuthenticate) {
        return callback.onFailure(errAuthenticate);
      }
      return _this5.authenticateUserInternal(dataAuthenticate, authenticationHelper, callback);
    });
    return undefined;
  }

  /**
   * This is used to get a session using device authentication. It is called at the end of user
   * authentication
   *
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   * @private
   */;
  _proto.getDeviceResponse = function getDeviceResponse(callback, clientMetadata) {
    var _this6 = this;
    var authenticationHelper = new AuthenticationHelper(this.deviceGroupKey);
    var dateHelper = new DateHelper();
    var authParameters = {};
    authParameters.USERNAME = this.username;
    authParameters.DEVICE_KEY = this.deviceKey;
    authenticationHelper.getLargeAValue(function (errAValue, aValue) {
      // getLargeAValue callback start
      if (errAValue) {
        callback.onFailure(errAValue);
      }
      authParameters.SRP_A = aValue.toString(16);
      var jsonReq = {
        ChallengeName: 'DEVICE_SRP_AUTH',
        ClientId: _this6.pool.getClientId(),
        ChallengeResponses: authParameters,
        ClientMetadata: clientMetadata,
        Session: _this6.Session
      };
      if (_this6.getUserContextData()) {
        jsonReq.UserContextData = _this6.getUserContextData();
      }
      _this6.client.request('RespondToAuthChallenge', jsonReq, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        var challengeParameters = data.ChallengeParameters;
        var serverBValue = new BigInteger(challengeParameters.SRP_B, 16);
        var salt = new BigInteger(challengeParameters.SALT, 16);
        authenticationHelper.getPasswordAuthenticationKey(_this6.deviceKey, _this6.randomPassword, serverBValue, salt, function (errHkdf, hkdf) {
          // getPasswordAuthenticationKey callback start
          if (errHkdf) {
            return callback.onFailure(errHkdf);
          }
          var dateNow = dateHelper.getNowString();
          var concatBuffer = Buffer.concat([Buffer.from(_this6.deviceGroupKey, 'utf8'), Buffer.from(_this6.deviceKey, 'utf8'), Buffer.from(challengeParameters.SECRET_BLOCK, 'base64'), Buffer.from(dateNow, 'utf8')]);
          var awsCryptoHash = new build$1.Sha256(hkdf);
          awsCryptoHash.update(concatBuffer);
          var resultFromAWSCrypto = awsCryptoHash.digestSync();
          var signatureString = Buffer.from(resultFromAWSCrypto).toString('base64');
          var challengeResponses = {};
          challengeResponses.USERNAME = _this6.username;
          challengeResponses.PASSWORD_CLAIM_SECRET_BLOCK = challengeParameters.SECRET_BLOCK;
          challengeResponses.TIMESTAMP = dateNow;
          challengeResponses.PASSWORD_CLAIM_SIGNATURE = signatureString;
          challengeResponses.DEVICE_KEY = _this6.deviceKey;
          var jsonReqResp = {
            ChallengeName: 'DEVICE_PASSWORD_VERIFIER',
            ClientId: _this6.pool.getClientId(),
            ChallengeResponses: challengeResponses,
            Session: data.Session
          };
          if (_this6.getUserContextData()) {
            jsonReqResp.UserContextData = _this6.getUserContextData();
          }
          _this6.client.request('RespondToAuthChallenge', jsonReqResp, function (errAuthenticate, dataAuthenticate) {
            if (errAuthenticate) {
              return callback.onFailure(errAuthenticate);
            }
            _this6.signInUserSession = _this6.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
            _this6.cacheTokens();
            return callback.onSuccess(_this6.signInUserSession);
          });
          return undefined;
          // getPasswordAuthenticationKey callback end
        });

        return undefined;
      });
      // getLargeAValue callback end
    });
  }

  /**
   * This is used for a certain user to confirm the registration by using a confirmation code
   * @param {string} confirmationCode Code entered by user.
   * @param {bool} forceAliasCreation Allow migrating from an existing email / phone number.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.confirmRegistration = function confirmRegistration(confirmationCode, forceAliasCreation, callback, clientMetadata) {
    var jsonReq = {
      ClientId: this.pool.getClientId(),
      ConfirmationCode: confirmationCode,
      Username: this.username,
      ForceAliasCreation: forceAliasCreation,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('ConfirmSignUp', jsonReq, function (err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, 'SUCCESS');
    });
  }

  /**
   * This is used by the user once he has the responses to a custom challenge
   * @param {string} answerChallenge The custom challenge answer.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {customChallenge} callback.customChallenge
   *    Custom challenge response required to continue.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.sendCustomChallengeAnswer = function sendCustomChallengeAnswer(answerChallenge, callback, clientMetadata) {
    var _this7 = this;
    var challengeResponses = {};
    challengeResponses.USERNAME = this.username;
    challengeResponses.ANSWER = answerChallenge;
    var authenticationHelper = new AuthenticationHelper(this.pool.getUserPoolName());
    this.getCachedDeviceKeyAndPassword();
    if (this.deviceKey != null) {
      challengeResponses.DEVICE_KEY = this.deviceKey;
    }
    var jsonReq = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ChallengeResponses: challengeResponses,
      ClientId: this.pool.getClientId(),
      Session: this.Session,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('RespondToAuthChallenge', jsonReq, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      return _this7.authenticateUserInternal(data, authenticationHelper, callback);
    });
  }

  /**
   * This is used by the user once he has an MFA code
   * @param {string} confirmationCode The MFA code entered by the user.
   * @param {object} callback Result callback map.
   * @param {string} mfaType The mfa we are replying to.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {authSuccess} callback.onSuccess Called on success with the new session.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.sendMFACode = function sendMFACode(confirmationCode, callback, mfaType, clientMetadata) {
    var _this8 = this;
    var challengeResponses = {};
    challengeResponses.USERNAME = this.username;
    challengeResponses.SMS_MFA_CODE = confirmationCode;
    var mfaTypeSelection = mfaType || 'SMS_MFA';
    if (mfaTypeSelection === 'SOFTWARE_TOKEN_MFA') {
      challengeResponses.SOFTWARE_TOKEN_MFA_CODE = confirmationCode;
    }
    if (this.deviceKey != null) {
      challengeResponses.DEVICE_KEY = this.deviceKey;
    }
    var jsonReq = {
      ChallengeName: mfaTypeSelection,
      ChallengeResponses: challengeResponses,
      ClientId: this.pool.getClientId(),
      Session: this.Session,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('RespondToAuthChallenge', jsonReq, function (err, dataAuthenticate) {
      if (err) {
        return callback.onFailure(err);
      }
      var challengeName = dataAuthenticate.ChallengeName;
      if (challengeName === 'DEVICE_SRP_AUTH') {
        _this8.getDeviceResponse(callback);
        return undefined;
      }
      _this8.signInUserSession = _this8.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
      _this8.cacheTokens();
      if (dataAuthenticate.AuthenticationResult.NewDeviceMetadata == null) {
        return callback.onSuccess(_this8.signInUserSession);
      }
      var authenticationHelper = new AuthenticationHelper(_this8.pool.getUserPoolName());
      authenticationHelper.generateHashDevice(dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey, dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey, function (errGenHash) {
        if (errGenHash) {
          return callback.onFailure(errGenHash);
        }
        var deviceSecretVerifierConfig = {
          Salt: Buffer.from(authenticationHelper.getSaltDevices(), 'hex').toString('base64'),
          PasswordVerifier: Buffer.from(authenticationHelper.getVerifierDevices(), 'hex').toString('base64')
        };
        _this8.verifierDevices = deviceSecretVerifierConfig.PasswordVerifier;
        _this8.deviceGroupKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey;
        _this8.randomPassword = authenticationHelper.getRandomPassword();
        _this8.client.request('ConfirmDevice', {
          DeviceKey: dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey,
          AccessToken: _this8.signInUserSession.getAccessToken().getJwtToken(),
          DeviceSecretVerifierConfig: deviceSecretVerifierConfig,
          DeviceName: userAgent
        }, function (errConfirm, dataConfirm) {
          if (errConfirm) {
            return callback.onFailure(errConfirm);
          }
          _this8.deviceKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey;
          _this8.cacheDeviceKeyAndPassword();
          if (dataConfirm.UserConfirmationNecessary === true) {
            return callback.onSuccess(_this8.signInUserSession, dataConfirm.UserConfirmationNecessary);
          }
          return callback.onSuccess(_this8.signInUserSession);
        });
        return undefined;
      });
      return undefined;
    });
  }

  /**
   * This is used by an authenticated user to change the current password
   * @param {string} oldUserPassword The current password.
   * @param {string} newUserPassword The requested new password.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.changePassword = function changePassword(oldUserPassword, newUserPassword, callback, clientMetadata) {
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('ChangePassword', {
      PreviousPassword: oldUserPassword,
      ProposedPassword: newUserPassword,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      ClientMetadata: clientMetadata
    }, function (err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, 'SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used by an authenticated user to enable MFA for itself
   * @deprecated
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.enableMFA = function enableMFA(callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback(new Error('User is not authenticated'), null);
    }
    var mfaOptions = [];
    var mfaEnabled = {
      DeliveryMedium: 'SMS',
      AttributeName: 'phone_number'
    };
    mfaOptions.push(mfaEnabled);
    this.client.request('SetUserSettings', {
      MFAOptions: mfaOptions,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, 'SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used by an authenticated user to enable MFA for itself
   * @param {IMfaSettings} smsMfaSettings the sms mfa settings
   * @param {IMFASettings} softwareTokenMfaSettings the software token mfa settings
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.setUserMfaPreference = function setUserMfaPreference(smsMfaSettings, softwareTokenMfaSettings, callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('SetUserMFAPreference', {
      SMSMfaSettings: smsMfaSettings,
      SoftwareTokenMfaSettings: softwareTokenMfaSettings,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, 'SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used by an authenticated user to disable MFA for itself
   * @deprecated
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.disableMFA = function disableMFA(callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback(new Error('User is not authenticated'), null);
    }
    var mfaOptions = [];
    this.client.request('SetUserSettings', {
      MFAOptions: mfaOptions,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, 'SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used by an authenticated user to delete itself
   * @param {nodeCallback<string>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.deleteUser = function deleteUser(callback, clientMetadata) {
    var _this9 = this;
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('DeleteUser', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      ClientMetadata: clientMetadata
    }, function (err) {
      if (err) {
        return callback(err, null);
      }
      _this9.clearCachedUser();
      return callback(null, 'SUCCESS');
    });
    return undefined;
  }

  /**
   * @typedef {CognitoUserAttribute | { Name:string, Value:string }} AttributeArg
   */
  /**
   * This is used by an authenticated user to change a list of attributes
   * @param {AttributeArg[]} attributes A list of the new user attributes.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.updateAttributes = function updateAttributes(attributes, callback, clientMetadata) {
    var _this10 = this;
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('UpdateUserAttributes', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      UserAttributes: attributes,
      ClientMetadata: clientMetadata
    }, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      // update cached user
      return _this10.getUserData(function () {
        return callback(null, 'SUCCESS', result);
      }, {
        bypassCache: true
      });
    });
    return undefined;
  }

  /**
   * This is used by an authenticated user to get a list of attributes
   * @param {nodeCallback<CognitoUserAttribute[]>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.getUserAttributes = function getUserAttributes(callback) {
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('GetUser', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err, userData) {
      if (err) {
        return callback(err, null);
      }
      var attributeList = [];
      for (var i = 0; i < userData.UserAttributes.length; i++) {
        var attribute = {
          Name: userData.UserAttributes[i].Name,
          Value: userData.UserAttributes[i].Value
        };
        var userAttribute = new CognitoUserAttribute(attribute);
        attributeList.push(userAttribute);
      }
      return callback(null, attributeList);
    });
    return undefined;
  }

  /**
   * This was previously used by an authenticated user to get MFAOptions,
   * but no longer returns a meaningful response. Refer to the documentation for
   * how to setup and use MFA: https://docs.amplify.aws/lib/auth/mfa/q/platform/js
   * @deprecated
   * @param {nodeCallback<MFAOptions>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.getMFAOptions = function getMFAOptions(callback) {
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('GetUser', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err, userData) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, userData.MFAOptions);
    });
    return undefined;
  }

  /**
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   */;
  _proto.createGetUserRequest = function createGetUserRequest() {
    return this.client.promisifyRequest('GetUser', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    });
  }

  /**
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   */;
  _proto.refreshSessionIfPossible = function refreshSessionIfPossible(options) {
    var _this11 = this;
    if (options === void 0) {
      options = {};
    }
    // best effort, if not possible
    return new Promise(function (resolve) {
      var refresh = _this11.signInUserSession.getRefreshToken();
      if (refresh && refresh.getToken()) {
        _this11.refreshSession(refresh, resolve, options.clientMetadata);
      } else {
        resolve();
      }
    });
  }

  /**
   * @typedef {Object} GetUserDataOptions
   * @property {boolean} bypassCache - force getting data from Cognito service
   * @property {Record<string, string>} clientMetadata - clientMetadata for getSession
   */

  /**
   * This is used by an authenticated users to get the userData
   * @param {nodeCallback<UserData>} callback Called on success or error.
   * @param {GetUserDataOptions} params
   * @returns {void}
   */;
  _proto.getUserData = function getUserData(callback, params) {
    var _this12 = this;
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      this.clearCachedUserData();
      return callback(new Error('User is not authenticated'), null);
    }
    var userData = this.getUserDataFromCache();
    if (!userData) {
      this.fetchUserData().then(function (data) {
        callback(null, data);
      })["catch"](callback);
      return;
    }
    if (this.isFetchUserDataAndTokenRequired(params)) {
      this.fetchUserData().then(function (data) {
        return _this12.refreshSessionIfPossible(params).then(function () {
          return data;
        });
      }).then(function (data) {
        return callback(null, data);
      })["catch"](callback);
      return;
    }
    try {
      callback(null, JSON.parse(userData));
      return;
    } catch (err) {
      this.clearCachedUserData();
      callback(err, null);
      return;
    }
  }

  /**
   *
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   */;
  _proto.getUserDataFromCache = function getUserDataFromCache() {
    var userData = this.storage.getItem(this.userDataKey);
    return userData;
  }

  /**
   *
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   */;
  _proto.isFetchUserDataAndTokenRequired = function isFetchUserDataAndTokenRequired(params) {
    var _ref = params || {},
      _ref$bypassCache = _ref.bypassCache,
      bypassCache = _ref$bypassCache === void 0 ? false : _ref$bypassCache;
    return bypassCache;
  }
  /**
   *
   * PRIVATE ONLY: This is an internal only method and should not
   * be directly called by the consumers.
   */;
  _proto.fetchUserData = function fetchUserData() {
    var _this13 = this;
    return this.createGetUserRequest().then(function (data) {
      _this13.cacheUserData(data);
      return data;
    });
  }

  /**
   * This is used by an authenticated user to delete a list of attributes
   * @param {string[]} attributeList Names of the attributes to delete.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.deleteAttributes = function deleteAttributes(attributeList, callback) {
    var _this14 = this;
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      return callback(new Error('User is not authenticated'), null);
    }
    this.client.request('DeleteUserAttributes', {
      UserAttributeNames: attributeList,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback(err, null);
      }

      // update cached user
      return _this14.getUserData(function () {
        return callback(null, 'SUCCESS');
      }, {
        bypassCache: true
      });
    });
    return undefined;
  }

  /**
   * This is used by a user to resend a confirmation code
   * @param {nodeCallback<string>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.resendConfirmationCode = function resendConfirmationCode(callback, clientMetadata) {
    var jsonReq = {
      ClientId: this.pool.getClientId(),
      Username: this.username,
      ClientMetadata: clientMetadata
    };
    this.client.request('ResendConfirmationCode', jsonReq, function (err, result) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  }

  /**
   * @typedef {Object} GetSessionOptions
   * @property {Record<string, string>} clientMetadata - clientMetadata for getSession
   */

  /**
   * This is used to get a session, either from the session object
   * or from  the local storage, or by using a refresh token
   *
   * @param {nodeCallback<CognitoUserSession>} callback Called on success or error.
   * @param {GetSessionOptions} options
   * @returns {void}
   */;
  _proto.getSession = function getSession(callback, options) {
    if (options === void 0) {
      options = {};
    }
    if (this.username == null) {
      return callback(new Error('Username is null. Cannot retrieve a new session'), null);
    }
    if (this.signInUserSession != null && this.signInUserSession.isValid()) {
      return callback(null, this.signInUserSession);
    }
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId() + "." + this.username;
    var idTokenKey = keyPrefix + ".idToken";
    var accessTokenKey = keyPrefix + ".accessToken";
    var refreshTokenKey = keyPrefix + ".refreshToken";
    var clockDriftKey = keyPrefix + ".clockDrift";
    if (this.storage.getItem(idTokenKey)) {
      var idToken = new CognitoIdToken({
        IdToken: this.storage.getItem(idTokenKey)
      });
      var accessToken = new CognitoAccessToken({
        AccessToken: this.storage.getItem(accessTokenKey)
      });
      var refreshToken = new CognitoRefreshToken({
        RefreshToken: this.storage.getItem(refreshTokenKey)
      });
      var clockDrift = parseInt(this.storage.getItem(clockDriftKey), 0) || 0;
      var sessionData = {
        IdToken: idToken,
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        ClockDrift: clockDrift
      };
      var cachedSession = new CognitoUserSession(sessionData);
      if (cachedSession.isValid()) {
        this.signInUserSession = cachedSession;
        return callback(null, this.signInUserSession);
      }
      if (!refreshToken.getToken()) {
        return callback(new Error('Cannot retrieve a new session. Please authenticate.'), null);
      }
      this.refreshSession(refreshToken, callback, options.clientMetadata);
    } else {
      callback(new Error('Local storage is missing an ID Token, Please authenticate'), null);
    }
    return undefined;
  }

  /**
   * This uses the refreshToken to retrieve a new session
   * @param {CognitoRefreshToken} refreshToken A previous session's refresh token.
   * @param {nodeCallback<CognitoUserSession>} callback Called on success or error.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.refreshSession = function refreshSession(refreshToken, callback, clientMetadata) {
    var _this15 = this;
    var wrappedCallback = this.pool.wrapRefreshSessionCallback ? this.pool.wrapRefreshSessionCallback(callback) : callback;
    var authParameters = {};
    authParameters.REFRESH_TOKEN = refreshToken.getToken();
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId();
    var lastUserKey = keyPrefix + ".LastAuthUser";
    if (this.storage.getItem(lastUserKey)) {
      this.username = this.storage.getItem(lastUserKey);
      var deviceKeyKey = keyPrefix + "." + this.username + ".deviceKey";
      this.deviceKey = this.storage.getItem(deviceKeyKey);
      authParameters.DEVICE_KEY = this.deviceKey;
    }
    var jsonReq = {
      ClientId: this.pool.getClientId(),
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: authParameters,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('InitiateAuth', jsonReq, function (err, authResult) {
      if (err) {
        if (err.code === 'NotAuthorizedException') {
          _this15.clearCachedUser();
        }
        return wrappedCallback(err, null);
      }
      if (authResult) {
        var authenticationResult = authResult.AuthenticationResult;
        if (!Object.prototype.hasOwnProperty.call(authenticationResult, 'RefreshToken')) {
          authenticationResult.RefreshToken = refreshToken.getToken();
        }
        _this15.signInUserSession = _this15.getCognitoUserSession(authenticationResult);
        _this15.cacheTokens();
        return wrappedCallback(null, _this15.signInUserSession);
      }
      return undefined;
    });
  }

  /**
   * This is used to save the session tokens to local storage
   * @returns {void}
   */;
  _proto.cacheTokens = function cacheTokens() {
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId();
    var idTokenKey = keyPrefix + "." + this.username + ".idToken";
    var accessTokenKey = keyPrefix + "." + this.username + ".accessToken";
    var refreshTokenKey = keyPrefix + "." + this.username + ".refreshToken";
    var clockDriftKey = keyPrefix + "." + this.username + ".clockDrift";
    var lastUserKey = keyPrefix + ".LastAuthUser";
    this.storage.setItem(idTokenKey, this.signInUserSession.getIdToken().getJwtToken());
    this.storage.setItem(accessTokenKey, this.signInUserSession.getAccessToken().getJwtToken());
    this.storage.setItem(refreshTokenKey, this.signInUserSession.getRefreshToken().getToken());
    this.storage.setItem(clockDriftKey, "" + this.signInUserSession.getClockDrift());
    this.storage.setItem(lastUserKey, this.username);
  }

  /**
   * This is to cache user data
   */;
  _proto.cacheUserData = function cacheUserData(userData) {
    this.storage.setItem(this.userDataKey, JSON.stringify(userData));
  }

  /**
   * This is to remove cached user data
   */;
  _proto.clearCachedUserData = function clearCachedUserData() {
    this.storage.removeItem(this.userDataKey);
  };
  _proto.clearCachedUser = function clearCachedUser() {
    this.clearCachedTokens();
    this.clearCachedUserData();
  }

  /**
   * This is used to cache the device key and device group and device password
   * @returns {void}
   */;
  _proto.cacheDeviceKeyAndPassword = function cacheDeviceKeyAndPassword() {
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId() + "." + this.username;
    var deviceKeyKey = keyPrefix + ".deviceKey";
    var randomPasswordKey = keyPrefix + ".randomPasswordKey";
    var deviceGroupKeyKey = keyPrefix + ".deviceGroupKey";
    this.storage.setItem(deviceKeyKey, this.deviceKey);
    this.storage.setItem(randomPasswordKey, this.randomPassword);
    this.storage.setItem(deviceGroupKeyKey, this.deviceGroupKey);
  }

  /**
   * This is used to get current device key and device group and device password
   * @returns {void}
   */;
  _proto.getCachedDeviceKeyAndPassword = function getCachedDeviceKeyAndPassword() {
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId() + "." + this.username;
    var deviceKeyKey = keyPrefix + ".deviceKey";
    var randomPasswordKey = keyPrefix + ".randomPasswordKey";
    var deviceGroupKeyKey = keyPrefix + ".deviceGroupKey";
    if (this.storage.getItem(deviceKeyKey)) {
      this.deviceKey = this.storage.getItem(deviceKeyKey);
      this.randomPassword = this.storage.getItem(randomPasswordKey);
      this.deviceGroupKey = this.storage.getItem(deviceGroupKeyKey);
    }
  }

  /**
   * This is used to clear the device key info from local storage
   * @returns {void}
   */;
  _proto.clearCachedDeviceKeyAndPassword = function clearCachedDeviceKeyAndPassword() {
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId() + "." + this.username;
    var deviceKeyKey = keyPrefix + ".deviceKey";
    var randomPasswordKey = keyPrefix + ".randomPasswordKey";
    var deviceGroupKeyKey = keyPrefix + ".deviceGroupKey";
    this.storage.removeItem(deviceKeyKey);
    this.storage.removeItem(randomPasswordKey);
    this.storage.removeItem(deviceGroupKeyKey);
  }

  /**
   * This is used to clear the session tokens from local storage
   * @returns {void}
   */;
  _proto.clearCachedTokens = function clearCachedTokens() {
    var keyPrefix = "CognitoIdentityServiceProvider." + this.pool.getClientId();
    var idTokenKey = keyPrefix + "." + this.username + ".idToken";
    var accessTokenKey = keyPrefix + "." + this.username + ".accessToken";
    var refreshTokenKey = keyPrefix + "." + this.username + ".refreshToken";
    var lastUserKey = keyPrefix + ".LastAuthUser";
    var clockDriftKey = keyPrefix + "." + this.username + ".clockDrift";
    this.storage.removeItem(idTokenKey);
    this.storage.removeItem(accessTokenKey);
    this.storage.removeItem(refreshTokenKey);
    this.storage.removeItem(lastUserKey);
    this.storage.removeItem(clockDriftKey);
  }

  /**
   * This is used to build a user session from tokens retrieved in the authentication result
   * @param {object} authResult Successful auth response from server.
   * @returns {CognitoUserSession} The new user session.
   * @private
   */;
  _proto.getCognitoUserSession = function getCognitoUserSession(authResult) {
    var idToken = new CognitoIdToken(authResult);
    var accessToken = new CognitoAccessToken(authResult);
    var refreshToken = new CognitoRefreshToken(authResult);
    var sessionData = {
      IdToken: idToken,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    };
    return new CognitoUserSession(sessionData);
  }

  /**
   * This is used to initiate a forgot password request
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {inputVerificationCode?} callback.inputVerificationCode
   *    Optional callback raised instead of onSuccess with response data.
   * @param {onSuccess} callback.onSuccess Called on success.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.forgotPassword = function forgotPassword(callback, clientMetadata) {
    var jsonReq = {
      ClientId: this.pool.getClientId(),
      Username: this.username,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('ForgotPassword', jsonReq, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      if (typeof callback.inputVerificationCode === 'function') {
        return callback.inputVerificationCode(data);
      }
      return callback.onSuccess(data);
    });
  }

  /**
   * This is used to confirm a new password using a confirmationCode
   * @param {string} confirmationCode Code entered by user.
   * @param {string} newPassword Confirm new password.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<void>} callback.onSuccess Called on success.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.confirmPassword = function confirmPassword(confirmationCode, newPassword, callback, clientMetadata) {
    var jsonReq = {
      ClientId: this.pool.getClientId(),
      Username: this.username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('ConfirmForgotPassword', jsonReq, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess('SUCCESS');
    });
  }

  /**
   * This is used to initiate an attribute confirmation request
   * @param {string} attributeName User attribute that needs confirmation.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {inputVerificationCode} callback.inputVerificationCode Called on success.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.getAttributeVerificationCode = function getAttributeVerificationCode(attributeName, callback, clientMetadata) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('GetUserAttributeVerificationCode', {
      AttributeName: attributeName,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      ClientMetadata: clientMetadata
    }, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      if (typeof callback.inputVerificationCode === 'function') {
        return callback.inputVerificationCode(data);
      }
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used to confirm an attribute using a confirmation code
   * @param {string} attributeName Attribute being confirmed.
   * @param {string} confirmationCode Code entered by user.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.verifyAttribute = function verifyAttribute(attributeName, confirmationCode, callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('VerifyUserAttribute', {
      AttributeName: attributeName,
      Code: confirmationCode,
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used to get the device information using the current device key
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<*>} callback.onSuccess Called on success with device data.
   * @returns {void}
   */;
  _proto.getDevice = function getDevice(callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('GetDevice', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      DeviceKey: this.deviceKey
    }, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess(data);
    });
    return undefined;
  }

  /**
   * This is used to forget a specific device
   * @param {string} deviceKey Device key.
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.forgetSpecificDevice = function forgetSpecificDevice(deviceKey, callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('ForgetDevice', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      DeviceKey: deviceKey
    }, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used to forget the current device
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.forgetDevice = function forgetDevice(callback) {
    var _this16 = this;
    this.forgetSpecificDevice(this.deviceKey, {
      onFailure: callback.onFailure,
      onSuccess: function onSuccess(result) {
        _this16.deviceKey = null;
        _this16.deviceGroupKey = null;
        _this16.randomPassword = null;
        _this16.clearCachedDeviceKeyAndPassword();
        return callback.onSuccess(result);
      }
    });
  }

  /**
   * This is used to set the device status as remembered
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.setDeviceStatusRemembered = function setDeviceStatusRemembered(callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('UpdateDeviceStatus', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      DeviceKey: this.deviceKey,
      DeviceRememberedStatus: 'remembered'
    }, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used to set the device status as not remembered
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.setDeviceStatusNotRemembered = function setDeviceStatusNotRemembered(callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('UpdateDeviceStatus', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      DeviceKey: this.deviceKey,
      DeviceRememberedStatus: 'not_remembered'
    }, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used to list all devices for a user
   *
   * @param {int} limit the number of devices returned in a call
   * @param {string | null} paginationToken the pagination token in case any was returned before
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<*>} callback.onSuccess Called on success with device list.
   * @returns {void}
   */;
  _proto.listDevices = function listDevices(limit, paginationToken, callback) {
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    var requestParams = {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
      Limit: limit
    };
    if (paginationToken) {
      requestParams.PaginationToken = paginationToken;
    }
    this.client.request('ListDevices', requestParams, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      return callback.onSuccess(data);
    });
    return undefined;
  }

  /**
   * This is used to globally revoke all tokens issued to a user
   * @param {object} callback Result callback map.
   * @param {onFailure} callback.onFailure Called on any error.
   * @param {onSuccess<string>} callback.onSuccess Called on success.
   * @returns {void}
   */;
  _proto.globalSignOut = function globalSignOut(callback) {
    var _this17 = this;
    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
      return callback.onFailure(new Error('User is not authenticated'));
    }
    this.client.request('GlobalSignOut', {
      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
    }, function (err) {
      if (err) {
        return callback.onFailure(err);
      }
      _this17.clearCachedUser();
      return callback.onSuccess('SUCCESS');
    });
    return undefined;
  }

  /**
   * This is used for the user to signOut of the application and clear the cached tokens.
   * @returns {void}
   */;
  _proto.signOut = function signOut(revokeTokenCallback) {
    var _this18 = this;
    // If tokens won't be revoked, we just clean the client data.
    if (!revokeTokenCallback || typeof revokeTokenCallback !== 'function') {
      this.cleanClientData();
      return;
    }
    this.getSession(function (error, _session) {
      if (error) {
        return revokeTokenCallback(error);
      }
      _this18.revokeTokens(function (err) {
        _this18.cleanClientData();
        revokeTokenCallback(err);
      });
    });
  };
  _proto.revokeTokens = function revokeTokens(revokeTokenCallback) {
    if (revokeTokenCallback === void 0) {
      revokeTokenCallback = function revokeTokenCallback() {};
    }
    if (typeof revokeTokenCallback !== 'function') {
      throw new Error('Invalid revokeTokenCallback. It should be a function.');
    }
    if (!this.signInUserSession) {
      var error = new Error('User is not authenticated');
      return revokeTokenCallback(error);
    }
    if (!this.signInUserSession.getAccessToken()) {
      var _error = new Error('No Access token available');
      return revokeTokenCallback(_error);
    }
    var refreshToken = this.signInUserSession.getRefreshToken().getToken();
    var accessToken = this.signInUserSession.getAccessToken();
    if (this.isSessionRevocable(accessToken)) {
      if (refreshToken) {
        return this.revokeToken({
          token: refreshToken,
          callback: revokeTokenCallback
        });
      }
    }
    revokeTokenCallback();
  };
  _proto.isSessionRevocable = function isSessionRevocable(token) {
    if (token && typeof token.decodePayload === 'function') {
      try {
        var _token$decodePayload = token.decodePayload(),
          origin_jti = _token$decodePayload.origin_jti;
        return !!origin_jti;
      } catch (err) {
        // Nothing to do, token doesnt have origin_jti claim
      }
    }
    return false;
  };
  _proto.cleanClientData = function cleanClientData() {
    this.signInUserSession = null;
    this.clearCachedUser();
  };
  _proto.revokeToken = function revokeToken(_ref2) {
    var token = _ref2.token,
      callback = _ref2.callback;
    this.client.requestWithRetry('RevokeToken', {
      Token: token,
      ClientId: this.pool.getClientId()
    }, function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  }

  /**
   * This is used by a user trying to select a given MFA
   * @param {string} answerChallenge the mfa the user wants
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.sendMFASelectionAnswer = function sendMFASelectionAnswer(answerChallenge, callback) {
    var _this19 = this;
    var challengeResponses = {};
    challengeResponses.USERNAME = this.username;
    challengeResponses.ANSWER = answerChallenge;
    var jsonReq = {
      ChallengeName: 'SELECT_MFA_TYPE',
      ChallengeResponses: challengeResponses,
      ClientId: this.pool.getClientId(),
      Session: this.Session
    };
    if (this.getUserContextData()) {
      jsonReq.UserContextData = this.getUserContextData();
    }
    this.client.request('RespondToAuthChallenge', jsonReq, function (err, data) {
      if (err) {
        return callback.onFailure(err);
      }
      _this19.Session = data.Session;
      if (answerChallenge === 'SMS_MFA') {
        return callback.mfaRequired(data.ChallengeName, data.ChallengeParameters);
      }
      if (answerChallenge === 'SOFTWARE_TOKEN_MFA') {
        return callback.totpRequired(data.ChallengeName, data.ChallengeParameters);
      }
      return undefined;
    });
  }

  /**
   * This returns the user context data for advanced security feature.
   * @returns {string} the user context data from CognitoUserPool
   */;
  _proto.getUserContextData = function getUserContextData() {
    var pool = this.pool;
    return pool.getUserContextData(this.username);
  }

  /**
   * This is used by an authenticated or a user trying to authenticate to associate a TOTP MFA
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.associateSoftwareToken = function associateSoftwareToken(callback) {
    var _this20 = this;
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      this.client.request('AssociateSoftwareToken', {
        Session: this.Session
      }, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        _this20.Session = data.Session;
        return callback.associateSecretCode(data.SecretCode);
      });
    } else {
      this.client.request('AssociateSoftwareToken', {
        AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
      }, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        return callback.associateSecretCode(data.SecretCode);
      });
    }
  }

  /**
   * This is used by an authenticated or a user trying to authenticate to verify a TOTP MFA
   * @param {string} totpCode The MFA code entered by the user.
   * @param {string} friendlyDeviceName The device name we are assigning to the device.
   * @param {nodeCallback<string>} callback Called on success or error.
   * @returns {void}
   */;
  _proto.verifySoftwareToken = function verifySoftwareToken(totpCode, friendlyDeviceName, callback) {
    var _this21 = this;
    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
      this.client.request('VerifySoftwareToken', {
        Session: this.Session,
        UserCode: totpCode,
        FriendlyDeviceName: friendlyDeviceName
      }, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        _this21.Session = data.Session;
        var challengeResponses = {};
        challengeResponses.USERNAME = _this21.username;
        var jsonReq = {
          ChallengeName: 'MFA_SETUP',
          ClientId: _this21.pool.getClientId(),
          ChallengeResponses: challengeResponses,
          Session: _this21.Session
        };
        if (_this21.getUserContextData()) {
          jsonReq.UserContextData = _this21.getUserContextData();
        }
        _this21.client.request('RespondToAuthChallenge', jsonReq, function (errRespond, dataRespond) {
          if (errRespond) {
            return callback.onFailure(errRespond);
          }
          _this21.signInUserSession = _this21.getCognitoUserSession(dataRespond.AuthenticationResult);
          _this21.cacheTokens();
          return callback.onSuccess(_this21.signInUserSession);
        });
        return undefined;
      });
    } else {
      this.client.request('VerifySoftwareToken', {
        AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
        UserCode: totpCode,
        FriendlyDeviceName: friendlyDeviceName
      }, function (err, data) {
        if (err) {
          return callback.onFailure(err);
        }
        return callback.onSuccess(data);
      });
    }
  };
  return CognitoUser;
}();

function unfetch(e,n){return n=n||{},new Promise(function(t,r){var s=new XMLHttpRequest,o=[],u=[],i={},a=function(){return {ok:2==(s.status/100|0),statusText:s.statusText,status:s.status,url:s.responseURL,text:function(){return Promise.resolve(s.responseText)},json:function(){return Promise.resolve(JSON.parse(s.responseText))},blob:function(){return Promise.resolve(new Blob([s.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var l in s.open(n.method||"get",e,!0),s.onload=function(){s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t;}),t(a());},s.onerror=r,s.withCredentials="include"==n.credentials,n.headers)s.setRequestHeader(l,n.headers[l]);s.send(n.body||null);})}

var unfetch$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': unfetch
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(unfetch$1);

var browser = window.fetch || (window.fetch = require$$0.default || require$$0);

// constructor
function UserAgent() {}
// public
UserAgent.prototype.userAgent = getUserAgent();

function _inheritsLoose$2(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf$2(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf$2(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf$2(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var CognitoError = /*#__PURE__*/function (_Error) {
  _inheritsLoose$2(CognitoError, _Error);
  function CognitoError(message, code, name, statusCode) {
    var _this;
    _this = _Error.call(this, message) || this;
    _this.code = code;
    _this.name = name;
    _this.statusCode = statusCode;
    return _this;
  }
  return CognitoError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/** @class */
var Client = /*#__PURE__*/function () {
  /**
   * Constructs a new AWS Cognito Identity Provider client object
   * @param {string} region AWS region
   * @param {string} endpoint endpoint
   * @param {object} fetchOptions options for fetch API (only credentials is supported)
   */
  function Client(region, endpoint, fetchOptions) {
    this.endpoint = endpoint || "https://cognito-idp." + region + ".amazonaws.com/";
    var _ref = fetchOptions || {},
      credentials = _ref.credentials;
    this.fetchOptions = credentials ? {
      credentials: credentials
    } : {};
  }

  /**
   * Makes an unauthenticated request on AWS Cognito Identity Provider API
   * using fetch
   * @param {string} operation API operation
   * @param {object} params Input parameters
   * @returns Promise<object>
   */
  var _proto = Client.prototype;
  _proto.promisifyRequest = function promisifyRequest(operation, params) {
    var _this2 = this;
    return new Promise(function (resolve, reject) {
      _this2.request(operation, params, function (err, data) {
        if (err) {
          reject(new CognitoError(err.message, err.code, err.name, err.statusCode));
        } else {
          resolve(data);
        }
      });
    });
  };
  _proto.requestWithRetry = function requestWithRetry(operation, params, callback) {
    var _this3 = this;
    var MAX_DELAY_IN_MILLIS = 5 * 1000;
    jitteredExponentialRetry(function (p) {
      return new Promise(function (res, rej) {
        _this3.request(operation, p, function (error, result) {
          if (error) {
            rej(error);
          } else {
            res(result);
          }
        });
      });
    }, [params], MAX_DELAY_IN_MILLIS).then(function (result) {
      return callback(null, result);
    })["catch"](function (error) {
      return callback(error);
    });
  }

  /**
   * Makes an unauthenticated request on AWS Cognito Identity Provider API
   * using fetch
   * @param {string} operation API operation
   * @param {object} params Input parameters
   * @param {function} callback Callback called when a response is returned
   * @returns {void}
   */;
  _proto.request = function request(operation, params, callback) {
    var headers = {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': "AWSCognitoIdentityProviderService." + operation,
      'X-Amz-User-Agent': UserAgent.prototype.userAgent,
      'Cache-Control': 'no-store'
    };
    var options = Object.assign({}, this.fetchOptions, {
      headers: headers,
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(params)
    });
    var response;
    fetch(this.endpoint, options).then(function (resp) {
      response = resp;
      return resp;
    }, function (err) {
      // If error happens here, the request failed
      // if it is TypeError throw network error
      if (err instanceof TypeError) {
        throw new Error('Network error');
      }
      throw err;
    }).then(function (resp) {
      return resp.json()["catch"](function () {
        return {};
      });
    }).then(function (data) {
      // return parsed body stream
      if (response.ok) return callback(null, data);

      // Taken from aws-sdk-js/lib/protocol/json.js
      // eslint-disable-next-line no-underscore-dangle
      var code = (data.__type || data.code).split('#').pop();
      var error = new Error(data.message || data.Message || null);
      error.name = code;
      error.code = code;
      return callback(error);
    })["catch"](function (err) {
      // first check if we have a service error
      if (response && response.headers && response.headers.get('x-amzn-errortype')) {
        try {
          var code = response.headers.get('x-amzn-errortype').split(':')[0];
          var error = new Error(response.status ? response.status.toString() : null);
          error.code = code;
          error.name = code;
          error.statusCode = response.status;
          return callback(error);
        } catch (ex) {
          return callback(err);
        }
        // otherwise check if error is Network error
      } else if (err instanceof Error && err.message === 'Network error') {
        err.code = 'NetworkError';
      }
      return callback(err);
    });
  };
  return Client;
}();
var logger = {
  debug: function debug() {
    // Intentionally blank. This package doesn't have logging
  }
};
var isNonRetryableError = function isNonRetryableError(obj) {
  var key = 'nonRetryable';
  return obj && obj[key];
};
function retry(functionToRetry, args, delayFn, attempt) {
  if (attempt === void 0) {
    attempt = 1;
  }
  if (typeof functionToRetry !== 'function') {
    throw Error('functionToRetry must be a function');
  }
  logger.debug(functionToRetry.name + " attempt #" + attempt + " with args: " + JSON.stringify(args));
  return functionToRetry.apply(void 0, args)["catch"](function (err) {
    logger.debug("error on " + functionToRetry.name, err);
    if (isNonRetryableError(err)) {
      logger.debug(functionToRetry.name + " non retryable error", err);
      throw err;
    }
    var retryIn = delayFn(attempt, args, err);
    logger.debug(functionToRetry.name + " retrying in " + retryIn + " ms");
    if (retryIn !== false) {
      return new Promise(function (res) {
        return setTimeout(res, retryIn);
      }).then(function () {
        return retry(functionToRetry, args, delayFn, attempt + 1);
      });
    } else {
      throw err;
    }
  });
}
function jitteredBackoff(maxDelayMs) {
  var BASE_TIME_MS = 100;
  var JITTER_FACTOR = 100;
  return function (attempt) {
    var delay = Math.pow(2, attempt) * BASE_TIME_MS + JITTER_FACTOR * Math.random();
    return delay > maxDelayMs ? false : delay;
  };
}
var MAX_DELAY_MS = 5 * 60 * 1000;
function jitteredExponentialRetry(functionToRetry, args, maxDelayMs) {
  if (maxDelayMs === void 0) {
    maxDelayMs = MAX_DELAY_MS;
  }
  return retry(functionToRetry, args, jitteredBackoff(maxDelayMs));
}

/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
var USER_POOL_ID_MAX_LENGTH = 55;

/** @class */
var CognitoUserPool = /*#__PURE__*/function () {
  /**
   * Constructs a new CognitoUserPool object
   * @param {object} data Creation options.
   * @param {string} data.UserPoolId Cognito user pool id.
   * @param {string} data.ClientId User pool application client id.
   * @param {string} data.endpoint Optional custom service endpoint.
   * @param {object} data.fetchOptions Optional options for fetch API.
   *        (only credentials option is supported)
   * @param {object} data.Storage Optional storage object.
   * @param {boolean} data.AdvancedSecurityDataCollectionFlag Optional:
   *        boolean flag indicating if the data collection is enabled
   *        to support cognito advanced security features. By default, this
   *        flag is set to true.
   */
  function CognitoUserPool(data, wrapRefreshSessionCallback) {
    var _ref = data || {},
      UserPoolId = _ref.UserPoolId,
      ClientId = _ref.ClientId,
      endpoint = _ref.endpoint,
      fetchOptions = _ref.fetchOptions,
      AdvancedSecurityDataCollectionFlag = _ref.AdvancedSecurityDataCollectionFlag;
    if (!UserPoolId || !ClientId) {
      throw new Error('Both UserPoolId and ClientId are required.');
    }
    if (UserPoolId.length > USER_POOL_ID_MAX_LENGTH || !/^[\w-]+_[0-9a-zA-Z]+$/.test(UserPoolId)) {
      throw new Error('Invalid UserPoolId format.');
    }
    var region = UserPoolId.split('_')[0];
    this.userPoolId = UserPoolId;
    this.clientId = ClientId;
    this.client = new Client(region, endpoint, fetchOptions);

    /**
     * By default, AdvancedSecurityDataCollectionFlag is set to true,
     * if no input value is provided.
     */
    this.advancedSecurityDataCollectionFlag = AdvancedSecurityDataCollectionFlag !== false;
    this.storage = data.Storage || new StorageHelper().getStorage();
    if (wrapRefreshSessionCallback) {
      this.wrapRefreshSessionCallback = wrapRefreshSessionCallback;
    }
  }

  /**
   * @returns {string} the user pool id
   */
  var _proto = CognitoUserPool.prototype;
  _proto.getUserPoolId = function getUserPoolId() {
    return this.userPoolId;
  }

  /**
   * @returns {string} the user pool name
   */;
  _proto.getUserPoolName = function getUserPoolName() {
    return this.getUserPoolId().split('_')[1];
  }

  /**
   * @returns {string} the client id
   */;
  _proto.getClientId = function getClientId() {
    return this.clientId;
  }

  /**
   * @typedef {object} SignUpResult
   * @property {CognitoUser} user New user.
   * @property {bool} userConfirmed If the user is already confirmed.
   */
  /**
   * method for signing up a user
   * @param {string} username User's username.
   * @param {string} password Plain-text initial password entered by user.
   * @param {(AttributeArg[])=} userAttributes New user attributes.
   * @param {(AttributeArg[])=} validationData Application metadata.
   * @param {(AttributeArg[])=} clientMetadata Client metadata.
   * @param {nodeCallback<SignUpResult>} callback Called on error or with the new user.
   * @param {ClientMetadata} clientMetadata object which is passed from client to Cognito Lambda trigger
   * @returns {void}
   */;
  _proto.signUp = function signUp(username, password, userAttributes, validationData, callback, clientMetadata) {
    var _this = this;
    var jsonReq = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: userAttributes,
      ValidationData: validationData,
      ClientMetadata: clientMetadata
    };
    if (this.getUserContextData(username)) {
      jsonReq.UserContextData = this.getUserContextData(username);
    }
    this.client.request('SignUp', jsonReq, function (err, data) {
      if (err) {
        return callback(err, null);
      }
      var cognitoUser = {
        Username: username,
        Pool: _this,
        Storage: _this.storage
      };
      var returnData = {
        user: new CognitoUser(cognitoUser),
        userConfirmed: data.UserConfirmed,
        userSub: data.UserSub,
        codeDeliveryDetails: data.CodeDeliveryDetails
      };
      return callback(null, returnData);
    });
  }

  /**
   * method for getting the current user of the application from the local storage
   *
   * @returns {CognitoUser} the user retrieved from storage
   */;
  _proto.getCurrentUser = function getCurrentUser() {
    var lastUserKey = "CognitoIdentityServiceProvider." + this.clientId + ".LastAuthUser";
    var lastAuthUser = this.storage.getItem(lastUserKey);
    if (lastAuthUser) {
      var cognitoUser = {
        Username: lastAuthUser,
        Pool: this,
        Storage: this.storage
      };
      return new CognitoUser(cognitoUser);
    }
    return null;
  }

  /**
   * This method returns the encoded data string used for cognito advanced security feature.
   * This would be generated only when developer has included the JS used for collecting the
   * data on their client. Please refer to documentation to know more about using AdvancedSecurity
   * features
   * @param {string} username the username for the context data
   * @returns {string} the user context data
   **/;
  _proto.getUserContextData = function getUserContextData(username) {
    if (typeof AmazonCognitoAdvancedSecurityData === 'undefined') {
      return undefined;
    }
    /* eslint-disable */
    var amazonCognitoAdvancedSecurityDataConst = AmazonCognitoAdvancedSecurityData;
    /* eslint-enable */

    if (this.advancedSecurityDataCollectionFlag) {
      var advancedSecurityData = amazonCognitoAdvancedSecurityDataConst.getData(username, this.userPoolId, this.clientId);
      if (advancedSecurityData) {
        var userContextData = {
          EncodedData: advancedSecurityData
        };
        return userContextData;
      }
    }
    return {};
  };
  return CognitoUserPool;
}();

var js_cookie = createCommonjsModule(function (module, exports) {
(function (factory) {
	var registeredInModuleLoader;
	{
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
});

class CognitoClient {

  cognitoUserPool = null;
  username = '';
  accessToken = '';
  idToken = '';
  refreshToken = '';

  get cognitoUser() {
    if (!this.username) {
      return null;
    }
    return this.getCognitoUser(this.username);
  }

  constructor(userPoolId, clientId, endpoint = '') {
    this.buildUserPool(userPoolId, clientId, endpoint);
  }

  buildUserPool(userPoolId, clientId, endpoint) {
    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId
    };
    if (endpoint) {
      poolData.endpoint = endpoint;
    }
    this.cognitoUserPool = new CognitoUserPool(poolData);
  }

  getCognitoUser(username) {
    const userData = {
      Username : username,
      Pool : this.cognitoUserPool
    };
    return new CognitoUser(userData);
  }

  refreshSession() {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    if (!this.username) {
      return {
        message: 'No Cognito User available for session refresh'
      };
    }
    let refreshToken = new CognitoRefreshToken(
      {
        RefreshToken: this.refreshTokenValue
      }
    );
    const cognitoUser = this.getCognitoUser(this.username);
    cognitoUser.refreshSession(RefreshToken, (err, session) => {
      if (err) {
        return {
          cognitoErrorCode: err.code,
          message: err.message
        };
      } else {
        this.idToken = session.getIdToken().getJwtToken();
        this.accessToken = session.getAccessToken().getJwtToken();
        this.refreshToken = session.getRefreshToken().getToken();
        return {
          message: 'Session has been refreshed.'
        };
      }
    });
  }

  async login(email, password) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const cognitoUser = this.getCognitoUser(email);
    let cognitoResponse = null;
    await Promise.resolve(new Promise((resolve) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.username = email;
          this.idToken = result.getIdToken().getJwtToken();
          this.accessToken = result.getAccessToken().getJwtToken();
          this.refreshToken = result.getRefreshToken().getToken();
          cognitoResponse = {
            message: 'Cognito User has been logged in.',
            username: this.username,
            idToken: this.idToken,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken
          };
          resolve();
        },
        onFailure: (err) => {
          if (err.code === 'PasswordResetRequiredException') {          
            cognitoUser.forgotPassword({
              onSuccess: () => {
                cognitoResponse = {
                  message: 'Cognito User has been sent an email with password reset instructions.'
                };
                resolve();
              },
              onFailure: (forgotErr) => {
                cognitoResponse = {
                  cognitoErrorCode: forgotErr.code,
                  message: forgotErr.message
                };
                resolve();
              },
            });
          } else {
            cognitoResponse = {
              cognitoErrorCode: err.code,
              message: err.message
            };
            resolve();
          }
        },
        newPasswordRequired: () => {
          cognitoResponse = {
            message: 'Cognito User must change password.'
          };
          resolve();
        },
      });
    }));
    return cognitoResponse;
  }

  register(email, password) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const emailParam = {
      Name: 'email',
      Value: email
    };
    const attributes = [];
    const emailAttribute = new CognitoUserAttribute(emailParam);
    attributes.push(emailAttribute);
    this.cognitoUserPool.signUp(emailParam.Value, password, attributes, null, (err, result) => {
      if (err) {
        return {
          cognitoErrorCode: err.code,
          message: err.message
        };
      }
      return {
        message: 'Cognito User Account created. Email sent to Cognito User for confirmation.'
      };
    });
  }

  confirmUser(userName, confirmationCode) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const cognitoUser = new CognitoUser({
      Username: userName,
      Pool: this.cognitoUserPool
    });
    cognitoUser.confirmRegistration(confirmationCode, false, (err, result) => {
      if (err) {
        return {
          cognitoErrorCode: err.code,
          message: err.message
        };
      }
      return {
        message: 'Cognito User Account has been confirmed.'
      };
    });
  }

  async forgotPassword(email) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.cognitoUserPool
    });
    let response;
    await Promise.resolve(new Promise((resolve) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          response = {
            message: 'Cognito User has been sent an email with password reset instructions.',
            details: data
          };
          resolve();
        },
        onFailure: (err) => {
          response = {
            cognitoErrorCode: err.code,
            message: err.message
          };
          resolve();
        },
      });
    }));
    return response;
  }

  async changePassword(email, oldPassword, newPassword) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: oldPassword
    });
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.cognitoUserPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        return false;
      },
      onFailure: (err) => {
        return {
          cognitoErrorCode: err.code,
          message: 'Current password for this Cognito User is incorrect.'
        };
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
          onSuccess: () => {
            return {
              message: 'Password has been changed for this Cognito User.'
            };
          },
          onFailure: (err) => {
            return {
              cognitoErrorCode: err.code,
              message: err.message
            };
          },
        });
      },
    });
  }

  async confirmPassword(email, verificationCode, password) {
    if (!this.cognitoUserPool) {
      return {
        message: 'No user pool assigned'
      };
    }
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.cognitoUserPool
    });
    let response;
    await Promise.resolve(new Promise((resolve) => {
      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: (data) => {
          response = {
            message: 'Password has been changed for this Cognito User.',
            details: data
          };
          resolve();
        },
        onFailure: (err) => {
          if (err.code === 'ExpiredCodeException') {
            response = {
              cognitoErrorCode: err.code,
              message: 'Verification Code has expired. A new reset password request needs to be made.'
            };
          } else {
            response = {
              cognitoErrorCode: err.code,
              message: err.message
            };
          }
          resolve();
        },
      });
    }));
    return response;
  }

  async confirmRegistration(accountUrl, username, userStatus, session, password) {
    const body = {
      userStatus,
      password,
      session,
      username
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {}
    };
    let response;
    await Promise.resolve(new Promise((resolve) => {
      fetch(accountUrl, options).then(response => response.json())
      .then(data => {
        response = data;
        resolve();
      });
    }));
    return response;
  }

  removeUser() {
    this.username = '';
    this.accessToken = '';
    this.idToken = '';
    this.refreshToken = '';
  }

}

class ApiClient {
    
  host = 'api-demo.tryformkiq.com';
  validDateRegExp = /^d{4}-d{2}-d{2}$/;
  validTZRegExp = /(([+-]?)(d{2}):?(d{0,2}))/;
  userPoolId = ''
  clientId = ''
  cognitoEndpointOverride = ''
  

  get instance() {
		return ApiClient.instance;
	}

	set instance(value) {
		ApiClient.instance = value;
	}

  constructor(host, userPoolId, clientId, cognitoEndpointOverride = '') {
    if (host) {
      host = host.replace('https://', '').replace(/\/+$/, '');
      this.host = host;
    }
    if (userPoolId && clientId) {
      this.userPoolId = userPoolId;
      this.clientId = clientId;
      this.cognitoEndpointOverride = cognitoEndpointOverride;
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
    this.cognitoClient = new CognitoClient(userPoolId, clientId, this.cognitoEndpointOverride);
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
    if (!stripAuthentication && this.cognitoClient && this.cognitoClient.idToken) {
      headers['Authorization'] = this.cognitoClient.idToken;
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
        .then(r =>  r.json().then(data => ({httpStatus: r.status, body: data})))
        .then(obj => {
          response = obj.body;
          if (!response.status) {
            response.status = obj.httpStatus;
          }
          resolve();
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
      xhttp.upload.onprogress = onProgressCallback;
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

class DocumentsApi {

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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/documents/${documentId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addDocument(addOrUpdateDocumentParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    if (limit) {
      params.limit = limit;
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
      params.versionKey = versionKey;
    }
    if (siteId) {
      params.siteId = siteId;
    }
    params.inline = inline;
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
      params.versionKey = versionKey;
    }
    if (siteId) {
      params.siteId = siteId;
    }
    params.inline = inline;
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    const body = {
      versionKey
    };
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    const body = {
      actions
    };
    const url = `https://${this.apiClient.host}/documents/${documentId}/actions${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', body);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUpload(path, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (path) {
      params.path = path;
    }
    const url = `https://${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForNewDocumentUploadWithBody(uploadBody, siteId = null, contentLength = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (contentLength) {
      params.contentLength = contentLength;
    }
    const url = `https://${this.apiClient.host}/documents/upload${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', uploadBody);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getSignedUrlForDocumentReplacementUpload(documentId, path = null, siteId = null, contentLength = null) {
    if (!documentId) {
      return JSON.stringify({
        'message': 'No document ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    if (path) {
      params.path = path;
    }
    if (contentLength) {
      params.contentLength = contentLength;
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    if (path) {
      params.path = path;
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/indices/folder/${indexKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getESignatureConfig(siteId = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/esignature/docusign/config${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async setESignatureConfig(siteId = null, privateKey, userId, clientId) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
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
    if (siteId) {
      params.siteId = siteId;
    }
    const body = {
      status,
      developmentMode,
      emailSubject,
      signers
    };
    if (carbonCopies.length) {
      body.carbonCopies = carbonCopies;
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

class AddOrUpdateDocumentParameters {

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

  addChildDocument(content, contentType, path, tags, actions) {
    const document = new AddOrUpdateDocumentParameters(content, contentType, path, tags, actions);
    this.documents.push(document);
  }

  addAttachment(path, tags) {
    const document = new AddOrUpdateDocumentParameters(null, null, path, tags);
    this.documents.push(document);
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

class WebFormsHandler {
  
  constructor(apiClient, documentsApi) {
    this.apiClient = apiClient || ApiClient.instance;
		this.documentsApi = documentsApi || DocumentsApi.instance;
  }

  checkWebFormsInDocument() {
    const fkqFormElements = Array.from(document.getElementsByTagName('FORM'))
      .filter((formElement) => formElement.classList.contains('fkq-form'));
    fkqFormElements.forEach((fkqFormElement) => {
      fkqFormElement.setAttribute('action', 'JavaScript://');
      fkqFormElement.onsubmit = (event) => {
        this.submitFormkiqForm(event.target);
      };
    });
  }

  async submitFormkiqForm(fkqFormElement) {
    const data = {};
    data.attachmentFields = [];
    data.formFields = [];
    if (fkqFormElement.getAttribute('name')) {
      data.formName = fkqFormElement.getAttribute('name');
    }
    const formNameForCallbacks = data.formName ? data.formName : 'Unknown Form';
    if (onFormSubmitted) {
      onFormSubmitted(formNameForCallbacks);
    }
    const formFieldElements = fkqFormElement.querySelectorAll('input, select, textarea');
    formFieldElements.forEach((formFieldElement) => {
      let formField;
      switch (formFieldElement.tagName) {
        case 'INPUT':
          switch (formFieldElement.type) {
            case 'button':
            case 'reset':
            case 'submit':
              // ignore element
              break;
            case 'checkbox':
            case 'radio':
              let fieldName = '';
              if (formFieldElement.getAttribute('name')) {
                fieldName = formFieldElement.getAttribute('name');
              }
              let formFieldIndex = -1;
              if (fieldName && data.formFields.length) {
                const matchingFormFields = data.formFields.filter((formField) => formField.fieldName === fieldName);
                if (matchingFormFields.length) {
                  formFieldIndex = data.formFields.indexOf(matchingFormFields[0]);
                }
              }
              if (formFieldIndex === -1) {
                formField = {};
                if (fieldName) {
                  formField.fieldName = fieldName;
                }
                if (formFieldElement.type === 'checkbox') {
                  formField.values = [];
                  if (formFieldElement.checked) {
                    formField.values.push(formFieldElement.value);
                  }
                } else {
                  if (formFieldElement.checked) {
                    formField.value = formFieldElement.value;
                  }
                }
                data.formFields.push(formField);
              } else {
                if (formFieldElement.checked) {
                  if (formFieldElement.type === 'checkbox') {
                    data.formFields[formFieldIndex].values.push(formFieldElement.value);
                  } else {
                    data.formFields[formFieldIndex].value = formFieldElement.value;
                  }
                }
              }
              break;
            case 'file':
              const attachmentField = {};
              if (formFieldElement.getAttribute('name')) {
                attachmentField.fieldName = formFieldElement.getAttribute('name');
              }
              if (formFieldElement.value.length) {
                attachmentField.hasFile = true;
              } else {
                attachmentField.hasFile = false;
              }
              data.attachmentFields.push(attachmentField);
              break;
            default:
              formField = {};
              if (formFieldElement.getAttribute('name')) {
                formField.fieldName = formFieldElement.getAttribute('name');
              }
              formField.value = formFieldElement.value;
              data.formFields.push(formField);
              break; 
          }
          break;
        case 'SELECT':
          formField = {};
          if (formFieldElement.getAttribute('name')) {
            formField.fieldName = formFieldElement.getAttribute('name');
          }
          if (formFieldElement.multiple) {
            const selectOptions = Array.from(formFieldElement.options);
            formField.values = selectOptions.filter(option => option.selected).map(option => option.value);
          } else {
            formField.value = formFieldElement.options[formFieldElement.selectedIndex].value;
          }
          data.formFields.push(formField);
          break;
        case 'TEXTAREA':
          formField = {};
          if (formFieldElement.getAttribute('name')) {
            formField.fieldName = formFieldElement.getAttribute('name');
          }
          formField.value = formFieldElement.value;
          data.formFields.push(formField);
          break;
      }
    });
    const content = JSON.stringify(data);
    const tags = [];
    if (data.formName) {
      tags.push(
        {
          key: 'webformName',
          value: JSON.stringify(data.formName).replace(/\"/g, '')
        }
      );
    }
    let path = null;
    if (window.location.href) {
      path = window.location.href;
    }
    const addOrUpdateDocumentParameters = this.documentsApi.buildDocumentParametersForAddOrUpdate(content, 'application/json', path, tags);
    const fileInputElements = Array.from(fkqFormElement.getElementsByTagName('INPUT')).filter((input) => input.type === 'file');
    fileInputElements.forEach((fileInputElement) => {
      if (fileInputElement.value) {
        const path = fileInputElement.value.replace('C:\\fakepath\\', '');
        addOrUpdateDocumentParameters.addAttachment(path, [this.documentsApi.buildDocumentTagParametersForAdd('fieldName', fileInputElement.getAttribute('name'))]);    
      }
    });
    const response = await this.sendFormRequests(addOrUpdateDocumentParameters, fileInputElements);
    if (onFormCompleted) {
      onFormCompleted(formNameForCallbacks, response);
    } else {
      console.log('no onFormCompleted function found for ${formNameForCallbacks}. Response below:');
      console.log(response);
    }
  }

  async sendFormRequests(addOrUpdateDocumentParameters, fileInputElements) {
    const response = {};
    await Promise.resolve(new Promise((resolve) => {
      this.documentsApi.addDocumentUsingPublicPath(addOrUpdateDocumentParameters).then((addResponse) => {
        if (addResponse.documentId) {
          if (addResponse.documents) {
            const attachmentPromises = [];
            addResponse.documents.filter((document) => document.uploadUrl).forEach((document, index) => {
              const fileInputElement = fileInputElements[index];
              if (fileInputElement && fileInputElement.value) {
                const file = fileInputElement.files[0];
                attachmentPromises.push(new Promise((uploadResolve) => {
                  this.apiClient.uploadFile(document.uploadUrl, file).then((uploadResponse) => {
                    uploadResolve();
                  });
                }));
              }
            });
            if (attachmentPromises.length) {
              Promise.all(attachmentPromises).then(() => {
                response.success = true;
                response.message = `Form has been submitted and received, along with ${attachmentPromises.length} attachments.`;
                resolve();
              });
            } else {
              response.success = true;
              response.message = `Form has been submitted and received, but not all attachments were received successfully.`;
              resolve();
            }
          } else {
            response.success = true;
            response.message = `Form has been submitted and received.`;
            resolve();
          }
        } else {
          response.success = false;
          response.message = `Form failed to be processed successfully. Please try again later.`;
          resolve();
        }
        
      });
    }));
    return response;
  }

}

class ConfigurationApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!ConfigurationApi.instance) { 
      ConfigurationApi.instance = this;
		}
  }

  get instance() {
		return ConfigurationApi.instance;
  }
  
  set instance(value) {
		ConfigurationApi.instance = value;
	}
    
  async getConfiguration(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async updateConfiguration(updateConfigurationParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('PATCH', updateConfigurationParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async getApiKeys(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration/apiKeys${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addApiKey(addApiKeyParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration/apiKeys${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addApiKeyParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteApiKey(apiKey, siteId = null) {
    if (!apiKey) {
      return JSON.stringify({
        'message': 'No API Key specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/configuration/apiKeys/${apiKey}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

class PresetsApi {

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
    const url = `https://${this.apiClient.host}/presets${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addPreset(addPresetParameters, siteId) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/presets${this.apiClient.buildQueryString(params)}`;
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
    const url = `https://${this.apiClient.host}/presets/${presetId}${this.apiClient.buildQueryString(params)}`;
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
    const url = `https://${this.apiClient.host}/presets/${presetId}/tags${this.apiClient.buildQueryString(params)}`;
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
    const url = `https://${this.apiClient.host}/presets/${presetId}/tags${this.apiClient.buildQueryString(params)}`;
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
    const url = `https://${this.apiClient.host}/presets/${presetId}/tags/${tagKey}${this.apiClient.buildQueryString(params)}`;
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

class AddPresetParameters {

  constructor(name, tags) {
    if (name) {
      this.name = name;
    }
    if (tags) {
      this.tags = tags;
    }
  }

}

class AddPresetTagParameters {

  constructor(key, value) {
    if (key) {
      this.key = key;
    }
    if (value) {
      this.value = value;
    }
  }

}

class SearchApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!SearchApi.instance) { 
      SearchApi.instance = this;
		}
  }

  get instance() {
		return SearchApi.instance;
  }
  
  set instance(value) {
		SearchApi.instance = value;
	}
    
  async search(searchParameters, siteId, previous, next, limit) {
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
    const url = `https://${this.apiClient.host}/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', searchParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  // docs about documentFulltextSearchBody: https://docs.formkiq.com/docs/1.8.0/reference/README.html#DocumentFulltextSearchBody
  async searchFulltext(documentFulltextSearchBody, siteId = null, limit = null) {
    const params = {};
    if (siteId) {
      params.siteId = siteId;
    }
    if (limit) {
      params.limit = limit;
    }
    const url = `https://${this.apiClient.host}/searchFulltext${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', documentFulltextSearchBody);
    return await this.apiClient.fetchAndRespond(url, options)
  }

  async searchIndices(indexType, siteId, previous, next, limit) {
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
    const url = `https://${this.apiClient.host}/indices/search${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', {indexType});
    return await this.apiClient.fetchAndRespond(url, options);
  }

  buildTagSearchParameters(key, beginsWith, eq) {
    return new TagSearchParameters(key, beginsWith, eq);
  }

}

class TagSearchParameters {

  constructor(key, beginsWith, eq) {
    const query = {
      tag: {}
    };
    if (key) {
      query.tag.key = key;
    }
    if (beginsWith) {
      query.tag.beginsWith = beginsWith;
    } else if (eq) {
      query.tag.eq = eq;
    }
    this.query = query;
  }

}

class SitesApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!SitesApi.instance) { 
      SitesApi.instance = this;
		}
  }

  get instance() {
		return SitesApi.instance;
  }
  
  set instance(value) {
		SitesApi.instance = value;
	}
    
  async getSites(siteId) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/sites${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

class VersionApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!VersionApi.instance) { 
      VersionApi.instance = this;
		}
  }

  get instance() {
		return VersionApi.instance;
  }
  
  set instance(value) {
		VersionApi.instance = value;
	}
    
  async getVersion() {
    const url = `https://${this.apiClient.host}/version`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

class WebhooksApi {

  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    if (!WebhooksApi.instance) { 
      WebhooksApi.instance = this;
		}
  }

  get instance() {
		return WebhooksApi.instance;
  }
  
  set instance(value) {
		WebhooksApi.instance = value;
	}
    
  async getWebhooks(siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/webhooks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('GET');
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async addWebhook(addWebhookParameters, siteId = null) {
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/webhooks${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('POST', addWebhookParameters);
    return await this.apiClient.fetchAndRespond(url, options);
  }

  async deleteWebhook(webhookId, siteId = null) {
    if (!webhookId) {
      return JSON.stringify({
        'message': 'No webhook ID specified'
      });
    }
    const params = {
    };
    if (siteId) {
      params.siteId = siteId;
    }
    const url = `https://${this.apiClient.host}/webhooks/${webhookId}${this.apiClient.buildQueryString(params)}`;
    const options = this.apiClient.buildOptions('DELETE');
    return await this.apiClient.fetchAndRespond(url, options);
  }

}

class FormkiqClient {
    
  constructor(host, userPoolId, clientId, cognitoEndpointOverride = '') {
    this.apiClient = new ApiClient(host, userPoolId, clientId, cognitoEndpointOverride);
    this.configurationApi = new ConfigurationApi();
    this.documentsApi = new DocumentsApi();
    this.presetsApi = new PresetsApi();
    this.searchApi = new SearchApi();
    this.sitesApi = new SitesApi();
    this.versionApi = new VersionApi();
    this.webhooksApi = new WebhooksApi();
    this.webFormsHandler = new WebFormsHandler();
    this.webFormsHandler.checkWebFormsInDocument();
  }

  async login(email, password) {
    if (this.apiClient.cognitoClient) {
      const response = await this.apiClient.cognitoClient.login(email, password);

      // TODO: determine better way of ensuring cognito client is updated across API instances
      this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
      this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

      return response;
    } else {
      return {
        message: 'No authentication client (e.g., Cognito) has been initialized.'
      };
    }
  }

  async logout() {
    const response = await this.apiClient.logout();
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;

    return response;
  }

  resetClient(host, userPoolId, clientId, cognitoEndpointOverride = '') {
    this.apiClient = new ApiClient(host, userPoolId, clientId, cognitoEndpointOverride);
    this.configurationApi.apiClient = this.apiClient;
    this.documentsApi.apiClient = this.apiClient;
    this.presetsApi.apiClient = this.apiClient;
    this.searchApi.apiClient = this.apiClient;
    this.sitesApi.apiClient = this.apiClient;
    this.versionApi.apiClient = this.apiClient;
    this.webhooksApi.apiClient = this.apiClient;
  }

  rebuildCognitoClient(username, idToken, accessToken, refreshToken) {
    this.apiClient.cognitoClient.username = username;
    this.apiClient.cognitoClient.idToken = idToken;
    this.apiClient.cognitoClient.accessToken = accessToken;
    this.apiClient.cognitoClient.refreshToken = refreshToken;
    
    // TODO: determine better way of ensuring cognito client is updated across API instances
    this.configurationApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.documentsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.presetsApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.searchApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.sitesApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.versionApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
    this.webhooksApi.apiClient.cognitoClient = this.apiClient.cognitoClient;
  }

}

exports.FormkiqClient = FormkiqClient;
