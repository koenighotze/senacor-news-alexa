'use strict';

module.exports = {
    cleanup(text) {
        if (!text) {
            return '';
        }

        return text.replace(/Weitere Info.*?\./, 'Mehr Infos gibt es auf unserer Homepage.')
                 .replace(/Mehr Infos.*?\./, 'Mehr Infos gibt es auf unserer Homepage.')
                 .replace(/gibt es hier./, 'gibt es auf unserer Homepage.')
                 .replace('Hier geht es zur Anmeldung.', 'Auf unserer Homepage kannst du dich registrieren.');
     }
}
