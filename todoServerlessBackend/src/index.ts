import { Hono } from 'hono'
import { userRouter } from './routes/user'
import todoRouter from './routes/todo';
import { cors } from 'hono/cors';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();
app.use("/api/*", cors());
app.route("/api/v1", userRouter)
app.route("/api/v1/todos", todoRouter);

export default app
