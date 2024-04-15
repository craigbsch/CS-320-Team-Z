exports.onExecutePostLogin = async (event, api) => {

  if (event.authorization) {
    api.idToken.setCustomClaim("height", event.user.user_metadata.height);
  }
};
