import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<LoadingProvider>
			<AuthProvider>
				<ThemeProvider>
					<ToastProvider>
						<App />
					</ToastProvider>
				</ThemeProvider>
			</AuthProvider>
		</LoadingProvider>
	</StrictMode>
);
