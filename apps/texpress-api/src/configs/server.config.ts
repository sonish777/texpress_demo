import config from 'config';

export const ServerConfig = {
    URL:
        process.env.API_URL ||
        `${config.get('server.api:host')}:${config.get('server.api:port')}`,
    PORT: process.env.API_PORT || config.get('server.api:port'),
};
