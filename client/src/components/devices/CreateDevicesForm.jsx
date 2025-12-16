/**
 * @file CreateDevicesForm.jsx
 * @module Components/Devices
 * @description Componente de React que renderiza un formulario modal para la creación de uno o más equipos.
 * Utiliza un patrón de formulario dinámico con Formik y FieldArray, permitiendo al usuario añadir o quitar
 * formularios para equipos individuales dentro de una misma transacción. Este componente es responsable
 * de obtener los datos de catálogo necesarios (centros de operación) para sus campos.
 * @requires react
 * @requires formik
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/devices/useCreateDevicesForm.js
 * @requires ../../stores/authStore.js
 * @requires ../../config/axios.js
 */
import React, { useEffect, useState } from "react";
import {
  useCreateDevicesForm,
  initialDeviceValues,
} from "../../hooks/devices/useCreateDevicesForm.js";
import { FieldArray, FormikProvider, getIn, useFormikContext } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { handleKeyNumberDown } from "../../utils/inputUtilities.js";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

const FixedWrapper = (props) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
    {props.children}
  </div>
);

const ContentWrapper = (props) => (
  <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
    {props.children}
  </div>
);

/**
 * @function DeviceSubForm
 * @description Subcomponente que renderiza un conjunto de campos para un único Equipo dentro del FieldArray.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formik - La instancia de Formik del formulario principal.
 * @param {number} props.index - El índice del equipo actual en el array `devices`.
 * @param {Function} props.onRemove - Función de FieldArray para eliminar este sub-formulario.
 * @param {Array<object>} props.centros - Array de centros de operación para poblar el select.
 * @param {boolean} props.isLoadingCatalogs - Estado de carga de los catálogos.
 * @returns {JSX.Element}
 */
