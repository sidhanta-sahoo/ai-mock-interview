/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_3rWfO2vzlQGp@ep-blue-smoke-a4xvionj-pooler.us-east-1.aws.neon.tech/ai-interview-mocker?sslmode=require&channel_binding=require'
  },
};
