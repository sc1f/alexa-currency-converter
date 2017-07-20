var alexa = require("alexa-app"),
	money = require("money"),
	request = require("request");

// App constants
const arn = "arn:aws:lambda:us-east-1:063487698133:function:CurrencyConverter";
const currency_codes = ["USD", "GBP", "EUR", "RMB"]; //['AUD', 'CAD', 'CHF', 'CYP', 'CZK', 'DKK', 'EEK', 'GBP', 'HKD', 'HUF', 'ISK', 'JPY', 'KRW', 'LTL', 'LVL', 'MTL', 'NOK', 'NZD', 'PLN', 'ROL', 'SEK', 'SGD', 'SIT', 'SKK', 'TRL', 'USD', 'ZAR']; 
const codes_to_names = {
	'GBP': 'pound',
	'USD': 'dollar',
	'RMB': 'chunese yuan',
}

var app = new alexa.app();

app.launch(function(request, response) {
	response.say(
		"I can help you convert currencies."
	);
	response.shouldEndSession(false);
});

// Amazon pre-built intents
app.intent("AMAZON.HelpIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var helpOutput = "You can say 'convert 100 dollars to RMB' or ask 'how much is 250 euros to pounds?'. You can also say stop or exit to quit.";
  	var reprompt = "What would you like to do?";
  	// AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
  	response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  	return
});

app.intent("AMAZON.StopIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var stopOutput = "Okay.";
  	response.say(stopOutput)
  	return
});

app.intent("AMAZON.CancelIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var cancelOutput = "No problem. Request cancelled.";
  	response.say(cancelOutput);
  	return
});

// Convert currency intent
app.intent(
	"ConvertCurrency",
	{
		slots: { 
			"amount": "AMAZON.NUMBER",
			"from_currency": currency_codes,//["dollars", "RMB", "euros", "pounds"],
			"to_currency": currency_codes//["dollars", "RMB", "euros", "pounds"],
		},
		utterances: [
			"Convert {amount} {from_currency} to {to_currency}",
			"How much is {amount} {from_currency} in {to_currency}",
		]
	},
	function(request, response) {
		var amount = request.slot("amount");
		var from = request.slot("from_currency");
		var to = request.slot("to_currency");
		ConvertCurrency(response, amount, from, to);
		return;
	}
);

function ConvertCurrency(response, amount, from, to) {
	var converted = Math.round(money.convert(amount, {from: from, to: to}));
	response.say(converted.toString());
	response.send();
	return;
}

// Connect to lambda
exports.handler = app.lambda();

if (process.argv.length === 3 && process.argv[2] === "schema") {
	console.log(app.schema());
	console.log(app.utterances());
}
