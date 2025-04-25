import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
	return (
		<div className="pagination-controls">
			<button onClick={onPrev} disabled={currentPage === 1}>
				Anterior
			</button>
			<span>
				Página {currentPage} de {totalPages}
			</span>
			<button onClick={onNext} disabled={currentPage === totalPages}>
				Próxima
			</button>
		</div>
	);
};

export default Pagination;
