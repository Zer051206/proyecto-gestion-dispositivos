import { DataTypes } from "sequelize";

export default (sequelize) => {
  const TiposDispositivos = sequelize.define(
    "TiposDispositivos",
    {
      id_tipo_dispositivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_tipo_dispositivo",
      },
      tipo_dispositivo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "tipo_dispositivo",
      },
    },
    {
      tableName: "tipos_dispositivos",
      timestamps: false,
    }
  );

  const Ciudades = sequelize.define(
    "Ciudades",
    {
      id_ciudad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_ciudad",
      },
      nombre_ciudad: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "nombre_ciudad",
      },
    },
    {
      tableName: "ciudades",
      timestamps: false,
    }
  );

  const Sedes = sequelize.define(
    "Sedes",
    {
      id_sede: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_sede",
      },
      nombre_sede: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "nombre_sede",
      },
    },
    {
      tableName: "sedes",
      timestamps: false,
    }
  );

  const TiposIdentificacion = sequelize.define(
    "TiposIdentificacion",
    {
      id_tipo_identificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_tipo_identificacion",
      },
      tipo_identificacion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: "tipo_identificacion",
      },
    },
    {
      tableName: "tipos_identificacion",
      timestamps: false,
    }
  );

  const Areas = sequelize.define(
    "Areas",
    {
      id_area: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_area",
      },
      nombre_area: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    },
    {
      tableName: "areas",
      timestamps: false,
    }
  );

  TiposDispositivos.associate = (models) => {
    TiposDispositivos.hasMany(models.Device, {
      foreignKey: "id_tipo_dispositivo",
      onDelete: "STRICT",
    });
  };

  Ciudades.associate = (models) => {
    Ciudades.hasMany(models.Person, {
      foreignKey: "id_ciudad",
      onDelete: "STRICT",
    });
  };

  Sedes.associate = (models) => {
    Sedes.hasMany(models.Person, {
      foreignKey: "id_sede",
      onDelete: "STRICT",
    });
  };

  TiposIdentificacion.associate = (models) => {
    TiposIdentificacion.hasMany(models.Person, {
      foreignKey: "id_tipo_identificacion",
      onDelete: "STRICT",
    });
  };

  Areas.associate = (models) => {
    Areas.hasMany(models.Person, {
      foreignKey: "id_area",
      onDelete: "STRICT",
    });
  };

  return {
    TiposDispositivos,
    Ciudades,
    Sedes,
    TiposIdentificacion,
    Areas,
  };
};
