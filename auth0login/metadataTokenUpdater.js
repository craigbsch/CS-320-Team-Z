exports.onExecutePostLogin = async (event, api) => {


  if (event.authorization) {
    api.idToken.setCustomClaim("custom_metadata", event.user.user_metadata);
    api.accessToken.setCustomClaim("custom_metadata", event.user.user_metadata);
    api.idToken.setCustomClaim("uid", event.user.user_id);
    api.accessToken.setCustomClaim("uid", event.user.user_id);
  }
};
