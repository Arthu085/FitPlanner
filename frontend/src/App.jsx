import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Home from "./pages/Home/Home";
import Exercicios from "./pages/Exercicios/Exercicios";
import Metas from "./pages/Metas/Metas";
import Agenda from "./pages/Agenda/Agenda";
import Treinos from "./pages/Treinos/Treinos";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<LoginRegister />} />
			<Route path="/home" element={<Home />} />
			<Route path="/exercicios" element={<Exercicios />} />
			<Route path="/metas" element={<Metas />} />
			<Route path="/agenda" element={<Agenda />} />
			<Route path="/treinos" element={<Treinos />} />
		</Routes>
	);
};

export default App;
