import "./Metas.css";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import InfoToast from "../../components/InfoToast/InfoToast";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import SuccessToast from "../../components/SuccessToast/SuccessToast";
import Loading from "../../components/Loading/Loading";
import Pagination from "../../components/Pagination/Pagination";

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
	const [currentPage, setCurrentPage] = useState(1);
	const [totalMetas, setTotalMetas] = useState(0);
	const metasPorPagina = 12;
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
	const [loading, setLoading] = useState(false);

	const { userId, isLoggedIn } = useAuth();

	useEffect(() => {
		isLoggedIn();
	}, []);

	useEffect(() => {
		loadMeta();
	}, [userId, currentPage, filtro]);

	const loadMeta = async () => {
		setLoading(true);
		const result = await fetchMeta(userId, currentPage, filtro);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		if (result.data.length === 0) {
			showInfoToast(result.message);
			setMetas([]);
			setTotalMetas(0);
			setLoading(false);
			return;
		}

		setLoading(false);
		setMetas(result.data);
		setTotalMetas(result.total);
	};

	const totalPages = Math.ceil(totalMetas / metasPorPagina);

	const handleCreateMeta = async (e) => {
		e.preventDefault();

		const metaData = {
			userId,
			titulo_meta,
			descricao_meta,
			data_finalizacao_meta,
		};

		setLoading(true);
		const result = await createMeta(metaData);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadMeta();
		setLoading(false);
		showSuccessToast(result.message);
		setFormVisibleAdd(!formVisibleAdd);
		setTituloMeta("");
		setDescricaoMeta("");
		setDataFinalizacaoMeta("");
	};

	const handleEditMeta = async (e, idMeta, concluida) => {
		e.preventDefault();

		const statusMeta = concluida ? 2 : 1;

		const metaData = { id_meta: idMeta, statusMeta };

		setLoading(true);
		const result = await editMeta(metaData);

		if (!result.success) {
			showErrorToast(result.message);
			setLoading(false);
			return;
		}

		await loadMeta();
		setLoading(false);
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
			{loading && <Loading />}
			<div className="container-page">
				<h1 className="tittle">Metas</h1>
				<div className="container-subtitle-btns">
					<h2 className="tittle-page">Metas Adicionadas:</h2>
					<div className="container-filtros-btns">
						<div className="filtros">
							<label>Filtrar metas:</label>
							<select
								id="filtro"
								title="Selecione o filtro"
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
					{metas.length === 0 ? (
						<p>Nenhuma meta encontrada para o filtro selecionado.</p>
					) : (
						metas.map((meta) => (
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
										title="Marcar como concluída"
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
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						onNext={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
					/>
				)}
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
