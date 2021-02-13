(function () {
    const Base = require('mocha').reporters.base;
    const { WebClient } = require('@slack/web-api');

    const Slack = (function () {
        function Slack(runner, options) {
            const web = new WebClient(options.reporterOptions.token);
            let passes = 0;
            let failures = 0;
            let messageOptions = {
                username: '',
                text: '',
                channel: options.reporterOptions.channel,
                thread_ts: process.env.threadId,
                icon_emoji: ''
            };
            
            let threadIdFormatted = process.env.threadId.split(":")[1];
            console.debug("parsed threadId:" + threadIdFormatted);
            
            
            runner.on("pass", function (test) {
                passes++;
                messageOptions = {
                    username: "PASS: " + test.fullTitle(),
                    text: test.fullTitle(),
                    channel: options.reporterOptions.channel,
                    thread_ts: threadIdFormatted,
                };
                if (options.reporterOptions.passIcon) {
                    messageOptions.icon_emoji = options.reporterOptions.passIcon;
                }else{
                    messageOptions.icon_emoji = '';
                }

                if (!options.reporterOptions.minimal && !options.reporterOptions.failureOnly) {
                    web.chat.postMessage(messageOptions);
                }
            });

            runner.on("fail", function (test, err) {
                failures++;
                messageOptions = {
                    username: "FAIL: " + test.fullTitle(),
                    text: "\n**** Failed Test: " + test.fullTitle(),
                    channel: options.reporterOptions.channel,
                    thread_ts: threadIdFormatted,
                };
                if (options.reporterOptions.failIcon) {
                    messageOptions.icon_emoji = options.reporterOptions.failIcon;
                }else{
                    messageOptions.icon_emoji = '';
                }
                web.chat.postMessage(messageOptions);
            });

            runner.once("end", function () {
                messageOptions = {
                    username: " Tests Completed",
                    text: "Passed: " + passes + " Failed: " + failures,
                    channel: options.reporterOptions.channel,
                    thread_ts: threadIdFormatted,
                };
                if (options.reporterOptions.endIcon) {
                    messageOptions.icon_emoji = options.reporterOptions.endIcon;
                }else{
                    messageOptions.icon_emoji = '';
                }
                //Always send summary
                web.chat.postMessage(messageOptions);
                
            });
        }

        return Slack;

    })();

    module.exports = Slack;

}).call(this);
