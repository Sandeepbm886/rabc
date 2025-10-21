import Image from 'next/image';

const Loading = () => {
    return (
        <div className="flex-center h-screen w-full">
            <Image
                src="/icons/loading-circle.svg"
                alt="Loading..."
                width={50}
                height={50}
            />
        </div>
    );
};

export default Loading;