const express = require("express");
const router = express.Router();



const componentTypeRouter = require('./routers/component-types');
const billRouter = require('./routers/bill');
const memberRouter = require('./routers/member');


router.use('/component-types', componentTypeRouter);
router.use('/bill', billRouter);
router.use('/member', memberRouter);

module.exports = router;