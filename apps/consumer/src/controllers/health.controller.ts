import { Controller, Route } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { Request, Response } from 'express';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
@Controller('/healthz')
export class HealthController {
    @Route({ method: HTTPMethods.Get, path: '/' })
    async getHealth(req: Request, res: Response) {
        console.log(
            '--------------Avatars------------------',
            readdirSync(
                path.join(
                    __dirname,
                    '../../../texpress-cms/public/uploads',
                    'admins'
                )
            )
        );

        return res.status(200).json({
            status: 'Running',
            code: 200,
        });
    }
}
