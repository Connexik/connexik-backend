import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';

const config = async (req: Request, res: Response): Promise<void> => {
  
  responseUtils.success(res, null);
};

export default {
  config
};
