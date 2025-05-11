// /token
const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const identity = event.identity || 'browser_user';

  const token = new AccessToken(
    context.ACCOUNT_SID,
    context.API_KEY_SID,
    context.API_KEY_SECRET,
    {
      identity: identity,
      ttl: 3600,  // トークン有効時間
    }
  );

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: context.TWIML_APP_SID,
    incomingAllow: true,
  });

  token.addGrant(voiceGrant);

  callback(null, { token: token.toJwt() });
};