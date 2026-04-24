const twilio = require('twilio');

const notifications = {};

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

notifications.sendTwilioSms = (phone, message, callback) => {
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;

    const userMessage =
        typeof message === 'string' && message.trim().length > 0 && message.trim().length <= 1600
            ? message.trim()
            : false;

    if (userPhone && userMessage) {
        twilioClient.messages
            .create({
                body: userMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+88${userPhone}`,
            })
            .then((msg) => {
                console.log('Message sent successfully:', msg.sid);
                callback(false);
            })
            .catch((err) => {
                callback(`Twilio Error: ${err.message}`);
            });
    } else {
        callback('Given parameters were missing or invalid!');
    }
};

module.exports = notifications;
