const safe = function (string) {
   return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;").replace(/ Uhr /g, " ").replace(/0(\d)\./g, "$1.");
};

const build = function (error, result, t) {
    console.log('Building output');
    if (error) {
        const speechOutput = t('HELP_CANNOT_GIVE_OUTPUT');
        return;
    }

    let out = result.slice(0, 3).map( news => {
        const date = 'Am <say-as interpret-as="date" format="dmy">' + news.date.replace(/0(\d)\./g, "$1.") + "</say-as>";

        return date + " in " + safe(news.location) + "<s>" + safe(news.title) + "</s><p>" + safe(news.summary) + "</p>";
    }).join(' ');

    return { speech: t('GET_NEWS_MESSAGE') + out, raw: out };
}

module.exports = {
    'build': build
};