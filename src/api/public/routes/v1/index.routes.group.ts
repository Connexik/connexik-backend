import express from 'express';
import GroupsController from '../../controllers/groups.controller';

const router = express.Router();

router.get('/', GroupsController.getAllGroups);
router.post('/create', GroupsController.createGroup);
router.get('/status', GroupsController.getStatus);
router.post('/status', GroupsController.updateStatus);
router.get('/config:group_id', GroupsController.groupInfo);

export default router;
