import Form from "./components/Form";
import Image from "./components/Imgae";

export default function NewPassword() {
    return (
        <main className="w-full mt-30 min-h-screen flex items-center justify-center p-4 lg:p-8">
           <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-2 items-center">
             <Form />
             <div className="hidden lg:block h-[90vh]">
                <Image />
             </div>
           </div>
        </main>
    );
}