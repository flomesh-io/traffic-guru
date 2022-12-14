'use strict';

const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = {
  async send(toEmails, mailTitle, mailHtml) {
    const emailConf = await strapi
      .query('system-setting')
      .findOne({ type: 'EmailConf' });
    if (emailConf === null || emailConf.content === null) {
      strapi.log.info('You have not configure your email in SystemSetting!');
      return;
    }
    const mailOptions = {
      from: emailConf.content.auth.user,
      to: toEmails,
      subject: mailTitle,
      html: mailHtml,
    };
    nodemailer
      .createTransport(emailConf.content)
      .sendMail(mailOptions, (error) => {
        if (error) {
          return strapi.log.error(error);
        }
      });
  },

  async sendAlarms(toEmails, alarms) {
    const alarmContent = await strapi.query('system-setting').findOne({
      type: 'AlarmContentInit',
    });
    const template = ejs.compile(alarmContent.content.alarmContent);
    const alarmHtml = template({
      alarms: alarms,
    });
    this.send(toEmails, 'Flomesh Alarms', alarmHtml);
  },
};
