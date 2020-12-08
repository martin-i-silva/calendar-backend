const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");
const jwt = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese mail",
      });
    }

    usuario = new Usuario(req.body);
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
    //Generar JWT
    const token = await generarJWT(usuario._id, usuario.name)

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese mail",
      });
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password)
    if(!validPassword){
        return res.status(400).json({
            ok: false,
            msg: 'Password incorrecto'
        })
    }
    // Generar JWT
    const token = await generarJWT(usuario._id, usuario.name)


      res.json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token 
      });
  } catch (error) {
      console.log(error)
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el administrador",
      });
  }
};
const revalidarToken = async (req, res = response) => {
  const {uid, name} = req
    
  // generar un nuevo token
  const token = await jwt.generarJWT(uid, name)


  res.json({
    ok: true,
    token, 
    uid,
    name
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
