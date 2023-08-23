const jwt = require('jsonwebtoken')

module.exports = (user, statusCode, res) => {
  // Create token
  const token = user.jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  const userForToken = {
    username: user.username,
    role: user.role
  }
  //   if (user.role === 'patient') {
  //     info = { ...info, myTherapist: user.myTherapist }
  //   }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    data: userForToken
  })
}
