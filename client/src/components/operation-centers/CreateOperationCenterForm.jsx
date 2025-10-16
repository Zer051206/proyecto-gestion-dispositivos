/**
 * @file CreateOperationCenterForm.jsx
 * @module Components/OperationCenters
 * @description Componente de React que renderiza un formulario modal para la creación de uno o más Centros de Operación.
 * Utiliza un patrón de formulario dinámico con Formik y FieldArray, permitiendo al usuario añadir o quitar
 * formularios para centros individuales dentro de una misma transacción.
 * @requires react
 * @requires formik
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/operation-centers/useCreateOperationCenterForm.js
 * @requires ../../config/axios.js
 */
import React, { useEffect, useState } from "react";
import {
  useCreateOperationCenterForm,
  initialCenterValues,
} from "../../hooks/operation-centers/useCreateOperationCenterForm.js";
import { FormikProvider, FieldArray, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  handleAddressKeyDown,
  handleKeyTextDown,
  handleKeyNumberDown,
} from "../../utils/inputUtilities.js";
import api from "../../config/axios.js";

/**
 * @function CenterSubForm
 * @description Subcomponente que renderiza un conjunto de campos para un único Centro de Operación dentro del FieldArray.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formik - La instancia de Formik del formulario principal.
 * @param {number} props.index - El índice del centro actual en el array de `centers`.
 * @param {Function} props.onRemove - Función de FieldArray para eliminar este sub-formulario.
 * @param {Array<object>} props.ciudades - Array de ciudades para poblar el select.
 * @param {boolean} props.isLoadingCatalogs - Estado de carga de los catálogos.
 * @returns {JSX.Element}
 */
const CenterSubForm = ({
  formik,
  index,
  onRemove,
  ciudades,
  isLoadingCatalogs,
}) => {
  /**
   * @function getError
   * @description Función auxiliar para obtener el mensaje de error de un campo anidado en Formik.
   * @param {string} fieldName - El nombre del campo.
   * @returns {string|null} El mensaje de error si el campo ha sido tocado y tiene un error, de lo contrario null.
   */
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
            type="text"
            autoComplete="off"
            onKeyDown={handleKeyNumberDown}
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
            autoComplete="off"
            onKeyDown={handleAddressKeyDown}
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
            autoComplete="off"
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
            autoComplete="off"
            onKeyDown={handleKeyNumberDown}
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

/**
 * @function CreateOperationCenterForm
 * @description Componente principal del modal para crear Centros de Operación.
 * Se encarga de obtener los datos de catálogo necesarios (ciudades) y de orquestar
 * el formulario dinámico.
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClose - Callback para cerrar el modal.
 * @param {Function} props.onSuccess - Callback a ejecutar tras una creación exitosa.
 * @returns {JSX.Element}
 */
export default function CreateOperationCenterForm({ onClose, onSuccess }) {
  const formik = useCreateOperationCenterForm(onSuccess);
  const [ciudades, setCiudades] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await api.get("/api/catalogo/ciudades");
        setCiudades(response.data.cities || []);
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
