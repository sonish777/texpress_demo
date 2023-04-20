import config from 'config';

export const MailConfig = {
    host: process.env.MAIL_HOST || config.get<string>('mail.host'),
    port: Number(process.env.MAIL_PORT || config.get<number>('mail.port')),
    username: process.env.MAIL_USERNAME || config.get<string>('mail.username'),
    password: process.env.MAIL_PASSWORD || config.get<string>('mail.password'),
    secure:
        process.env.MAIL_SECURE === 'true' ||
        config.get<boolean>('mail.secure'),
    from: process.env.MAIL_FROM || config.get<string>('mail.from'),
};
