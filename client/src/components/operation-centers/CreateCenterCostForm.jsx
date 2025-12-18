/**
 * @file CreateCostCenterForm.jsx
 * @module Components/OperationCenters
 * @description Componente que renderiza un formulario modal para la creación de uno o más Centros de Costo.
 * Permite la creación dinámica mediante FieldArray y asocia cada centro de costo a un Centro de Operación.
 * @requires formik
 * @requires ../../hooks/operation-centers/useCreateCenterCostForm.js
 */
import React from "react";
import {
  useCreateCenterCostForm,
  initialCenterCostValues,
} from "../../hooks/operation-centers/useCreateCenterCostForm.js";
import { FormikProvider, FieldArray, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  handleKeyTextDown,
  handleKeyNumberDown,
} from "../../utils/inputUtilities.js";
/**
 * @function CenterCostSubForm
 * @description Subcomponente para un único Centro de Costo dentro del FieldArray.
 * @param {object} props - Propiedades del componente.
 */
const CenterCostSubForm = ({
  formik,
  index,
  onRemove,
  centrosOperacion,
}) => {
  const getError = (fieldName) => {
    const error = getIn(formik.errors, `centerCosts[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `centerCosts[${index}].${fieldName}`);
    return touched && error ? error : null;
  };

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="bg-background/50 p-6 rounded-lg shadow-inner relative border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">
          Centro de Costo #{index + 1}
        </h3>
        {formik.values.centerCosts.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error"
            title="Eliminar este ítem"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Código del Centro de Costo */}
        <label className="block">
          <span className="text-text-main font-semibold">Código C.C:</span>
          <input
            type="text"
            autoComplete="off"
            onKeyDown={handleKeyNumberDown}
            className={inputClasses}
            placeholder="Ej: 1020"
            {...formik.getFieldProps(`centerCosts[${index}].codigo_centro_costo`)}
          />
          {getError("codigo_centro_costo") && (
            <div className="text-error text-sm mt-1">{getError("codigo_centro_costo")}</div>
          )}
        </label>

        {/* Nombre del Centro de Costo */}
        <label className="block">
          <span className="text-text-main font-semibold">Nombre Centro de Costo:</span>
          <input
            type="text"
            autoComplete="off"
            onKeyDown={handleKeyTextDown}
            className={inputClasses}
            placeholder="Ej: Administración"
            {...formik.getFieldProps(`centerCosts[${index}].centro_costo`)}
          />
          {getError("centro_costo") && (
            <div className="text-error text-sm mt-1">{getError("centro_costo")}</div>
          )}
        </label>

        {/* Selección de Centro de Operación (Afiliación) */}
        <label className="block md:col-span-2">
          <span className="text-text-main font-semibold">Centro de Operación (Sede):</span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(`centerCosts[${index}].id_centro_operacion`)}
          >
            <option value="" hidden>
              Selecciona la sede a la que pertenece...
            </option>
            {centrosOperacion.map((co) => (
              <option key={co.id_centro_operacion} value={co.id_centro_operacion}>
                {co.codigo} - {co.direccion} - {co.City?.nombre_ciudad}
              </option>
            ))}
          </select>
          {getError("id_centro_operacion") && (
            <div className="text-error text-sm mt-1">{getError("id_centro_operacion")}</div>
          )}
        </label>
      </div>
    </div>
  );
};

/**
 * @function CreateCenterCostForm
 * @description Componente principal para el modal de creación de Centros de Costo.
 */
export default function CreateCenterCostForm({ onClose, onSuccess, centrosOperacion = [] }) {
  const formik = useCreateCenterCostForm(onSuccess);
  const activeCenters = centrosOperacion.filter(c => c.activo);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
          <h2 className="text-2xl font-bold text-primary">
            Registrar Centros de Costo
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            <FieldArray name="centerCosts">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.centerCosts.map((_, index) => (
                    <CenterCostSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      centrosOperacion={activeCenters}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push(initialCenterCostValues)}
                    className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-all"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro centro de costo
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
                disabled={formik.isSubmitting}
                className="py-2 px-4 rounded-lg bg-primary text-text-light font-bold hover:bg-primary-dark disabled:bg-primary/50 w-full sm:w-auto transition-colors"
              >
                {formik.isSubmitting
                  ? "Guardando..."
                  : `Guardar ${formik.values.centerCosts.length} Centro(s) de Costo`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}