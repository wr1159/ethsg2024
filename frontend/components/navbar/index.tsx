// import { ModeToggle } from "./ModeToggle";

export function Navbar() {
    return (
        <header className="w-full py-4 flex justify-between items-center">
            <div className="flex items-center">
                <div className="hidden sm:inline text-xl font-bold">
                    Co(IN)munity
                </div>
            </div>
            {/* <ModeToggle /> */}
            <div className="flex items-center">
                <w3m-button />
            </div>
        </header>
    );
}
