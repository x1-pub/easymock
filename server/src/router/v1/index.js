import Router from '@koa/router';
import user from './user.js';
import project from './project.js';
import resource from './resource.js';
import auth from './auth.js';

const router = new Router();
router
    .use('/user', user.routes())
    .use('/project/:projectId/resource', resource.routes())
    .use('/project', project.routes())
    .use('/auth', auth.routes());

export default router;
