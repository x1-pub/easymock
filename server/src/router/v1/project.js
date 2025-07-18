import Router from '@koa/router';
import ProjectCtl from '../../controller/project.js';

const router = new Router();

router.get('/', ProjectCtl.list);
router.post('/', ProjectCtl.create);
router.delete('/:_id', ProjectCtl.delete);
router.put('/:_id', ProjectCtl.update);
router.get('/:_id', ProjectCtl.detail);

export default router;
