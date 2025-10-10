import React, { useEffect, useState } from "react";
import {
  useCreateOperationCenterForm,
  initialCenterValues,
} from "../../hooks/operation-centers/useCreateOperationCenterForm.js";
import { FormikProvider, FieldArray, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";

// --- Subcomponente para cada fila del formulario dinámico ---
const CenterSubForm = ({
  formik,
  index,
  onRemove,
  ciudades,
  isLoadingCatalogs,
}) => {
  const getError = (fieldName) => {
    const error = getIn(formik.errors, `centers[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `centers[${index}].${fieldName}`);
    return touched && error ? error : null;
  };
  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="bg-background/50 p-6 rounded-lg shadow-inner relative border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">
          Centro de Operación #{index + 1}
        </h3>
        {formik.values.centers.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error"
            title="Eliminar este centro"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <label className="block">
          <span className="text-text-main font-semibold">Código:</span>
          <input
            type="number"
            className={inputClasses}
            {...formik.getFieldProps(`centers[${index}].codigo`)}
          />
          {getError("codigo") && (
            <div className="text-error text-sm mt-1">{getError("codigo")}</div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Ciudad:</span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(`centers[${index}].id_ciudad`)}
            disabled={isLoadingCatalogs}
          >
            <option value="">
              {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
            </option>
            {ciudades.map((c) => (
              <option key={c.id_ciudad} value={c.id_ciudad}>
                {c.nombre_ciudad}
              </option>
            ))}
          </select>
          {getError("id_ciudad") && (
            <div className="text-error text-sm mt-1">
              {getError("id_ciudad")}
            </div>
          )}
        </label>
        <label className="block md:col-span-2">
          <span className="text-text-main font-semibold">Dirección:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`centers[${index}].direccion`)}
          />
          {getError("direccion") && (
            <div className="text-error text-sm mt-1">
              {getError("direccion")}
            </div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Correo:</span>
          <input
            type="email"
            className={inputClasses}
            {...formik.getFieldProps(`centers[${index}].correo`)}
          />
          {getError("correo") && (
            <div className="text-error text-sm mt-1">{getError("correo")}</div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Teléfono:</span>
          <input
            type="tel"
            className={inputClasses}
            {...formik.getFieldProps(`centers[${index}].telefono`)}
          />
          {getError("telefono") && (
            <div className="text-error text-sm mt-1">
              {getError("telefono")}
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

// --- Componente Principal (Modal) ---
export default function CreateOperationCenterForm({ onClose, onSuccess }) {
  const formik = useCreateOperationCenterForm(onSuccess);
  const [ciudades, setCiudades] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await api.get("/api/catalogo/ciudades");
        setCiudades(response.data);
      } catch (error) {
        formik.setFieldError("apiError", "Error al cargar las ciudades.");
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, [formik.setFieldError]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
          <h2 className="text-2xl font-bold text-primary">
            Crear Nuevos Centros de Operación
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            <FieldArray name="centers">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.centers.map((center, index) => (
                    <CenterSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      ciudades={ciudades}
                      isLoadingCatalogs={isLoadingCatalogs}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push(initialCenterValues)}
                    className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro centro
                  </button>
                </div>
              )}
            </FieldArray>
            <hr className="my-8 border-gray-300" />
            <footer className="flex flex-col sm:flex-row justify-end items-center gap-4">
              {formik.errors.apiError && (
                <div className="text-error text-sm mr-auto font-semibold">
                  {formik.errors.apiError}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={formik.isSubmitting}
                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-main font-semibold w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || isLoadingCatalogs}
                className="py-2 px-4 rounded-lg bg-primary text-text-light font-bold hover:bg-primary-dark disabled:bg-primary/50 w-full sm:w-auto"
              >
                {formik.isSubmitting
                  ? "Guardando..."
                  : `Guardar ${formik.values.centers.length} Centro(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
