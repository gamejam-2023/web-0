import Link from "next/link";

interface CreditsProps {
};

function Credits(props: CreditsProps) {
    return (
        <>
            <div className="flex flex-col gap-4 items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center gap-2 w-48 h-24 p-2 rounded-lg bg-neutral-700 shadow-lg">
                    <h2 className="font-semibold">Programming</h2>
                    <h3>Aron</h3>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 w-48 h-24 p-2 rounded-lg bg-neutral-700 shadow-lg">
                    <h2 className="font-semibold">Art</h2>
                    <h3>Rannvá</h3>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 w-48 h-24 p-2 rounded-lg bg-neutral-700 shadow-lg">
                    <h2 className="font-semibold">Sound</h2>
                    <h3>Ragnar</h3>
                </div>
            </div>
        </>
    );
}

export default function Home() {
    return (
        <main className="container mx-auto px-4 h-full">
            <Link href={"../"} className="absolute top-8 left-8 w-16 h-16 text-3xl">{"<-"}</Link>
            <Credits />
        </main>
    )
}
