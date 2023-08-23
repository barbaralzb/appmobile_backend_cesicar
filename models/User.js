const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../dbConfig');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [3, 50],
        msg: 'Votre prénom doit comporter au minimum 3 caractères et au maximum 50 caractères.',
      },
    },
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [3, 50],
        msg: 'Votre nom doit comporter au minimum 3 caractères et au maximum 50 caractères.',
      },
    },
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [['homme', 'femme', 'autre']],
        msg: 'Genre non valide. Les options valides sont "homme", "femme" ou "autre".',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Votre email est indispensable pour vous identifier.',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Votre mot de passe est indispensable pour vous identifier.',
      },
    },
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  driver: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  car_type: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Le type de votre véhicule est nécessaire si vous êtes un conducteur.',
      },
    },
  },
  car_registration: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: "Votre plaque d'immatriculation est nécessaire si vous êtes un conducteur.",
      },
      is: {
        args: /^[A-Z]{2}[-][0-9]{3}[-][A-Z]$/,
        msg: 'Votre immatriculation doit respecter le format AB-123-CD.',
      },
    },
  },
  car_nb_places: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Le nombre de places disponibles dans votre véhicule est nécessaire si vous êtes un conducteur.',
      },
    },
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
    timestamps: true, // Habilitar timestamps createdAt y updatedAt
    tableName: 'user', // Cambiar el nombre de la tabla aquí si lo deseas
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Hook para hashear la contraseña antes de guardar
User.beforeCreate(async (user) => {
  try {
    const saltRounds = 10; // Número de vueltas de sal. Cuanto mayor, más lento será el hash pero más seguro.
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
});

module.exports = User;
