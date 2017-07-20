var alexa = require("alexa-app"),
	request = require("request");

// App constants
const arn = "arn:aws:lambda:us-east-1:063487698133:function:CurrencyConverter";
const fixer = "http://api.fixer.io/latest";
var currencies = ["USD", "RMB", "EUR", "Dollar", "Yuan", "Euro"];

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
			"from_currency": "",
			"to_currency": ""
		},
		utterances: ["Convert 100 dollars to RMB."]
	},
	function(request, response) {
		convert_currency(response);
		return;
	}
);


function convert_currency(response) {
	request(fixer, function (error, response, body) {
		body = JSON.parse(body);
		var rates = body.rates;
	});
	response.say("That's 100 dollars!");
	response.send();
	return;
}

// Connect to lambda
exports.handler = app.lambda();

if (process.argv.length === 3 && process.argv[2] === "schema") {
	console.log(app.schema());
	console.log(app.utterances());
}
