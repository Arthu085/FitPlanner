import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./assets/styles/variables.css";
import "./assets/styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
