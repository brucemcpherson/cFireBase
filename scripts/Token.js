function getToken(secret , pid) {
    return new FirebaseTokenGenerator (secret).createToken({uid:pid});
}
function x() {
  Logger.log(getToken ("secret", "john"));
}


