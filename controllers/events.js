const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name email')

  res.json({
    ok: true,
    eventos
  });
};
const CrearEvento = async(req, res = response) => {
  const evento = new Evento(req.body);
  evento.user = req.uid

  try {
    const eventoGuardado = await evento.save()
    res.json({
        ok: true,
        evento: eventoGuardado

    })

  } catch (error) {
    console.log(error);
    response.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
    })
  }

};
const ActualizarEventos = async(req, res = response) => {

    const eventoID = req.params.id

    try {
        const evento = await Evento.findById(eventoID)
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, nuevoEvento, {new: true})

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};
const BorrarEventos = async(req, res = response) => {
    const eventoID = req.params.id

    try {
        const evento = await Evento.findById(eventoID)
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            })
        }

        if(evento.user.toString() !== req.uid){
           return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

       await Evento.findByIdAndDelete(eventoID)

        res.json({
            ok: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

module.exports = {
  getEventos,
  CrearEvento,
  ActualizarEventos,
  BorrarEventos,
};
