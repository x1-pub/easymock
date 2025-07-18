import Koa from 'koa';
import cors from '@koa/cors';
import {koaBody} from 'koa-body';
import chalk from 'chalk';
import auth from './middlewares/auth.js';
import router from './router/index.js';
import exception from './middlewares/exception.js';
import ratelimit from './middlewares/ratelimit.js';
import {PORT} from './config/index.js';

const app = new Koa();

app
    .use(cors({credentials: true}))
    .use(exception())
    .use(auth())
    .use(koaBody())
    .use(ratelimit())
    .use(router.routes());


app.listen(PORT, () => {
  console.log('');
  console.log(
      chalk.green('  ➜  ') +
    'Local:  ' +
    chalk.hex('#8EFAFD').underline(`http://127.0.0.1:${PORT}`),
  );
});
