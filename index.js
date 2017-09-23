const Alexa = require('alexa-sdk');

const SKILL_NAME = 'Sendator';
const HELP_MESSAGE = 'You can either tell me your state and issue, or you can exit. What can I do for you?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Welcome to Amazon, crusher of dreams.';


var handlers = {
  'LaunchRequest': function() {
    this.response.speak(HELP_REPROMPT).listen(HELP_REPROMPT);
    this.emit(':responseReady');
  },
  'ContactSenatorIntent': function() {
    var filled = delegateSlotCollection.call(this);

    var stateSlot = this.event.request.intent.slots.state.value;
    var issueSlot = this.event.request.intent.slots.issue.value;

    this.response.speak("You live in " + stateSlot + " and you want to discuss " + issueSlot);
    this.emit(':responseReady');
  },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function delegateSlotCollection() {
  if (this.event.request.dialogState === "STARTED") {
    var updatedIntent = this.event.request.intent;
    this.emit(":delegate", updatedIntent);
  }
  else if (this.event.request.dialogState !== "COMPLETED"){
    this.emit(":delegate");
  }
  else {
    return this.event.request.intent;
  }
}
