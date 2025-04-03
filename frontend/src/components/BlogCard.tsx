
interface BlogCardProps {
    authorName: string;
    title: string;
    publishedDate: string;
    content: string;
}


export const BlogCard = ({
    authorName,
    title,
    publishedDate,
    content
}: BlogCardProps) => {
    return <div className="p-4 border-b border-slate-200 pb-4">
        <div className="flex">
            <div className="flex">
                <Avatar name = {authorName}/>
            </div>
            <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
                {authorName}
            </div>
            <div className="flex justify-center flex-col pl-2">
                <Circle/>
            </div>
            <div className="pl-2 font-thin text-sm text-slate-500 flex justify-center flex-col">
                {publishedDate}
            </div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0, 100) + "...."}
        </div> 
        <div className="text-slate-500 text-sm font-thin pt-4">
            {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
    </div> 
}

function Avatar({name}: {name: string}) {
    return (
        <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-600 rounded-full">
            <span className="font-xs font-extralight text-gray-600 dark:text-gray-300">{name[0]}</span>
        </div> 
    );
    
}

function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}