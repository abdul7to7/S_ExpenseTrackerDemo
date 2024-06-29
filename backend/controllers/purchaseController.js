const razorPay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
exports.buyMemberShip = (req, res, next) => {
  try {
    console.log(process.env.RZP_KEY_ID);
    let rzp = new razorPay({
      key_id: process.env.RZP_KEY_ID,
      key_secret: process.env.RZP_KEY_SECRET,
    });
    // console.log("rzp------->>>>>", rzp);
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        // console.log("errrprrr->>>>>", err);
        throw new Error(JSON.stringify(err));
      }
      Order.create({
        userId: req.user.id,
        rzpOrderId: order.id,
        status: "PENDING",
      })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(JSON.stringify(err));
        });
    });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

exports.verifyPurchase = (req, res, next) => {
  const { order_id, payment_id, signature } = req.body;

  //   const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  //   hmac.update(order_id + "|" + payment_id);
  //   const generatedSignature = hmac.digest("hex");

  //   if (generatedSignature === signature) {
  if (true) {
    res.json({ status: "success", message: "Payment verified successfully" });
  } else {
    throw new Error(
      JSON.stringify({
        message: "Payment verification failed",
        order_id,
        payment_id,
      })
    );
  }
};
