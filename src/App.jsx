import "./App.css";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound/NotFound";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />}></Route>
					<Route path="/register" element={<Register />}></Route>

					{/* Rotas protegidas */}
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Home />} />
					</Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
