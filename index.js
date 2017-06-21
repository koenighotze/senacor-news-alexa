/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const request = require('request')

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
        const safe = function (string) {
           return string.replace(/&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/ Uhr /g, " ").replace(/0(\d)\./g, "$1.");
        }

        const self = this;
        request.get('http://senacor-aktuelles.eu-west-1.elasticbeanstalk.com/senacor/', function (error, response, body) {
            if (error) {
                const speechOutput = self.t('HELP_CANNOT_GIVE_OUTPUT');
                return;
            }

            // todo refactor me
            if (!error && response.statusCode === 200) {
                let out = JSON.parse(response.body).slice(0, 4).map( news => {
                    const date = '<say-as interpret-as="date" format="dmy">' + news.date.replace(/0(\d)\./g, "$1.") + "</say-as>";

                    return date + "<s>" + safe(news.title) + "</s><p>" + safe(news.summary) + "</p>";
                }).join(' ');

                const speechOutput = self.t('GET_NEWS_MESSAGE') + out;
                self.emit(':tell', speechOutput, self.t('SKILL_NAME'), out);
            }
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
