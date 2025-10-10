import React, { useEffect, useState } from "react";
import {
  useCreateDevicesForm,
  initialDeviceValues,
} from "../../hooks/devices/useCreateDevicesForm.js";
import { FieldArray, FormikProvider, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";

// --- Subcomponente para cada fila del formulario dinámico ---
const DeviceSubForm = ({
  formik,
  index,
  onRemove,
  centros,
  isLoadingCatalogs,
}) => {
  const device = formik.values.devices[index];

  // Función auxiliar para obtener errores de campos anidados en Formik
  const getError = (fieldName) => {
    const error = getIn(formik.errors, `devices[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `devices[${index}].${fieldName}`);
    return touched && error ? error : null;
  };

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200";

  return (
    <div className="bg-background/50 p-6 rounded-lg shadow-inner relative border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">Equipo #{index + 1}</h3>
        {formik.values.devices.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error"
            title="Eliminar este equipo"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* Fila 1: Campos Principales */}
        <label className="block">
          <span className="text-text-main font-semibold">Serial:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`devices[${index}].serial`)}
          />
          {getError("serial") && (
            <div className="text-error text-sm mt-1">{getError("serial")}</div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">
            Centro de Operación:
          </span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(`devices[${index}].id_centro_operacion`)}
            disabled={isLoadingCatalogs}
          >
            <option value="">
              {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
            </option>
            {centros.map((c) => (
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
        <label className="block">
          <span className="text-text-main font-semibold">
            Tamaño Disco Duro (GB):
          </span>
          <input
            type="number"
            className={inputClasses}
            {...formik.getFieldProps(`devices[${index}].tamano_disco_duro`)}
          />
          {getError("tamano_disco_duro") && (
            <div className="text-error text-sm mt-1">
              {getError("tamano_disco_duro")}
            </div>
          )}
        </label>

        {/* Fila 2: Checkboxes para Lógica Condicional */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 border-t border-gray-200 pt-4 mt-2">
          <label className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              {...formik.getFieldProps(`devices[${index}].equipo_laptop`)}
              checked={device.equipo_laptop}
            />
            <span className="text-text-main font-semibold">¿Es Laptop?</span>
          </label>
          <label className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              {...formik.getFieldProps(
                `devices[${index}].equipo_tarjeta_grafica`
              )}
              checked={device.equipo_tarjeta_grafica}
            />
            <span className="text-text-main font-semibold">
              ¿Tiene Tarjeta Gráfica?
            </span>
          </label>
          <label className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              {...formik.getFieldProps(`devices[${index}].equipo_alquilado`)}
              checked={device.equipo_alquilado}
            />
            <span className="text-text-main font-semibold">¿Es Alquilado?</span>
          </label>
          <label className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              {...formik.getFieldProps(`devices[${index}].activo_fijo`)}
              checked={device.activo_fijo}
            />
            <span className="text-text-main font-semibold">
              ¿Es Activo Fijo?
            </span>
          </label>
        </div>

        {/* Fila 3: Inputs Condicionales */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {!device.equipo_laptop && (
            <label className="block animate-fade-in">
              <span className="text-text-main font-semibold">
                Serial de Pantalla:
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps(`devices[${index}].serial_pantalla`)}
              />
              {getError("serial_pantalla") && (
                <div className="text-error text-sm mt-1">
                  {getError("serial_pantalla")}
                </div>
              )}
            </label>
          )}
          {device.equipo_tarjeta_grafica && (
            <label className="block animate-fade-in">
              <span className="text-text-main font-semibold">
                Referencia Tarjeta Gráfica:
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps(
                  `devices[${index}].referencia_tarjeta_grafica`
                )}
              />
              {getError("referencia_tarjeta_grafica") && (
                <div className="text-error text-sm mt-1">
                  {getError("referencia_tarjeta_grafica")}
                </div>
              )}
            </label>
          )}
          {device.activo_fijo && (
            <label className="block animate-fade-in">
              <span className="text-text-main font-semibold">
                Código de Activo Fijo (Ingresar si lo tiene):
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps(
                  `devices[${index}].codigo_activo_fijo`
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
    </div>
  );
};

// --- Componente Principal (Modal) ---
export default function CreateDeviceForm({ onClose, onSuccess }) {
  const formik = useCreateDevicesForm(onSuccess);

  // Lógica para obtener catálogos
  const [centros, setCentros] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  useEffect(() => {
    api
      .get("/api/catalogo/centros-operacion")
      .then((res) => {
        setCentros(res.data);
        setIsLoadingCatalogs(false);
      })
      .catch((err) => {
        console.error("Error al cargar centros de operación", err);
        formik.setFieldError(
          "apiError",
          "No se pudieron cargar los centros de operación."
        );
        setIsLoadingCatalogs(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      {/* Contenedor principal del modal */}
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
          <h2 className="text-2xl font-bold text-primary">
            Registrar Nuevos Equipos
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            <FieldArray name="devices">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.devices.map((device, index) => (
                    <DeviceSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      centros={centros}
                      isLoadingCatalogs={isLoadingCatalogs}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push(initialDeviceValues)}
                    className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro equipo
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
                  : `Guardar ${formik.values.devices.length} Equipo(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
