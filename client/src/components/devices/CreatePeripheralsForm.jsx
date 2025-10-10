import React, { useEffect, useState } from "react";
import {
  useCreatePeripheralsForm,
  initialPeripheralValues,
} from "../../hooks/devices/useCreatePeripheralsForm.js";
import { FieldArray, FormikProvider, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";

// --- Subcomponente para cada fila del formulario dinámico ---
const PeripheralSubForm = ({
  formik,
  index,
  onRemove,
  catalogos,
  isLoadingCatalogs,
}) => {
  const peripheral = formik.values.peripherals[index];

  // Función auxiliar para obtener errores de campos anidados en Formik
  const getError = (fieldName) => {
    const error = getIn(formik.errors, `peripherals[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `peripherals[${index}].${fieldName}`);
    return touched && error ? error : null;
  };

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200";

  return (
    <div className="bg-background/50 p-6 rounded-lg shadow-inner relative border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">
          Periférico #{index + 1}
        </h3>
        {formik.values.peripherals.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error"
            title="Eliminar este periférico"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* --- CAMPOS PRINCIPALES --- */}
        <label className="block">
          <span className="text-text-main font-semibold">Serial:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`peripherals[${index}].serial_periferico`)}
          />
          {getError("serial_periferico") && (
            <div className="text-error text-sm mt-1">
              {getError("serial_periferico")}
            </div>
          )}
        </label>

        <label className="block">
          <span className="text-text-main font-semibold">Marca:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`peripherals[${index}].marca_periferico`)}
          />
          {getError("marca_periferico") && (
            <div className="text-error text-sm mt-1">
              {getError("marca_periferico")}
            </div>
          )}
        </label>

        <label className="block">
          <span className="text-text-main font-semibold">
            Tipo de Periférico:
          </span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(
              `peripherals[${index}].id_tipo_periferico`
            )}
            disabled={isLoadingCatalogs}
          >
            <option value="">
              {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
            </option>
            {catalogos.tiposPerifericos.map((t) => (
              <option key={t.id_tipo_periferico} value={t.id_tipo_periferico}>
                {t.tipo_periferico}
              </option>
            ))}
          </select>
          {getError("id_tipo_periferico") && (
            <div className="text-error text-sm mt-1">
              {getError("id_tipo_periferico")}
            </div>
          )}
        </label>

        <label className="block lg:col-span-2">
          <span className="text-text-main font-semibold">
            Centro de Operación:
          </span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(
              `peripherals[${index}].id_centro_operacion`
            )}
            disabled={isLoadingCatalogs}
          >
            <option value="">
              {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
            </option>
            {catalogos.centrosOperacion.map((c) => (
              <option key={c.id_centro_operacion} value={c.id_centro_operacion}>
                {c.codigo} - {c.direccion}
              </option>
            ))}
          </select>
          {getError("id_centro_operacion") && (
            <div className="text-error text-sm mt-1">
              {getError("id_centro_operacion")}
            </div>
          )}
        </label>

        <label className="flex items-center space-x-2 py-2 self-end">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            {...formik.getFieldProps(`peripherals[${index}].activo_fijo`)}
            checked={peripheral.activo_fijo}
          />
          <span className="text-text-main font-semibold">¿Es Activo Fijo?</span>
        </label>

        {/* --- INPUT CONDICIONAL --- */}
        {peripheral.activo_fijo && (
          <label className="block animate-fade-in">
            <span className="text-text-main font-semibold">
              Código de Activo Fijo (Ingresar si lo tiene):
            </span>
            <input
              type="text"
              className={inputClasses}
              {...formik.getFieldProps(
                `peripherals[${index}].codigo_activo_fijo`
              )}
            />
            {getError("codigo_activo_fijo") && (
              <div className="text-error text-sm mt-1">
                {getError("codigo_activo_fijo")}
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
};

// --- Componente Principal (Modal) ---
export default function CreatePeripheralForm({ onClose, onSuccess }) {
  const formik = useCreatePeripheralsForm(onSuccess);

  // Lógica para obtener catálogos
  const [catalogos, setCatalogos] = useState({
    tiposPerifericos: [],
    centrosOperacion: [],
  });
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [tiposRes, centrosRes] = await Promise.all([
          api.get("/api/catalogo/tipos-perifericos"),
          api.get("/api/catalogo/centros-operacion"),
        ]);
        setCatalogos({
          tiposPerifericos: tiposRes.data,
          centrosOperacion: centrosRes.data,
        });
      } catch (err) {
        console.error("Error al cargar los catálogos", err);
        formik.setFieldError(
          "apiError",
          "No se pudieron cargar los datos necesarios."
        );
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []); // El array vacío asegura que la llamada se haga solo una vez

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary">
          <h2 className="text-2xl font-bold text-primary">
            Registrar Nuevos Periféricos
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            <FieldArray name="peripherals">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.peripherals.map((peripheral, index) => (
                    <PeripheralSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      catalogos={catalogos}
                      isLoadingCatalogs={isLoadingCatalogs}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push(initialPeripheralValues)}
                    className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro periférico
                  </button>
                </div>
              )}
            </FieldArray>

            <hr className="my-8 border-gray-300" />

            <footer className="flex justify-end items-center gap-4">
              {formik.errors.apiError && (
                <div className="text-error text-sm mr-auto">
                  {formik.errors.apiError}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={formik.isSubmitting}
                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-main font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || isLoadingCatalogs}
                className="py-2 px-4 rounded-lg bg-primary text-text-light font-bold hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting
                  ? "Guardando..."
                  : `Guardar ${formik.values.peripherals.length} Periférico(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
