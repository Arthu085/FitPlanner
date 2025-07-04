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
	const [exerciseOptions, setExerciseOptions] = useState([]);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [loading, setLoading] = useState(true);
	const [btnDisabled, setBtnDisabled] = useState(false);

	const { values, handleChange, handleSubmit, resetForm } = useForm(
		{ exercise: [] },
		async (formData) => {
			try {
				if (!formData.exercise || formData.exercise.length === 0) {
					addToast("Adicione ao menos um exercício", "error");
					return;
				}

				setBtnDisabled(true);
				setLoading(true);

				const payload = formData.exercise.map((ex) => {
					const original = exerciseOptions.find(
						(o) => o.id_exercise === ex.id_exercise
					);

					const entry = { id_exercise: ex.id_exercise };

					if (!original || ex.series !== original.series) {
						entry.series = ex.series;
					}

					if (!original || ex.repetitions !== original.repetitions) {
						entry.repetitions = ex.repetitions;
					}

					if (!original || (ex.weight ?? "") !== (original.weight ?? "")) {
						entry.weight = ex.weight ?? null;
					}

					if (!original || (ex.notes ?? "") !== (original.notes ?? "")) {
						entry.notes = ex.notes ?? null;
					}

					return entry;
				});

				const data = await finishTrainingSession(
					token,
					session.id_training_session,
					payload
				);

				addToast(data.message, "success");
				navigate("/session/training");
			} catch (error) {
				addToast(error.message || "Erro ao finalizar treino", "error");
			} finally {
				setBtnDisabled(false);
				setLoading(false);
			}
		}
	);

	// Carregamento unificado da sessão + exercícios
	useEffect(() => {
		const loadAll = async () => {
			setLoading(true);

			try {
				// 1. Sessão
				const sessionData = await fetchTrainingSessionById(token, id);
				setSession(sessionData);

				// 2. Exercícios da sessão
				const exerciseSessionData = await fetchExerciseByTrainingAndSession(
					token,
					id
				);

				// 3. Todos os exercícios
				const allExercises = await fetchAllExercises(token);

				// 4. Filtra os da sessão
				const options = exerciseSessionData.map((exSession) => {
					const exercise = allExercises.find(
						(e) => e.id === exSession.id_exercise
					);

					return {
						value: exercise?.id,
						label: exercise?.name,
						id_exercise: exSession.id_exercise,
						series: exSession.series,
						repetitions: exSession.repetitions,
						weight: exSession.weight ?? "",
						notes: exSession.notes ?? "",
					};
				});

				setExerciseOptions(options);
				resetForm({ exercise: options });
			} catch (error) {
				addToast(error.message || "Erro ao carregar dados da sessão", "error");
			} finally {
				setLoading(false);
			}
		};

		if (token && id) loadAll();
	}, [token, id]);

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
		const h = Math.floor(s / 3600)
			.toString()
			.padStart(2, "0");
		const m = Math.floor((s % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const sec = (s % 60).toString().padStart(2, "0");
		return `${h}h:${m}m:${sec}s`;
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
						showNotesAndWeight={true}
						changeClass="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 w-full max-w-2xl mx-auto mb-4 mt-4 transition-colors duration-300"
					/>
				</Layout>
				<Footer />
			</Container>
		</>
	);
};

export default ActiveTrainingSession;
