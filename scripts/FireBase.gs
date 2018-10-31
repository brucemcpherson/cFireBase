/** 
 * used for dependency management
 * @return {LibraryInfo} the info about this library and its dependencies
 */
function getLibraryInfo () {
  return {
    info: {
      name:'cFireBase',
      version:'0.0.4',
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

  var self = this, authData_,promiseMode_ = false;;
  

  /**
   * generate a JWT
   * you can use this as an alternative to using cGoa
   * it's up to you to manage your own secrets etc if not using cGoa
   * @param {string} firebaseRoot the db root such as 'https://yourproject.firebaseio.com/'
   * @param {object} firebaseRules your auth rules such as {uid:"bruce"}
   * @param {string} firebaseSecret your secret key , such as aK....0h
   * @return {Firebase} self
   */
  self.generateJWT  = function (firebaseRoot, firebaseRules , firebaseSecret) {
    
    var ft =  JWT.generateJWT ( firebaseRules , firebaseSecret );
    if (!ft) {
      throw 'unable to generate firebase jwt';
    }
    authData_ = {
      key:ft,
      root:firebaseRoot,
    };
    return self;
  };

  
  /**
   * set a goa handler 
   * @param {object||goa} authData the auth data
   * @return {Firebase} self
   */
  self.setAuthData = function (authData) {
    
    // can take a goa as well
    authData_ = authData;
    if (!authData_ || !self.getRoot() || !self.getKey() ) {
      throw 'need an auth object with a root and a key or a goa object';
    }
    return self;
  };
  
  /**
   * set promise mode - in this mode promises are returned for fetches rather than resilts
   * @param {boolean} promiseMode 
   * @return {FireBase} self
   */
  self.setPromiseMode = function(promiseMode) {
    promiseMode_ = promiseMode;
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
    return self.getRoot() + ( childPath || '' ) + '.json';
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
   * @return {Promise}
   */
  function fetch_ (url, options) {
  
    // defaults
    options = options || {method:'GET'};
    if (!options.hasOwnProperty("muteHttpException")) {
      options.muteHttpExceptions = true;
    }
    var result;

    return promiseMode_ ? 
      new Promise (function (resolve, reject) {
        try {
          result = doRequest();
          resolve (makeResult());
        } 
        catch(err) {
          reject(err);
        }
      }) : makeAndDo();
    
    function makeAndDo () {
      result = doRequest();
      return makeResult();
    }
    
    function doRequest () {
      return cUseful.Utils.expBackoff (function() {
        return UrlFetchApp.fetch (url + "?auth=" + self.getKey(), options);
      });
    }
    
    function makeResult () {
      return {
        ok: result.getResponseCode() === 200,
        data: result.getResponseCode() === 200 ? JSON.parse(result.getContentText()) : null,
        response:result,
        path:url
      };
    }


  };
 
  // deteemine whether we have a goa or a customm object
  function isGoa_ (authData) {
    return typeof authData.getToken === "function" && typeof authData.getProperty === "function";
  }
  
  // get the key
  self.getKey = function () {
    return isGoa_ (authData_ ) ? authData_.getToken() : authData_.key;
  };
  
  // get the database root
  self.getRoot = function () {
    return isGoa_ (authData_ ) ? authData_.getProperty("root") : authData_.root;
  };
  return self;
};
