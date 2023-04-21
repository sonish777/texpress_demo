import { ConsumeMessage } from 'amqplib';
import { GetRepository } from 'core/entities';
import { existsSync, mkdirSync, readdir, readdirSync } from 'fs';
import path from 'path';
import { Consume, Consumer } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { UserEntity } from 'shared/entities';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { Log } from '../logger';
import axios from 'axios';
import config, { IConfig } from 'config';

const serverConfigs = config.get<IConfig>('server');

export class ThumbnailGenerator extends Consumer {
    @GetRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>;

    @Consume(
        QueueConfig.Cms.Exchange,
        QueueConfig.Shared.GenerateThumbnailQueue
    )
    @Log('Generate Thumbnail')
    async generateThumbnail(message: ConsumeMessage) {
        const payload: {
            uploadedFiles: Record<string, Express.Multer.File[]>;
            uploadThumbnailMap: [string, string][];
            module: string;
        } = JSON.parse(message.content.toString());

        await Promise.all(
            payload.uploadThumbnailMap.map(async (mapper) => {
                const [uploadColumn, thumbnailColumn] = mapper;
                if (payload.uploadedFiles[uploadColumn]) {
                    const file = payload.uploadedFiles[uploadColumn][0];
                    const thumbnailName = `thumb_${file.filename}`;
                    if (
                        !existsSync(
                            path.join(
                                __dirname,
                                '../../../texpress-cms/public/uploads',
                                payload.module,
                                'thumbnails'
                            )
                        )
                    ) {
                        mkdirSync(
                            path.join(
                                __dirname,
                                '../../../texpress-cms/public/uploads',
                                payload.module,
                                'thumbnails'
                            )
                        );
                    }
                    const serverURL =
                        process.env.CMS_URL ||
                        `${serverConfigs.get('cms:host')}:${serverConfigs.get(
                            'cms:port'
                        )}`;
                    const imageResponse = await axios.get(
                        `${serverURL}/static/uploads/admins/${file.filename}`,
                        {
                            responseType: 'arraybuffer',
                        }
                    );
                    const fileContent = Buffer.from(
                        imageResponse.data,
                        'base64'
                    );
                    sharp(fileContent)
                        .resize(200, 200)
                        .toFormat('jpeg')
                        .jpeg({ quality: 50 })
                        .toFile(
                            path.join(
                                __dirname,
                                '../../../texpress-cms/public/uploads',
                                payload.module,
                                'thumbnails',
                                thumbnailName
                            )
                        )
                        // .then((result) => this.logger.log('Thumbnail Generated', result))
                        .catch(this.logger.error);

                    const user = await this.userRepository.findOne({
                        where: {
                            avatar: file.filename,
                        },
                    });
                    if (!user) {
                        return Promise.resolve(null);
                    }
                    (<any>user)[thumbnailColumn] = thumbnailName;
                    return this.userRepository.save(user);
                }
            })
        );
    }
}
