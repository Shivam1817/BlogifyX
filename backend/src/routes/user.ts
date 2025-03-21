import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';  
import { sign , verify } from 'hono/jwt';
import { signupInput } from '@shivam1817/medium-common';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); //if we are using prisma accelerate we need to put this
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    
    if(!success){
        c.status(411);
        return c.json({
            error: "Invalid input"
        });
    }
    
    try{
        const user = await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name
        }
        })
        //console.log(user);
        const token = await sign ({ id: user.id }, c.env.JWT_SECRET);
        //const secret = c.env.JWT_SECRET || "default_secret"; // Ensure it's a valid string
        //console.log(secret);
        //const token = await sign({ id: user.id }, secret);
        //console.log(token);
        return c.json({
        jwt: token
        });
    } catch(e){
        console.log(e);
        c.status(403);
        return c.json({error: "error while signing up"});
    }
})

userRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
    const body = await c.req.json();
    const user = await prisma.user.findFirst({
        where:{
            username: body.username,
            password: body.password,
        }
    });
    if(!user){
        c.status(403); //un
        return c.json({ error: "Incorrect creds" });
        }
    
    const jwt = await sign({id: user.id},c.env.JWT_SECRET);
    return c.json({ jwt });
    }catch(e){
    c.status(411);
    return c.text('Invalid');
    }
})