const cheerio = require('cheerio');
const Wreck = require('wreck');
const jsonfile = require('jsonfile');
const cleanup = require('./cleanup').cleanup;

const extractEventTitles = function($) {
    return new Promise( (resolve, reject) => {
        const events = {};
        $('div.event').filter((i, el) => {
            const $element = $(el);
            const eventId = $element.attr('event_id');
            const [date, location] = $element.find('div.date').text().trim().split(' / ');
            const title = $element.find('div.title').text().trim();

            events[eventId] = {
                dateRaw: toDate(date),
                date,
                location,
                title
            };
        });
        resolve(events);
    });
};

const extractSummary = function($) {
    return new Promise( (resolve, reject) => {
        const events = {};
        $('div.content').filter((i, el) => {
            const $element = $(el);
            const eventId = $element.attr('event_id');
            const summary = cleanup($element.find('div.text').text().trim());

            const event = events[eventId];
            events[eventId] = {summary};
        });
        resolve(events);
    });
};

const mergeEvents = function (titles, summaries) {
    const mergedEvents = {};
    for (let entryId in titles) {
        mergedEvents[entryId] = Object.assign({}, titles[entryId], summaries[entryId]);
    }
    return mergedEvents;
};

const fetchPage = function(callback) {
    console.log("Fetching events...");
    Wreck.get('https://senacor.com/news-events/', {
              timeout: 2000,
              maxBytes: 1500000
         })
         .then( (res) => {
             callback(null, res.payload);
         })
         .catch(error => {
             console.log("Fetching failed with", error);
             callback(error);
         });
};

const toDate = function (str) {
    const [firstDay, firstMonth, firstYear] = str.split('.');
    return new Date(firstYear, firstMonth, firstDay);
}

const values = function (obj) {
    return Object.keys(obj).map( key => obj[key] );
}

const extractEvents = function (page) {
    console.log("Extracting events");
    const $ = cheerio.load(page);

    return Promise.all([ extractEventTitles($), extractSummary($) ])
         .then( results => {
            const [titles, summaries] = results;
            const now = new Date();
            const events =  values(mergeEvents(titles, summaries))
                             .filter(event => event.dateRaw > now)
                             .sort((a, b) => a.dateRaw < b.dateRaw);
            return events;
         })
         .catch( rejection => {
            console.log("Rejected with", rejection);
            throw rejection;
         } );
};

const handler = function (callback) {
    fetchPage( (err, body) => {
        if (err) {
            callback(err);
        }
        else {
            extractEvents(body)
                .then(events => callback(null, events))
                .catch(error => callback(error));
        }
    });
};

module.exports = {
    'handler': handler,
    'extractEventTitles': extractEventTitles,
    'extractSummary': extractSummary,
    'mergeEvents': mergeEvents
};

if (process.env.NODE_ENV === 'development') {
    handler((err, events) => {
        if (err) {
            console.warn(err);
        }
        else {
            console.log(events);
        }
    } );
}
