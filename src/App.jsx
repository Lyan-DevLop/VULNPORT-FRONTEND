import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./store/AuthContext";
import { ThemeContext, ThemeProvider } from "./utils/ThemeContext";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  );
}




