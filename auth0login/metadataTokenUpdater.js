exports.onExecutePostLogin = async (event, api) => {

  if (event.authorization) {
    api.idToken.setCustomClaim("custom_metadata", event.user.user_metadata);
  }
};
