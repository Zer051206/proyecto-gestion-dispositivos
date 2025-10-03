import { BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;
