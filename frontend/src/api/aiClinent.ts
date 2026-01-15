import {hc} from 'hono/client';
import type { AppType } from '../../backend/src/index'; 

export const client = hc<AppType>('https://kezxwvevrxzfot4frmpdqhsegu0bjjyt.lambda-url.ap-northeast-1.on.aws');


