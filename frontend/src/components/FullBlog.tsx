import { Appbar } from "./Appbar"
import { Blog } from "../hooks/index";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: {blog: Blog}) => {
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-12 w-full pt-200 max-w-screen-xl">
            <div className="col-span-8">
                <div className="text-5xl font-extrabold">
                    {blog.title}
                </div>
                <div className="text-gray-500 pt-2">
                    Post on 31st March 2025 
                </div>
                <div className="pt-4">
                    {blog.content}
                </div>
            </div>
            <div className="col-span-4">
                <div>
                    <div className="text-slate-600">
                        Author
                    </div> 
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar name = {blog.author.name || "Anonymous"} size="big"/>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                {blog.author.name || "Anonymous"}
                            </div>
                            <div className="text-slate-500 pt-2">
                                Random catch phrase about the author's abiility to grab the reader's attention.
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
        
    </div>
    
};
