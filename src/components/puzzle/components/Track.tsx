import Step from "./Step";

const Track = () => {
    return (
        <div className="text-sm flex">
            <div className="h-6 w-20 bg-stone-800 border-[1px] border-stone-500 rounded-md font-light flex justify-center items-center ">Kick</div>
            <div className="flex p-0.5 gap-0.5 ml-2 [&>*:nth-child(8n+5)]:bg-stone-700 [&>*:nth-child(8n+6)]:bg-stone-700 [&>*:nth-child(8n+7)]:bg-stone-700 [&>*:nth-child(8n+8)]:bg-stone-700">
                {Array(16).fill(<Step/>)}
            </div>
        </div>
    );
};

export default Track;