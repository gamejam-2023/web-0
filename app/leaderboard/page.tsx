import Link from "next/link";

interface LeaderboradData {
    name: string;
    score: number;
};

interface LeaderboradProps {
    data: LeaderboradData[];
};

function Leaderborad(props: LeaderboradProps) {
    return (
        <>
            <div className="flex justify-center items-center h-full">
                <div className="flex p-2 rounded-lg bg-neutral-700 shadow-lg mx-auto">
                    <table className="mx-auto" cellPadding="8px">
                        <thead>
                            <tr className="border-b border-gray-400">
                                <th className="pe-32">Name</th>
                                <th className="">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data?.map((item) =>
                                <tr className="border-b border-gray-400">
                                    <td>{item.name}</td>
                                    <td>{item.score}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default function Home() {
    return (
        <main className="container mx-auto px-4 h-full">
            <Link href={"../"} className="absolute top-8 left-8 w-16 h-16 text-3xl">{"<-"}</Link>
            <Leaderborad data={[{name: "test", score: 200}]} />
        </main>
    )
}
