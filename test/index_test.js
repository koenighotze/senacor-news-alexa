const Lab = require('lab')
const lab = exports.lab = Lab.script()
const chai = require('chai')
chai.should();
const expect = chai.expect

lab.experiment('the skill', () => {
    lab.beforeEach((done) => {
        done()
    })

    lab.afterEach((done) => {
        done()
    })

    lab.test('should launch with the launch message', (done) => {
        done()
    })

    lab.test('should emit the senacor events when asked for news', (done) => {
        done()
    })

    lab.test('should emit the senacor events when asked for events', (done) => {
        done()
    })

    lab.test('should emit the events', (done) => {
        done()
    })

    lab.test('should emit a fallback message if events could not be fetched', (done) => {
        done()
    })

    lab.test('should emit the the 4 most recent events', (done) => {
        done()
    })

    lab.test('should replace & by its html entity ', (done) => {
        done()
    })

    lab.test('should replace < and > by their html entity ', (done) => {
        done()
    })

    lab.test('should format dates for speech ', (done) => {
        done()
    })

    lab.test('should add a pause before and after the title for speech ', (done) => {
        done()
    })

    lab.test('should emit help if asked', (done) => {
        done()
    })

    lab.test('should stop if asked for stop', (done) => {
        done()
    })

    lab.test('should stop if asked for cancel', (done) => {
        done()
    })
})