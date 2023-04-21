import { ApiController, Route } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { Request, Response } from 'express';

@ApiController('/healthz')
export class HealthController {
    @Route({ path: '/', method: HTTPMethods.Get })
    async getHealth(req: Request, res: Response) {
        res.status(200).json({
            status: 'Running',
            code: 200,
        });
    }
}
