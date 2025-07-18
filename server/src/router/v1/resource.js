import Router from '@koa/router';
import ResourceCtl from '../../controller/resource.js';

const router = new Router();

router.get('/', ResourceCtl.tree);
router.post('/', ResourceCtl.create);
router.post('/:_id/generate_data', ResourceCtl.generateData);
router.get('/:_id/data', ResourceCtl.getData);
router.put('/:_id/data', ResourceCtl.updateData);
router.delete('/:_id', ResourceCtl.delete);
router.put('/:_id', ResourceCtl.update);

export default router;
