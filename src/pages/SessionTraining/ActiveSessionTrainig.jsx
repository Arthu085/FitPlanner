import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
	fetchExerciseByTrainingAndSession,
	fetchTrainingSessionById,
	finishTrainingSession,
} from "../../api/trainingSessionApi";
import { fetchAllExercises } from "../../api/exerciseApi";

import Form from "../../components/Form";
import LoadingScreen from "../../components/LoadingScreen";
import Container from "../../components/Container";
import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";
import Layout from "../../components/Layout";
import Footer from "../../components/Footer";

const ActiveTrainingSession = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const token = user?.token;
	const addToast = useToast();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [session, setSession] = useState(null);
	const [exerciseSession, setExerciseSession] = useState(null);
	const [exerciseOptions, setExerciseOptions] = useState([]);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	// Form
	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ exercise: [] },
		async (formData) => {
			try {
				if (!formData.exercise || formData.exercise.length === 0) {
					addToast("Adicione ao menos um exercício", "error");
					return;
				}

				const payload = formData.exercise.map((ex) => ({
					id_exercise: ex.id_exercise,
					series: ex.series,
					repetitions: ex.repetitions,
				}));

				const data = await finishTrainingSession(token, session.id, {
					exercises: payload,
				});

				addToast(data.message, "success");
				navigate("/training/session");
			} catch (error) {
				addToast(error.message || "Erro ao finalizar treino", "error");
			}
		}
	);

	// Busca sessão
	useEffect(() => {
		const loadSession = async () => {
			setLoading(true);
			try {
				const data = await fetchTrainingSessionById(token, id);
				setSession(data);
			} catch (error) {
				addToast(error.message || "Erro ao buscar detalhes da sessão", "error");
			} finally {
				setLoading(false);
			}
		};

		if (id && token) loadSession();
	}, [id, token]);

	// Busca IDs dos exercícios da sessão
	useEffect(() => {
		const loadExerciseSession = async () => {
			try {
				const data = await fetchExerciseByTrainingAndSession(token, id);
				setExerciseSession(data);
			} catch (error) {
				addToast(error.message, "error");
			}
		};

		if (id && token) loadExerciseSession();
	}, [id, token]);

	// Busca detalhes dos exercícios da sessão (nome, etc.)
	useEffect(() => {
		const loadExercises = async () => {
			try {
				if (!token || !exerciseSession?.length) return;

				setLoading(true);

				const allExercises = await fetchAllExercises(token);

				// Filtra apenas os exercícios da sessão
				const sessionExerciseIds = exerciseSession.map((ex) => ex.id_exercise);

				const filteredExercises = allExercises.filter((ex) =>
					sessionExerciseIds.includes(ex.id)
				);

				const options = filteredExercises.map((ex) => ({
					value: ex.id,
					label: ex.name,
					id_exercise: ex.id,
					series: ex.series,
					repetitions: ex.repetitions,
				}));

				setExerciseOptions(options);
				resetForm({ exercise: options });
			} catch (error) {
				addToast(error.message || "Erro ao buscar exercícios", "error");
			} finally {
				setLoading(false);
			}
		};

		loadExercises();
	}, [token, exerciseSession]);

	// Cronômetro
	useEffect(() => {
		if (!session?.started_at) return;

		const start = new Date(session.started_at);
		const interval = setInterval(() => {
			const now = new Date();
			setElapsedTime(Math.floor((now - start) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [session]);

	const formatTime = (s) => {
		const m = Math.floor(s / 60)
			.toString()
			.padStart(2, "0");
		const sec = (s % 60).toString().padStart(2, "0");
		return `${m}:${sec}`;
	};

	return (
		<>
			{loading && <LoadingScreen />}

			<Container>
				<Header />
				<Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
				<Layout isSidebarOpen={isSidebarOpen} title="Treino em andamento">
					<section className="space-y-2 mt-7 mb-5 flex flex-row justify-between items-center">
						<div>
							<p className="text-black dark:text-white">
								Tempo decorrido: <strong>{formatTime(elapsedTime)}</strong>
							</p>
						</div>
					</section>

					<Form
						title="Finalizar treino"
						btnTitle="Finalizar"
						btnType="primary"
						btnDisabled={btnDisabled}
						fields={[{ name: "exercise" }]}
						values={values}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						exerciseOptions={exerciseOptions}
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default ActiveTrainingSession;
