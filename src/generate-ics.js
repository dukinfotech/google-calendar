const { v4 } = require('uuid');
const { LunarDate } = require('vietnamese-lunar-calendar');
const fs = require('fs');
const moment = require('moment');

var eventsTemplate =
  `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Âm Lịch
X-WR-TIMEZONE:Asia/Ho_Chi_Minh`;

const insertLunarDates = (startYear, endYear) => {
  const startDate = moment().utc().year(startYear).startOf('year');
  const endDate = moment().utc().year(endYear).endOf('year');

  for (let date = startDate; date.isSameOrBefore(endDate); date.add(1, 'days')) {
    const lunarDate = new LunarDate(date.toDate());
    const isLeapYear = checkLeapYear(lunarDate.year);

    const summary = `${lunarDate.date}/${lunarDate.month} ` + (lunarDate.solarTerm ? lunarDate.solarTerm : '');
    const description = `Ngày: <b>${lunarDate.lunarDate}</b> ${lunarDate.isVegetarianDay ? '- Ngày ăn chay' : ''}<br>Tháng: <b>${lunarDate.lunarMonth}</b> ${lunarDate.isLeap ? '- Tháng nhuận' : ''}<br>Năm: <b>${lunarDate.lunarYear}</b> ${isLeapYear ? '- Năm nhuận' : ''}<br>Giờ hoàng đạo: <b>${lunarDate.luckyHours}</b>`

    eventsTemplate += `
BEGIN:VEVENT
DTSTART;VALUE=DATE:${date.format('YYYYMMDD')}
DTEND;VALUE=DATE:${date.format('YYYYMMDD')}
RRULE:FREQ=DAILY;COUNT=1
DTSTAMP:${date.utc().format('YYYYMMDDTHHmmss[Z]')}
UID:${v4()}
CREATED:${date.utc().format('YYYYMMDDTHHmmss[Z]')}
DESCRIPTION:${description}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${summary}
TRANSP:TRANSPARENT
CLASS:PUBLIC
END:VEVENT`;
  }

  eventsTemplate += `
END:VCALENDAR`;

  eventsTemplate = eventsTemplate.replace(/\t/g, '');
  fs.writeFileSync('./dist/output.ics', eventsTemplate);
}

const checkLeapYear = (year) => {
  const remainder = year % 19;
  return [0, 3, 6, 9, 11, 14, 17].includes(remainder);
}

insertLunarDates(2024, 2034);