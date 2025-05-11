exports.handler = function(context, event, callback) {
    const twiml = new Twilio.twiml.VoiceResponse();
  
    // event.To が空の場合はエラーレスポンスを返して終了
    if (!event.To) {
      console.error('To parameter is missing');
      const response = new Twilio.Response();
      response.setStatusCode(400); // Bad Request
      response.setBody('Error: "To" parameter is required.');
      return callback(null, response);
    }
  
    const dial = twiml.dial({
      callerId: context.CALLER_ID
    });
  
    dial.number(event.To);
  
    callback(null, twiml);
  };