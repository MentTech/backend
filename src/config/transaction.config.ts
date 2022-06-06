export default () => ({
  transaction: {
    topUpRate: process.env.TRANSACTION_TOP_UP_RATE || 100,
    withdrawRate: process.env.TRANSACTION_WITHDRAW_RATE || 80,
    vndUsdRate: process.env.TRANSACTION_VND_USD_RATE || 0.000043,
  },
});
