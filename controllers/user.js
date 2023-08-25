const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async')
require('dotenv').config();
const User = require('../models/User')

exports.validateTokenUser = asyncHandler(async (req, res, next) => {
  try {
    // Consultar la base de datos para obtener el usuario por su ID
    const user = await User.findByPk(req.userId);

    if (!user) {
      // Si el usuario no existe, el token no es válido
      return res.status(401).json({ error: "Token invalide, utilisateur non trouvé." });
    }

    // Si el usuario existe, el token es válido
    // Devolver toda la información del usuario, incluido el ID
    return res.json({
      user,
      data: 'ok'
    });
  } catch (err) {
    console.error('Error al validar el token:', err);
    return res.status(500).json({ error: "Oups, quelque chose s'est mal passé de notre côté. Veuillez réessayer plus tard." });
  }
});

exports.signinUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Consultar la base de datos para obtener el usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Si el usuario no existe, las credenciales son inválidas
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Comparar la contraseña ingresada con el hash almacenado en la base de datos
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Si la contraseña coincide, las credenciales son válidas
      const userForToken = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET);

      // Devolver toda la información del usuario, incluido el token y el ID
      return res.json({
        user,
        token,
      });
    } else {
      // Si la contraseña no coincide, las credenciales son inválidas
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
    }
  } catch (err) {
    console.error('Error al obtener el usuario:', err);
    return res.status(500).json({ error: "Oups, quelque chose s'est mal passé de notre côté. Veuillez réessayer plus tard." });
  }
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validar el formato del correo electrónico
    const emailRegex = /^([^@]+)@viacesi\.fr$/;
    const emailMatch = email.match(emailRegex);

    if (!emailMatch) {
      return res.status(400).json({ error: "Le format de l'email est incorrect. Veuillez utiliser une adresse @viacesi.fr." });
    }

    // Extraer el nombre y apellido del correo electrónico
    const firstName = emailMatch[1].split(".")[0];
    const lastName = emailMatch[1].split(".")[1];

    // Consultar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "L'utilisateur existe déjà" });
    }

    // Validar la contraseña con una expresión regular
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule et un chiffre.' });
    }

    // Insertar el nuevo usuario en la base de datos
    const newUser = await User.create({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    // Crear un token para el nuevo usuario
    const userForToken = {
      id: newUser.id,
      email: newUser.email,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET);

    // Devolver toda la información del usuario recién creado, incluyendo el token y el ID
    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        // Aquí puedes incluir otros campos relevantes del usuario si lo deseas
      },
      token,
      message: "L'utilisateur a été créé avec succès."
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    first_name,
    last_name,
    gender,
    email,
    newPassword,
    roles,
    address,
    driver,
    car_type,
    car_registration,
    car_nb_places,
  } = req.body;

  try {
    // Verificar si el usuario que quiere actualizar es el mismo que está autenticado
    if (req.userId !== Number(id)) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario' });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario solo si se envían en el cuerpo de la solicitud
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (gender !== undefined) user.gender = gender;
    if (email !== undefined) user.email = email;
    if (roles !== undefined) user.roles = roles;
    if (address !== undefined) user.address = address;
    if (driver !== undefined) user.driver = driver;
    if (car_type !== undefined) user.car_type = car_type;
    if (car_registration !== undefined) user.car_registration = car_registration;
    if (car_nb_places !== undefined) user.car_nb_places = car_nb_places;

    if (newPassword) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(newPassword, salt);
      user.password = hash;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    // Devolver toda la información del usuario actualizado
    return res.json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});


exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Consultar la base de datos para obtener el usuario por ID
    const user = await User.findOne({ where: { id } });

    if (!user) {
      // Si el usuario no existe, devolver un error 404
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Si el usuario existe, devolver toda su información
    return res.json(user);
  } catch (err) {
    console.error('Error al obtener el usuario por ID:', err);
    return res.status(500).json({ error: "Oups, quelque chose s'est mal passé de notre côté. Veuillez réessayer plus tard." });
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario que quiere eliminar es el mismo que está autenticado
    if (req.userId !== Number(id)) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este usuario' });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await user.destroy();

    // Devolver una respuesta de éxito
    return res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});



