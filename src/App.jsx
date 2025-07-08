import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Training from "./pages/Training/Training";
import SessionTraining from "./pages/SessionTraining/SessionTraining";
import ActiveSessionTrainig from "./pages/SessionTraining/ActiveSessionTrainig";
import Exercise from "./pages/Exercise/Exercise";

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
						<Route path="/training" element={<Training />} />
						<Route path="/session/training" element={<SessionTraining />} />
						<Route path="/exercise" element={<Exercise />} />
						<Route
							path="/session/training/active/:id"
							element={<ActiveSessionTrainig />}
						/>
					</Route>
					{/* Rota 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
