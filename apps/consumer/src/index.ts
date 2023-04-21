import { ConsumerServer } from 'rabbitmq';
import * as consumers from './cms';
import * as controllers from './controllers';
import {
    StaticServeProvider,
    StaticServeProviderOptions,
} from 'shared/providers';
import { provideMiddleware } from 'core/utils';
import path from 'path';

function bootstrap() {
    const server = new ConsumerServer({
        consumers,
        controllers,
    });
    server.startupConsumer(9999, {
        name: 'Consumer Server',
        middlewareProviders: [
            provideMiddleware<StaticServeProviderOptions>(StaticServeProvider, {
                prefix: 'static',
                pathToStaticContents: path.join(
                    __dirname,
                    '../../texpress-cms/public'
                ),
            }),
        ],
    });
}

bootstrap();
