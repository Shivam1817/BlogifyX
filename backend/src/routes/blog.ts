import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';  
import { sign , verify } from 'hono/jwt';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
    Variables:{
        userId: string;
    }
}>();


//middleware
blogRouter.use('/*', async(c,next) => {
    //get the header
    //verify the header
    //if the header is correct, we need can proceed
    //if not, we return the user a 403 status code
    const authheader = c.req.header("Authorization") || "";
    //Bearer token
    try{
        const token = authheader.split(" ")[1]
        const user = await verify(token , c.env.JWT_SECRET);
        //extract the user id
        //pass it down to the route handler
        if(user){
            c.set("userId", user.id as string);
            await next();
        }else{
            c.status(403);
            return c.json({
                error: "You are not logged in"
            })
        }
    }catch(e){
        c.status(403);  //unauthorized
        return c.json({
            message: "You are not logged in"
        })
    }
})



blogRouter.post('/', async(c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    /////console.log(prisma);
    //console.log(prisma.blog);
    const blog = await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: blog.id
    })
})

//Todo: add pagination -> first return n blog then when user scroll down to end then return more blog we shouldn't return all the blog it is not good
blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.blog.findMany({
        select:{
            id: true,
            title: true,
            content: true,
            author: {
                select:{
                    name: true
                }
            }
        }
    });

    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async(c) => {
    //const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param("id");

    try{
        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            },
            select:{
                id: true,
                title: true,
                content: true,
                author: {
                    select:{
                        name: true
                    }
                }
            }
        })
    
        return c.json({
            blog
        });
    }catch(e){
        c.status(404);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})

