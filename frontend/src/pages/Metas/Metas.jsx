import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SideBar from "../../components/SideBar/SideBar";
import { useEffect, useState } from "react";
import "./Metas.css";

const Metas = () => {
	const [formVisibleAdd, setFormVisibleAdd] = useState(false);
	const [metas, setMetas] = useState([]);
	const [filtro, setFiltro] = useState("todas");
	const [titulo_meta, setTituloMeta] = useState("");
	const [descricao_meta, setDescricaoMeta] = useState("");
	const [data_finalizacao_meta, setDataFinalizacaoMeta] = useState("");
	const [id_meta, setIdMeta] = useState("");
	const [metasFiltradas, setMetasFiltradas] = useState(metas); // estado para as metas filtradas

	const userId = localStorage.getItem("id");
	const navigate = useNavigate();

	useEffect(() => {
		if (!userId) {
			alert("Faça login no sistema");
			localStorage.removeItem("id");
			navigate("/");
		}
	}, [userId, navigate]);

	const formatarData = (dataISO) => {
		const data = new Date(dataISO);
		const dia = data.getDate().toString().padStart(2, "0");
		const mes = (data.getMonth() + 1).toString().padStart(2, "0");
		const ano = data.getFullYear();
		return `${dia}/${mes}/${ano}`;
	};

	const getMeta = async () => {
		try {
			const result = await fetch(
				`http://localhost:3000/api/metas/getmeta/${userId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data = await result.json();

			if (result.ok) {
				setMetas(data.meta); // Aqui, a chave correta retornada no backend é 'meta'
			} else {
				alert(`Erro ao buscar metas: ${data.error}`);
			}
		} catch (error) {
			console.error("Erro ao buscar metas", error);
		}
	};

	useEffect(() => {
		// Filtra as metas com base no filtro selecionado
		if (filtro === "todas") {
			setMetasFiltradas(metas); // Se for 'todas', mostra todas as metas
		} else {
			const status = filtro === "concluidas" ? 2 : 1; // Se for 'concluídas', id_status = 2, senão id_status = 1
			setMetasFiltradas(metas.filter((meta) => meta.id_status === status));
		}
	}, [filtro, metas]); // Sempre que o filtro ou metas mudarem, atualize as metas filtradas

	useEffect(() => {
		getMeta(); // Chama a API para buscar todas as metas
	}, []); // Apenas chama na primeira renderização

	const addMeta = async (event) => {
		event.preventDefault();

		try {
			const result = await fetch("http://localhost:3000/api/metas/addmeta", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id_user: userId,
					titulo_meta,
					descricao_meta,
					data_finalizacao_meta,
				}),
			});

			if (result.status === 201) {
				const data = await result.json();
				alert(data.message); // Sucesso
				setFormVisibleAdd(!formVisibleAdd);
				getMeta(); // Atualiza as metas
			} else {
				const data = await result.json();
				alert(`Erro ao adicionar meta: ${data.error || "Desconhecido"}`); // Exibe erro
			}
		} catch (error) {
			console.error("Erro ao adicionar meta:", error);
			alert("Ocorreu um erro ao adicionar a meta. Tente novamente mais tarde."); // Mensagem de erro genérica
		}
	};

	const editMeta = async (event, idMeta, concluida) => {
		event.preventDefault();

		const statusMeta = concluida ? 2 : 1; // 2 para concluída, 1 para em andamento

		try {
			// Fazendo o PUT para editar o status da meta
			const result = await fetch(
				`http://localhost:3000/api/metas/editmeta/${idMeta}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id_status: statusMeta }), // Enviando o status
				}
			);

			if (result.status === 200) {
				const data = await result.json();
				getMeta(); // Atualiza as metas na tela
			} else {
				const data = await result.json();
				alert(`Erro ao editar meta: ${data.error || "Desconhecido"}`);
			}
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
						<label htmlFor="filtro">Filtrar metas:</label>
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
										editMeta(e, meta.id_meta, e.target.checked); // Atualiza o status da meta no backend
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
						<form className="form-add" onSubmit={addMeta}>
							<label htmlFor="titulo">Título da Meta</label>
							<input
								type="text"
								placeholder="Digite o título da meta"
								value={titulo_meta}
								onChange={(e) => setTituloMeta(e.target.value)}
								required
							/>
							<label htmlFor="descricao">Descrição da Meta</label>
							<textarea
								placeholder="Digite a descrição da meta"
								value={descricao_meta}
								onChange={(e) => setDescricaoMeta(e.target.value)}
								required
							/>
							<label htmlFor="data">Data de Previsão</label>
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