const DeviceSubForm = React.memo(
  ({
    index,
    onRemove,
    centros,
    isLoadingCatalogs,
    isRemoveDisabled,
    isReqFlow,
  }) => {
    const formik = useFormikContext();
    const device = formik.values.devices[index];
    const { user } = useAuthStore();

    const [costCenters, setCostCenters] = useState([]);
    const [isLoadingCostCenters, setIsLoadingCostCenters] = useState(false);
    const selectedCenterId =
      device.id_centro_operacion ||
      (user.rol === "Encargado" ? user.id_centro_operacion : null);

    useEffect(() => {
      if (selectedCenterId) {
        setIsLoadingCostCenters(true);
        api
          .get(`/api/centros-operacion/${selectedCenterId}/costos`)
          .then((res) => {
            return setCostCenters(res.data.centerCost || []);
          })
          .catch((err) =>
            console.error("Error al cargar los centros de costo", err)
          )
          .finally(() => setIsLoadingCostCenters(false));
      } else {
        setCostCenters([]);
      }
    }, [selectedCenterId]);

    /**
     * @function getError
     * @description Función auxiliar para obtener el mensaje de error de un campo anidado en Formik.
     * @param {string} fieldName - El nombre del campo.
     * @returns {string|null} El mensaje de error si el campo ha sido tocado y tiene un error, de lo contrario null.
     */
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
          <h3 className="text-lg font-bold text-primary">
            Equipo #{index + 1}
          </h3>
          {formik.values.devices.length > 1 && !isReqFlow && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={isRemoveDisabled}
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
              autoComplete="off"
              className={inputClasses}
              {...formik.getFieldProps(`devices[${index}].serial`)}
            />
            {getError("serial") && (
              <div className="text-error text-sm mt-1">
                {getError("serial")}
              </div>
            )}
          </label>
          {user?.rol === "Admin" ? (
            <label className="block">
              <span className="text-text-main font-semibold">
                Centro de Operación:
              </span>
              <select
                className={`${inputClasses} ${
                  isReqFlow
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
                {...formik.getFieldProps(
                  `devices[${index}].id_centro_operacion`
                )}
                // Deshabilitar si se está cargando el catálogo O si estamos en flujo de requerimiento (ya se autoseleccionó)
                disabled={isLoadingCatalogs || isReqFlow}
              >
                <option value="" hidden>
                  {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
                </option>
                {centros.map((c) => (
                  <option
                    key={c.id_centro_operacion}
                    value={c.id_centro_operacion}
                  >
                    {c.codigo} - {c.direccion} - {c.City.nombre_ciudad}
                  </option>
                ))}
              </select>
              {getError("id_centro_operacion") && (
                <div className="text-error text-sm mt-1">
                  {getError("id_centro_operacion")}
                </div>
              )}
              {/* Mensaje de CO para el Admin en flujo de Requerimiento */}
              {isReqFlow && (
                <div className="text-sm mt-1 text-primary/80 font-medium">
                  Asignado automáticamente por requerimiento.
                </div>
              )}
            </label>
          ) : (
            <div className="block">
              <span className="text-text-main font-semibold">
                Centro de Operación:
              </span>
              <p className={`${inputClasses} bg-gray-200 text-gray-500`}>
                {"Asignado a tu centro"}
              </p>
            </div>
          )}
          <label className="block">
            <span className="text-text-main font-semibold">
              Tamaño Disco Duro (GB):
            </span>
            <input
              type="number"
              onKeyDown={handleKeyNumberDown}
              autoComplete="off"
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
                autoComplete="off"
                className="h-4 w-4 rounded"
                {...formik.getFieldProps(`devices[${index}].equipo_alquilado`)}
                checked={device.equipo_alquilado}
              />
              <span className="text-text-main font-semibold">
                ¿Es Alquilado?
              </span>
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
            {selectedCenterId && (
              <label className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  {...formik.getFieldProps(`devices[${index}].has_cost_center`)}
                  checked={device.has_cost_center}
                />
                <span className="text-text-main font-semibold">
                  ¿Asignado a un Área?
                </span>
              </label>
            )}
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
                  autoComplete="off"
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
                  autoComplete="off"
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
            {device.equipo_alquilado && (
              <label className="block animate-fade-in">
                <span className="text-text-main font-semibold">
                  Empresa que Alquila:
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  className={inputClasses}
                  {...formik.getFieldProps(`devices[${index}].empresa_alquila`)}
                />
                {getError("empresa_alquila") && (
                  <div className="text-error text-sm mt-1">
                    {getError("empresa_alquila")}
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
                  autoComplete="off"
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
            {device.has_cost_center && (
              <label className="block animate-fade-in">
                <span className="text-text-main font-semibold">
                  Centro de Costo (Área):
                </span>
                <select
                  className={inputClasses}
                  {...formik.getFieldProps(`devices[${index}].id_centro_costo`)}
                  disabled={isLoadingCostCenters || costCenters.length === 0}
                >
                  <option value="" hidden>
                    {isLoadingCostCenters
                      ? "Cargando áreas..."
                      : costCenters.length === 0
                      ? "No hay áreas para este centro"
                      : "Selecciona..."}
                  </option>
                  {costCenters.map((cc) => (
                    <option key={cc.id_centro_costo} value={cc.id_centro_costo}>
                      {cc.codigo_centro_costo} - {cc.centro_costo}
                    </option>
                  ))}{" "}
                </select>
                {getError("id_centro_costo") && (
                  <div className="text-error text-sm mt-1">
                    {getError("id_centro_costo")}
                  </div>
                )}
              </label>
            )}
          </div>
        </div>
      </div>
    );
  }
);

/**
 * @function CreateDeviceForm
 * @description Componente principal del modal para crear Equipos.
 * Se encarga de obtener los datos de catálogo necesarios (centros de operación)
 * y de orquestar el formulario dinámico.
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClose - Callback para cerrar el modal.
 * @param {Function} props.onSuccess - Callback a ejecutar tras una creación exitosa.
 * @returns {JSX.Element}
 */
export default function CreateDeviceForm({
  onClose,
  onSuccess,
  idRequerimiento = null,
  requiredQuantity = null,
  setCompleted = () => {},
  isNestedForm = false,
}) {
  const { formik, requiredCount, isLoadingCo } = useCreateDevicesForm(
    onSuccess,
    idRequerimiento // Pasar el ID del requerimiento al hook
  );

  const isReqFlow = idRequerimiento !== null;

  const SelectedFixedWrapper = isNestedForm ? React.Fragment : FixedWrapper;
  const SelectedContentWrapper = isNestedForm ? React.Fragment : ContentWrapper;

  const RenderedModalHeader = isNestedForm ? null : (
    <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
      <h2 className="text-2xl font-bold text-primary">
        {isReqFlow
          ? `Registro para Requerimiento #${idRequerimiento}`
          : "Registrar Nuevos Equipos"}
      </h2>
      <button onClick={onClose} className="text-text-main hover:opacity-70">
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </header>
  );

  // Lógica para obtener catálogos
  const [centros, setCentros] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  useEffect(() => {
    // Solo cargamos los centros de operación si NO estamos en un flujo de requerimiento
    // o si el Admin todavía debe seleccionar uno (en cuyo caso, idRequerimiento sería null).
    if (!isReqFlow) {
      api
        .get("/api/centros-operacion")
        .then((res) => {
          setCentros(res.data.operationCenters || []);
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
    } else {
      // Si es flujo de requerimiento, el select de CO está deshabilitado y ya autoseleccionado,
      // por lo que no es estrictamente necesario cargar el catálogo para el Admin, aunque puede ser útil para la UI.
      setIsLoadingCatalogs(false);
    }
  }, [isReqFlow, formik.setFieldError]); // Dependencia en isReqFlow

  // Lógica de deshabilitación y limitación de formularios
  const currentCount = formik.values.devices.length;
  // Botón Agregar: Deshabilitado si requiredCount es conocido y se alcanzó el límite.
  const isAddDisabled = requiredCount !== null && currentCount >= requiredCount;
  // Botón Eliminar: Deshabilitado si requiredCount es conocido y el conteo actual es igual al requerido (límite estricto).
  const isRemoveDisabled =
    requiredCount !== null && currentCount <= requiredCount;
  // Carga general: Deshabilitar el formulario si se están cargando catálogos O si el hook está haciendo su fetch inicial.
  const isFormDisabled =
    formik.isSubmitting || isLoadingCatalogs || isLoadingCo;

  const shouldShowAddButton =
    !isReqFlow || // Siempre mostrar en flujo normal
    (isReqFlow && requiredCount === null) || // Mostrar si es requerimiento pero el límite aún no carga
    (isReqFlow && requiredCount !== null && currentCount < requiredCount);

  return (
    <SelectedFixedWrapper>
      <SelectedContentWrapper>
        {RenderedModalHeader}{" "}
        {/* Renderiza el encabezado solo si es un modal completo */}
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className={isNestedForm ? "space-y-6" : "p-6"}
          >
            {/* Título simple para el formulario anidado */}
            {isNestedForm && (
              <h3 className="text-xl font-bold text-primary mb-4">
                Registro de Equipos para Requerimiento #{idRequerimiento}
              </h3>
            )}

            <FieldArray name="devices">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {/* Indicador de Límite (si aplica) */}
                  {isReqFlow && isLoadingCo && (
                    <div
                      className="bg-gray-50 border text-primary px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Cargando datos:</strong>
                      <span className="block sm:inline ml-2">
                        Obteniendo Centro de Operación y límite de equipos del
                        Análisis Técnico...
                      </span>
                    </div>
                  )}
                  {requiredCount !== null &&
                    requiredCount > 0 &&
                    isReqFlow &&
                    !isLoadingCo && (
                      <div
                        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                        role="alert"
                      >
                        <strong className="font-bold">
                          Límite Establecido:
                        </strong>
                        <span className="block sm:inline ml-2">
                          Debe registrar exactamente {requiredCount} equipo(s).
                        </span>
                      </div>
                    )}

                  {formik.values.devices.map((device, index) => (
                    <DeviceSubForm
                      key={index}
                      index={index}
                      onRemove={() => remove(index)}
                      centros={centros}
                      isLoadingCatalogs={isLoadingCatalogs}
                      isRemoveDisabled={isRemoveDisabled || isLoadingCo}
                      isReqFlow={isReqFlow || isLoadingCo}
                    />
                  ))}

                  {shouldShowAddButton && (
                    <button
                      type="button"
                      onClick={() => push(initialDeviceValues)}
                      disabled={isAddDisabled || isFormDisabled}
                      className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        isReqFlow &&
                        requiredCount !== null &&
                        currentCount >= requiredCount
                          ? `Límite alcanzado (${requiredCount})` // Ya no se renderiza si se alcanza el límite, pero por si acaso.
                          : "Añadir otro equipo"
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Añadir otro equipo
                      {requiredCount !== null &&
                        ` (${currentCount}/${requiredCount})`}
                    </button>
                  )}
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
              {/* Botón Cancelar (solo visible en el modal completo) */}
              {!isNestedForm && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isFormDisabled}
                  className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-text-main font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={
                  isFormDisabled ||
                  (requiredCount !== null && currentCount !== requiredCount)
                }
                className="py-2 px-4 rounded-lg bg-primary text-text-light font-bold hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting
                  ? "Guardando..."
                  : `Guardar ${formik.values.devices.length} Equipo(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </SelectedContentWrapper>
    </SelectedFixedWrapper>
  );
}
