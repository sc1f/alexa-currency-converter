var alexa = require("alexa-app"),
	money = require("./money.min.js"),
	request = require("request");

// App constants
const arn = "arn:aws:lambda:us-east-1:063487698133:function:CurrencyConverter";
const currency_codes = ['AUD', 'CAD', 'CHF', 'CYP', 'CZK', 'DKK', 'EEK', 'GBP', 'HKD', 'HUF', 'ISK', 'JPY', 'KRW', 'LTL', 'LVL', 'MTL', 'NOK', 'NZD', 'PLN', 'ROL', 'SEK', 'SGD', 'SIT', 'SKK', 'TRL', 'USD', 'ZAR'];
var app = new alexa.app();

app.launch(function(request, response) {
	response.say(
		"I can help you convert currencies."
	);
	response.shouldEndSession(false);
});

// Help Intent
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

app.intent(
	"ConvertCurrency",
	{
		slots: { 
			"amount": "AMAZON.NUMBER",
			"from_currency": [

			],
			"to_currency": ""
		},
		utterances: ["Convert 100 dollars to RMB."]
	},
	function(request, response) {
		ConvertCurrency(response);
		return;
	}
);

function ConvertCurrency(response) {
	var converted = Math.round(money.convert(100, {from: "USD", to: "CNY"}));
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
