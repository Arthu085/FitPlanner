import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fetchTrainingSessionById } from "../../api/trainingSessionApi";

import Modal from "../../components/Modal";
import Buttons from "../../components/Buttons";

export default function DetailsModal({
	id_training_session,
	openDetailsModal,
	onClose,
}) {
	const { user } = useAuth();
	const token = user?.token;

	const [details, setDetails] = useState([]);

	useEffect(() => {
		const loadDetails = async () => {
			try {
				const data = await fetchTrainingSessionById(token, id_training_session);
				setDetails(data);
			} catch (error) {
				console.error("Erro ao buscar sessões de treino:", error);
			}
		};

		if (token && openDetailsModal) {
			loadDetails();
		}
	}, [token, openDetailsModal]);

	return (
		<Modal
			isOpen={openDetailsModal}
			onClose={onClose}
			title="Detalhes da sessão de treino"
			content={
				<div>
					<h2>Teste</h2>
				</div>
			}
			actions={
				<Buttons
					type={"primary"}
					text={"Fechar"}
					onClick={onClose}
					width="w-3xs"
				/>
			}
			size="big"
		/>
	);
}
