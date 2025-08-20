import express from 'express';
import MemberController from '../controllers/memberController';

const router = express.Router();
const memberController = new MemberController();

router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);

export default router;
