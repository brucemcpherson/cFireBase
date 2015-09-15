function getToken(secret , pid) {
    return new FirebaseTokenGenerator (secret).createToken({uid:'761326798069-r5mljlln1rd4lrbhg75efgigp36m78j5@developer.gserviceaccount.com'}, {
  "scope":"https://www.googleapis.com/auth/devstorage.readonly",
  "aud":"https://www.googleapis.com/oauth2/v3/token",
  "exp":1328554385,
  "iat":1328550785
});
}
function x() {
  Logger.log(getToken ("secret", "john"));
}

function xx() {

  var claimSet = {
    "iss":"761326798069-r5mljlln1rd4lrbhg75efgigp36m78j5@developer.gserviceaccount.com",
    "scope":"https://www.googleapis.com/auth/devstorage.readonly",
    "aud":"https://www.googleapis.com/oauth2/v3/token",
    "exp":1328554385,
    "iat":1328550785
  };
  
  var header = {"alg":"RS256","typ":"JWT"};
  
  var encHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header), Utilities.Charset.UTF_8);
  var encClaimSet = Utilities.base64EncodeWebSafe(JSON.stringify(claimSet), Utilities.Charset.UTF_8);
  
  var signed = Utilities.computeHmacSha256Signature(encHeader + "." + encClaimSet,
                                                      "my key - use a stronger one",
                                                      Utilities.Charset.UTF_8);
 
  var encSigned = Utilities.base64EncodeWebSafe(signed, Utilities.Charset.UTF_8);
  // need to eliminate padding
  Logger.log (encHeader + '.' + encClaimSet + '.' + encSigned);
  
  //'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.
//'eyJpc3MiOiI3NjEzMjY3OTgwNjktcjVtbGpsbG4xcmQ0bHJiaGc3NWVmZ2lncDM2bTc4ajVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzY29wZSI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcHJlZGljdGlvbiIsImF1ZCI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi90b2tlbiIsImV4cCI6MTMyODU1NDM4NSwiaWF0IjoxMzI4NTUwNzg1fQ.
//'ixOUGehweEVX_UKXv5BbbwVEdcz6AYS-6uQV6fGorGKrHf3LIJnyREw9evE-gs2bmMaQI5_UbabvI4k-mQE4kBqtmSpTzxYBL1TCd7Kv5nTZoUC1CmwmWCFqT9RE6D7XSgPUh_jF1qskLa2w0rxMSjwruNKbysgRNctZPln7cqQ
  
}

function zz() {

  var options = {
    expiration:0,
    delegationEmail:'',
    scopes:['a','b']
  };
    
  var iat = Math.floor(new Date().getTime() / 1000),
      exp = iat + Math.floor((options.expiration || 60 * 60 * 1000) / 1000),
      claims = {
        iss: options.email,
        scope: options.scopes.join(' '),
        aud: 'GOOGLE_OAUTH2_URL',
        exp: exp,
        iat: iat
      };

  if (options.delegationEmail) {
    claims.sub = options.delegationEmail;
  }

  var header = Utilities.base64EncodeWebSafe(JSON.stringify({"alg":"RS256","typ":"JWT"}), Utilities.Charset.UTF_8),
      claimset = Utilities.base64EncodeWebSafe(JSON.stringify(claims)),
      rawJwt = [header, claimset].join('.'),
      sig = crypto.createSign('RSA-SHA256').update(rawJwt).sign(secret,'base64'),
      jwt = [rawJwt , sig].join('.');

 };
	