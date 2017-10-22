/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const Fetch = require('./fetch');
const BuildOutput = require('./buildoutput');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'de-DE': {
        translation: {
            SKILL_NAME: 'Senacor Aktuelles',
            GET_NEWS_MESSAGE: 'Hier sind aktuelle Neuigkeiten von Senacor: ',
            HELP_MESSAGE: 'Ich kann dir alles über unsere aktuellen Aktivitäten auf Messen, Konferenzen und anderen Ereignissen erzählen. Du kannst zum Beispiel sagen "Senacor was gibts Neues"',
            LAUNCH_MESSAGE: 'Willkommen zu Senacor Technologies.',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            HELP_CANNOT_GIVE_OUTPUT: 'Die aktuellen Neuigkeiten findest du auf unserer Homepage www.senacor.com!'
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        // this.emit('AMAZON.HelpIntent');
        const speechOutput = this.t('LAUNCH_MESSAGE');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'GetSenacorNews': function () {
        this.emit('Senacor');
    },
    'GetSenacorEvents': function () {
        this.emit('Senacor');
    },
    'Senacor': function () {
        const self = this;

        Fetch.handler( function (error, result) {
            const speechOutput = BuildOutput.build(error, result, self.t.bind(self));

            self.emit(':tell', speechOutput.speech, self.t('SKILL_NAME'), speechOutput.raw);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit('AMAZON.StopIntent');
    }

};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
