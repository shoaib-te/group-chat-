import { AuthProvider } from "./context/authContext";
import Approute from "./routers/Approute";

function App() {
  return (
    <div>
      <AuthProvider>
        <Approute />
      </AuthProvider>
    </div>
  );
}

export default App;
