import axios from "axios"

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
    <div>
      <h1>Sound Player</h1>
      <button onClick={handlePlaySound}>Play Sound</button>
    </div>
  );
}

export default App;
