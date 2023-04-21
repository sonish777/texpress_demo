import { ConsumerServer } from 'rabbitmq';
import * as consumers from './cms';
import * as controllers from './controllers';

function bootstrap() {
    const server = new ConsumerServer({
        consumers,
        controllers,
    });
    server.startupConsumer(9999, {
        name: 'Consumer Server',
    });
}

bootstrap();
