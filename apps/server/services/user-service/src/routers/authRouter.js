const passport = require("passport");
const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  googleLoginCallback,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/sign-in",
    session: false,
  }),
  googleLoginCallback
);

module.exports = router;
