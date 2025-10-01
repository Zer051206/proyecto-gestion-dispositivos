import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Person = sequelize.define("Person", {
    id_persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_persona",
    },
    nombre_persona: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "nombre_persona",
    },
    apellido_persona: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "apellido_persona",
    },
    id_tipo_identificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_tipo_identificacion",
      references: {
        model: "tipos_identificacion",
        key: "id_tipo_identificacion",
      },
    },
    identificacion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "identificacion",
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "telefono",
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_ciudad",
      references: {
        model: "ciudades",
        key: "id_ciudad",
      },
    },
    id_sede: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_sede",
      references: {
        model: "sedes",
        key: "id_sede",
      },
    },
    id_area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_area",
      references: {
        model: "areas",
        key: "id_area",
      },
    },
  });

  Person.associate = (models) => {
    Person.belongsTo(models.TiposIdentificacion, {
      foreignKey: "id_tipo_identificacion",
      as: "tiposId",
      onDelete: "RESTRICT",
    });

    Person.belongsTo(models.Ciudades, {
      foreignKey: "id_ciudad",
      as: "ciudad",
      onDelete: "RESTRICT",
    });

    Person.belongsTo(models.Sedes, {
      foreignKey: "id_sede",
      as: "sede",
      onDelete: "RESTRICT",
    });

    Person.belongsTo(models.Areas, {
      foreignKey: "id_area",
      as: "area",
      onDelete: "RESTRICT",
    });
  };

  return Person;
};
