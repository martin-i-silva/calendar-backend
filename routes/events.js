/*
Rutas CRUD / Events
host + /api/events
 */

const express = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const {validarCampos} = require("../middlewares/validar-campos");
const {isDate} = require("../helpers/isDate");
const {
  getEventos,
  CrearEvento,
  ActualizarEventos,
  BorrarEventos,
} = require("../controllers/events");


const router = express.Router();

//Todas tienen que pasar la validacion del JWT
// En vez de usar el middleware en cada ruta lo subo de nivel y lo utilizo antes
router.use(validarJWT)

// Obtener eventos
router.get("/", getEventos);

// Crear eventos
router.post("/", 
[
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate),
    check("end", "La fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos
],
CrearEvento);

// Actualizar eventos
router.put("/:id", ActualizarEventos);

// Borrar eventos
router.delete("/:id", BorrarEventos);

module.exports = router;
