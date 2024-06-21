const { google } = require('googleapis');
const moment = require('moment');

// サンプルイベント
const event = {
  'summary': 'サンプル',
  'description': 'カレンダー説明',
  'start': {
    'dateTime': moment().add(1, 'h').format(),
    'timeZone': 'Asia/Tokyo',
  },
  'end': {
    'dateTime': moment().add(2, 'h').format(),
    'timeZone': 'Asia/Tokyo',
  },
  'colorId': 2, // @see https://lukeboyle.com/blog-posts/2016/04/google-calendar-api---color-id
  'reminders': {
    'useDefault': false,
    'overrides': [
      { 'method': 'email', 'minutes': 120 },
      { 'method': 'popup', 'minutes': 30 },
    ],
  },
};

const createEvents = async (auth) => {
  const calendar = google.calendar({ version: 'v3', auth }); // カレンダーAPI連携用クライアント取得
  const response = await calendar.events.insert({
    auth,
    calendarId: 'primary',
    resource: event,
  });

  console.log('Event created:', response);
}
module.exports = createEvents