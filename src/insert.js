const { google } = require('googleapis');
const moment = require('moment');
const { LunarDate } = require('vietnamese-lunar-calendar');
const data = require('./data');

const insertLunarEvents = async (auth, calendarId, startYear, endYear) => {
  const calendar = google.calendar({ version: 'v3', auth });
  const startDate = moment().utc().year(startYear).startOf('year');
  const endDate = moment().utc().year(endYear).endOf('year');

  for (let date = startDate; date.isSameOrBefore(endDate); date.add(1, 'days')) {
    const lunarDate = new LunarDate(date.toDate());
    const lunarDateStr = `${lunarDate.date}/${lunarDate.month}`;

    const matchedEvent = data.find((e => e.date === lunarDateStr));
    
    if (matchedEvent) {
      const event = {
        summary: matchedEvent.summary,
        description: matchedEvent.description,
        start: {
          date: date.format('YYYY-MM-DD'),
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        end: {
          date: date.format('YYYY-MM-DD'),
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        visibility: 'public',
        transparency: 'transparent',
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 5 * 60 } // 19:00 the day before
          ],
        },
      };
  
      await calendar.events.insert({
        calendarId: calendarId,
        resource: event,
      });
    }
  }
}

module.exports = insertLunarEvents