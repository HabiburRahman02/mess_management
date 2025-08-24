import express from 'express';
import memberController from '../controllers/memberController';

const router = express.Router();

router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);
router.delete('/:rid', memberController.deleteMember)

export default router;
