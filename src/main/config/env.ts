export default {
  mongoUrl: process.env.MONGO_URL || `mongodb://localhost:27020/clean-node-api`,
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'huf==@3'
}
