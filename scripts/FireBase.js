/** 
 * used for dependency management
 * @return {LibraryInfo} the info about this library and its dependencies
 */
function getLibraryInfo () {
  return {
    info: {
      name:'cFireBase',
      version:'0.0.1',
      key:'MBz9GwQn5jZOg-riXY3pBTCz3TLx7pV4j',
      share:'https://script.google.com/d/18qhPwatsNUfbJTHBQ1bmsZBKjQsPxj_hMC59zowprZCSFT1z0IrLcMu1/edit?usp=sharing',
      description:'firebase api'
    },
    dependencies:[
      cUseful.getLibraryInfo()
    ]
  }; 
}

/**
 * firebase API
 * @constructor Firebase
 */
var FireBase = function () {

  var self = this, authData_;
  
  /**
   * set a goa handler 
   * @param {object} authData the auth data
   * @return {Firebase} self
   */
  self.setAuthData = function (authData) {
    authData_ = authData;
    if (!authData_ || !authData_.root || !authData_.key) {
      throw 'need an auth object with a root and a key';
    }
    return self;
  };
  
  /**
   * do a put (replaces data)
   * @param {string} putObject an object to put
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  self.put = function (putObject,childPath) {
  
    return payload_ ("PUT", putObject, childPath);
    
  };
  
  /**
   * do a delete of all
   * @return 
   */
  self.removeAll = function () {
  
    return fetch_ ( getPath_ (), {method:"DELETE"}); 
    
  };
  
  /**
   * do a delete
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  self.remove = function (childPath) {
    if (!childPath) {
      throw 'childPath is missing - to delete all records use removeAll method';
    }
    return fetch_ ( getPath_ (childPath), {method:"DELETE"}); 
    
  };
  
  /**
   * do a get
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  self.get = function (childPath) {
  
    return fetch_ ( getPath_ (childPath) ); 
    
  };
  
  /**
   * do a post (adds to data and generates a unique key)
   * @param {string} putObject an object to put
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  self.post = function (putObject,childPath) {
  
    return payload_ ("POST", putObject, childPath);
    
  };
  
  /**
   * do a patch (partially replaces an item)
   * @param {string} putObject an object to put
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  self.patch = function (putObject,childPath) {

    return payload_ ("PATCH", putObject, childPath);
    
  };
  
  /**
   * get the path given a child path
   * @param {string} [childPath=''] the childpath
   * @return {string} the path
   */
  function getPath_  (childPath) {
    return authData_.root + ( childPath || '' ) + '.json';
  }

  /**
   * do any payload methods
   * @param {string} putObject an object to put
   * @param {string} [childPath=''] a child path 
   * @return 
   */
  function payload_ (method, putObject,childPath) {
    
     return fetch_ ( getPath_ (childPath), {
      method:method,
      payload:JSON.stringify(putObject)
     }); 
  
  }
  
  /**
   * do a fetch
   * @param {string} url the url
   * @param {object} [options={method:'GET'}] 
   * @return
   */
  function fetch_ (url, options) {
  
    // defaults
    options = options || {method:'GET'};
    if (!options.hasOwnProperty("muteHttpException")) {
      options.muteHttpExceptions = true;
    }

    // do the fetch
    var result = cUseful.Utils.expBackoff (function() {
      return UrlFetchApp.fetch (url + "?auth=" + authData_.key, options);
    });
    
    return {
      ok: result.getResponseCode() === 200,
      data: result.getResponseCode() === 200 ? JSON.parse(result.getContentText()) : null,
      response:result,
      path:url
    }

  };
 
  return self;
};
