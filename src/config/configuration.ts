export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    DATABASE_UR: process.env.DATABASE_URL,
  },
});
