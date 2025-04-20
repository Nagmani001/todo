import { Hono } from "hono";
import { z } from "zod";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

const signupSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})
userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const parsedValue = signupSchema.safeParse(body);
  if (!parsedValue.success) {
    c.status(403);
    return c.json({
      msg: "invalid data"
    });
  }
  try {
    const findUser = await prisma.user.findFirst({
      where: { username: parsedValue.data.username }
    });
    if (findUser !== null) {
      c.status(409);
      return c.json({
        msg: "user already exists with this username"
      })
    }
  } catch (err) {
    console.log(err);
  }
  try {

    const createUser = await prisma.user.create({
      data: {
        username: parsedValue.data.username,
        password: parsedValue.data.password,
        firstName: parsedValue.data.firstName,
        lastName: parsedValue.data.lastName,
      }
    });
    const token = await sign({ id: createUser.id }, c.env.JWT_SECRET);
    c.status(200);
    return c.json({
      msg: "user created successfully",
      token,
    })
  } catch (err) {
    console.log(err)
  }

})

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string(),
})
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const parsedValue = signinSchema.safeParse(body);

  if (!parsedValue.success) {
    c.status(403);
    return c.json({
      msg: "invalid inputs"
    });
  }
  try {
    const validateCredentials = await prisma.user.findFirst({
      where: {
        username: parsedValue.data?.username,
        password: parsedValue.data?.password,
      }
    });
    const token = await sign({ id: validateCredentials?.id }, c.env.JWT_SECRET);
    if (validateCredentials !== null) {
      c.status(200);
      return c.json({
        msg: "signed in successfully",
        token,
      })
    } else if (validateCredentials === null) {
      c.status(401);
      return c.json({
        msg: "your credentials are incorrect",
      })
    }
  } catch (err) {

    console.log(err);
  }

});

export default userRouter;

