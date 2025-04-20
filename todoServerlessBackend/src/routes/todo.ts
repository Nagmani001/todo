import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";

import { withAccelerate } from "@prisma/extension-accelerate";
import { z } from "zod";

const todoRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

todoRouter.use(async (c, next) => {
  const token = c.req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return c.json({
      msg: "invalid token format",
    })
  }
  const actualToken = token.split(" ")[1];
  try {
    const decoded = await verify(actualToken, c.env.JWT_SECRET);
    //@ts-ignore
    c.set("userId", decoded.id);
    await next();
  } catch (err) {
    console.log(err);
    return c.json({
      msg: "incorrect jwt",
    })
  }

});
todoRouter.get("/getTodo", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const id = c.get("userId");
  try {

    const todos = await prisma.todo.findMany({
      where: {
        userId: +id
      }
    });
    return c.json({
      todos
    })
  } catch (err) {
    console.log(err);
  }
});

const addSchema = z.object({
  title: z.string(),
  description: z.string(),
})

todoRouter.post("/postTodo", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const id = c.get("userId");
  const body = await c.req.json();
  const parsedValue = addSchema.safeParse(body);
  if (!parsedValue.success) {
    c.status(403);
    return c.json({
      msg: "invalid data",
    })
  }
  try {
    const addTodo = await prisma.todo.create({
      data: {
        title: parsedValue.data.title,
        description: parsedValue.data.description,
        userId: +id,
      }
    });
    c.status(200);
    return c.json({
      msg: "todo added",
    })
  } catch (err) {
    console.log(err);
  }


});
const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  id: z.number(),
})
todoRouter.patch("/putTodo", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const body = await c.req.json();
  console.log(body);
  const parsedValue = updateSchema.safeParse(body);
  if (!parsedValue.success) {
    c.status(403);
    return c.json({
      msg: "invalid inputs ",
    });
  }
  try {
    const updateTodo = await prisma.todo.update({
      where: {
        id: parsedValue.data.id,
      },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
      }
    });
    c.status(200);
    return c.json({
      msg: "todo updated"
    })
  } catch (err) {
    console.log("todo was indeed updated");
  }

})
todoRouter.delete("/deleteTodo", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const id = c.get("userId");
  try {
    const body = await c.req.json();
    const deleteTodo = await prisma.todo.delete({
      where: { id: body.id }
    });
    c.status(200);
    return c.json({
      msg: "todo deleted",
    })

  } catch (err) {
    console.log(err);
  }

});

todoRouter.get("/name", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  const id = c.get("userId");
  const result = await prisma.user.findFirst({
    where: { id: +id }
  });
  c.status(200);
  return c.json(result);
});

export default todoRouter;

