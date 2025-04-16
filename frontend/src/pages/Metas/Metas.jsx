import "./Metas.css";

// components
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";

// react
import { useEffect, useState } from "react";

// hooks
import { useAuth } from "../../hooks/useAuth";
import { fetchMeta, createMeta, editMeta } from "../../hooks/api/metaApi";

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
	const [metasFiltradas, setMetasFiltradas] = useState(metas); // estado para as metas filtradas

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
		try {
			const data = await fetchMeta(userId);

			setMetas(data.meta);
		} catch (error) {
			console.error("Erro ao buscar metas", error);
		}
	};

	const handleCreateMeta = async (e) => {
		e.preventDefault();

		const metaData = {
			userId,
			titulo_meta,
			descricao_meta,
			data_finalizacao_meta,
		};

		try {
			const data = await createMeta(metaData);

			alert(data.message);
			setFormVisibleAdd(!formVisibleAdd);
			loadMeta();
			setTituloMeta("");
			setDescricaoMeta("");
			setDataFinalizacaoMeta("");
		} catch (error) {
			console.error("Erro ao adicionar meta:", error);
			alert("Ocorreu um erro ao adicionar a meta. Tente novamente mais tarde."); // Mensagem de erro genérica
		}
	};

	const handleEditMeta = async (e, idMeta, concluida) => {
		e.preventDefault();

		const statusMeta = concluida ? 2 : 1;

		const metaData = { id_meta: idMeta, statusMeta };

		try {
			await editMeta(metaData);
			loadMeta();
		} catch (error) {
			console.error("Erro ao editar meta:", error);
			alert("Ocorreu um erro ao editar a meta. Tente novamente mais tarde.");
		}
	};

	return (
		<div className="sidebar-pages-container">
			<NavigationBar />
			<SideBar />
			<div className="container-metas">
				<h2>Lista de Metas</h2>
				<div className="filtro-btn-container">
					<button
						className="btn-add-meta"
						onClick={() => setFormVisibleAdd(!formVisibleAdd)}>
						Adicionar Meta
					</button>
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
				</div>
			</div>

			<div className="metas-list">
				{metasFiltradas.length === 0 ? (
					<p className="no-metas-message">
						Nenhuma meta encontrada para o filtro selecionado.
					</p>
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
