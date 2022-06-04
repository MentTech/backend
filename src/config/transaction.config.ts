export default () => ({
  transaction: {
    topUpRate: process.env.TRANSACTION_TOP_UP_RATE || 100,
    withdrawRate: process.env.TRANSACTION_WITHDRAW_RATE || 80,
  },
});
