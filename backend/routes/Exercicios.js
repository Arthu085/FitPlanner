const express = require("express");
const {
	getExercicios,
	addExercicios,
	deleteExercicio,
	editExercicio,
	getExerciciosNoLimit,
} = require("../controllers/ExerciciosController");
const router = express.Router();

router.get("/getexercicios", getExercicios);
router.get("/getexerciciosnolimit", getExerciciosNoLimit);
router.post("/addexercicio", addExercicios);
router.delete("/deleteexercicio/:id_exercise", deleteExercicio);
router.put("/editexercicio/:id_exercise", editExercicio);

module.exports = router;
