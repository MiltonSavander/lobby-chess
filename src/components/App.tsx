import "./App.css";
import Chat from "./Chat";
import ChessComponent from "./ChessComponent";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <ChessComponent />
        <Chat />
      </div>
    </>
  );
}

export default App;
