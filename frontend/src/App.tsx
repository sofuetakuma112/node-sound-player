import axios from "axios";
import { Button } from "@/components/ui/button";

function App() {
  const handlePlaySound = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL!}/play-sound`);
      console.log("Sound played successfully");
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8">
      <h1 className="text-4xl mb-4 sm:mb-8 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Sound Palyer
      </h1>
      <div className="flex-1 flex flex-col justify-center items-center">
        <Button onClick={handlePlaySound} className="w-[180px]">
          音を再生する
        </Button>
      </div>
    </div>
  );
}

export default App;
