// import { ModeToggle } from "./ModeToggle";

import { ModeToggle } from "./ModeToggle";

export function Navbar() {
    return (
        <header className="w-full py-4 flex justify-between items-center">
            <div className="flex items-center gap-x-4">
                <ModeToggle />
                <div className="hidden sm:inline text-xl font-bold">
                    Co(IN)munity
                </div>
            </div>
            <div className="flex items-center">
                <w3m-button />
            </div>
        </header>
    );
}
