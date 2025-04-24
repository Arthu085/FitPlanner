import "./Metas.css";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import InfoToast from "../../components/InfoToast/InfoToast";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import SuccessToast from "../../components/SuccessToast/SuccessToast";

// react
import { useEffect, useState } from "react";

// hooks
import { useAuth } from "../../hooks/useAuth";
import { fetchMeta, createMeta, editMeta } from "../../hooks/api/metaApi";
import { useToast } from "../../hooks/useToast";

// utils
import { formatarData } from "../../utils/formatters";

const Metas = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [metas, setMetas] = useState([]);
	const [filtro, setFiltro] = useState("todas");
	const [titulo_meta, setTituloMeta] = useState("");
	const [descricao_meta, setDescricaoMeta] = useState("");
	const [data_finalizacao_meta, setDataFinalizacaoMeta] = useState("");
	const [id_meta, setIdMeta] = useState("");
	const [metasFiltradas, setMetasFiltradas] = useState(metas);
	const {
		errorMessage,
		showError,
		successMessage,
		showSuccess,
		infoMessage,
		showInfo,
		showErrorToast,
		showSuccessToast,
		showInfoToast,
		hideToasts,
	} = useToast();

	const { userId, isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
	}, []);

	useEffect(() => {
		if (filtro === "todas") {
			setMetasFiltradas(metas);
		} else {
			const status = filtro === "concluidas" ? 2 : 1;
			setMetasFiltradas(metas.filter((meta) => meta.id_status === status));
		}
	}, [filtro, metas]);

	useEffect(() => {
		loadMeta();
	}, [userId]);

	const loadMeta = async () => {
		const result = await fetchMeta(userId);

		if (!result.success) {
			showErrorToast(result.message);
			return;
		}

		if (result.success && result.data.length === 0) {
			showInfoToast(result.message);
			return;
		}

		setMetas(result.data);
	};

	const handleCreateMeta = async (e) => {
		e.preventDefault();

		const metaData = {
			userId,
			titulo_meta,
			descricao_meta,
			data_finalizacao_meta,
		};

		const result = await createMeta(metaData);

		if (!result.success) {
			showErrorToast(result.message);
			return;
		}

		showSuccessToast(result.message);
		setFormVisibleAdd(!formVisibleAdd);
		loadMeta();
		setTituloMeta("");
		setDescricaoMeta("");
		setDataFinalizacaoMeta("");
	};

	const handleEditMeta = async (e, idMeta, concluida) => {
		e.preventDefault();

		const statusMeta = concluida ? 2 : 1;

		const metaData = { id_meta: idMeta, statusMeta };

		const result = await editMeta(metaData);

		if (!result.success) {
			showErrorToast(result.message);
			return;
		}

		loadMeta();
		showSuccessToast(result.message);
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="toast-container">
				<ErrorToast
					message={errorMessage}
					show={showError}
					onClose={hideToasts}
				/>
				<SuccessToast
					message={successMessage}
					show={showSuccess}
					onClose={hideToasts}
				/>
				<InfoToast message={infoMessage} show={showInfo} onClose={hideToasts} />
			</div>
			<div className="container-page">
				<h1 className="tittle">Metas</h1>
				<div className="container-subtitle-btns">
					<h2 className="tittle-page">Metas Adicionadas:</h2>
					<div className="container-filtros-btns">
						<div className="filtros">
							<label>Filtrar metas:</label>
							<select
								id="filtro"
								value={filtro}
								onChange={(e) => setFiltro(e.target.value)}>
								<option value="todas">Todas</option>
								<option value="concluidas">Concluídas</option>
								<option value="andamento">Em Andamento</option>
							</select>
						</div>
						<button
							className="add-btn"
							onClick={() => setFormVisibleAdd(!formVisibleAdd)}>
							Adicionar Meta
						</button>
					</div>
				</div>

				<div className="metas-list">
					{metasFiltradas.length === 0 ? (
						<p>Nenhuma meta encontrada para o filtro selecionado.</p>
					) : (
						metasFiltradas.map((meta) => (
							<div
								key={meta.id_meta}
								className={`meta-content ${
									meta.id_status === 2 ? "checked" : ""
								}`}>
								<h2>{meta.titulo_meta}</h2>
								<div className="p-checkbox">
									<p>{meta.descricao_meta}</p>
									<input
										type="checkbox"
										checked={meta.id_status === 2} // Checkbox marcado se a meta for concluída (id_status 2)
										onChange={(e) => {
											// Alterando o estado do checkbox
											setIdMeta(meta.id_meta); // Atualiza o id da meta
											handleEditMeta(e, meta.id_meta, e.target.checked); // Atualiza o status da meta no backend
										}}
									/>
								</div>
								<div className="span-datas">
									<span>
										Data de criação: {formatarData(meta.data_criacao_meta)}
									</span>
									<span>
										Previsão de finalização:{" "}
										{formatarData(meta.data_finalizacao_meta)}
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{formVisibleAdd && (
				<div className="form-container">
					<div
						className="form-overlay"
						onClick={() => setFormVisibleAdd(false)}></div>
					<div className="form-content">
						<h2>Adicionar Meta</h2>
						<form className="form-add" onSubmit={handleCreateMeta}>
							<label>Título da Meta</label>
							<input
								type="text"
								placeholder="Digite o título da meta"
								value={titulo_meta}
								onChange={(e) => setTituloMeta(e.target.value)}
								required
							/>
							<label>Descrição da Meta</label>
							<textarea
								placeholder="Digite a descrição da meta"
								value={descricao_meta}
								onChange={(e) => setDescricaoMeta(e.target.value)}
								required
							/>
							<label>Data de Previsão</label>
							<input
								type="date"
								value={data_finalizacao_meta}
								onChange={(e) => setDataFinalizacaoMeta(e.target.value)}
								min={new Date().toISOString().split("T")[0]}
								required
							/>
							<button type="submit" className="add-btn">
								Adicionar
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Metas;
