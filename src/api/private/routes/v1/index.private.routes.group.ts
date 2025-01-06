import express from 'express';
import GroupsController from '../../controllers/groups.private.controller';

const router = express.Router();

router.post('/create', GroupsController.createGroup);
router.post('/block', GroupsController.createGroup);

export default router;
