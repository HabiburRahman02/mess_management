import express from 'express';
import depositController from '../controllers/depositController';

const router = express.Router();

router.get('/', depositController.getDeposits);
router.get('/:memberId', depositController.getDepositByMemberId);
router.post('/', depositController.addDeposit);
router.patch('/:rid', depositController.updateDepositByRid)

export default router;
