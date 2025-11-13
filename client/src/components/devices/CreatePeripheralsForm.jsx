/**
 * @file CreatePeripheralsForm.jsx
 * @module Components/Peripherals
 * @description Componente de React que renderiza un formulario modal para la creación de uno o más periféricos.
 * Utiliza un patrón de formulario dinámico con Formik y FieldArray, permitiendo al usuario añadir o quitar
 * formularios para periféricos individuales dentro de una misma transacción. Este componente es responsable
 * de obtener los datos de catálogo necesarios (tipos de periféricos, centros de operación) para sus campos.
 * @requires react
 * @requires formik
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/devices/useCreatePeripheralsForm.js
 * @requires ../../stores/authStore.js
 * @requires ../../config/axios.js
 */
import React, { useEffect, useState } from "react";
import {
  useCreatePeripheralsForm,
  initialPeripheralValues,
} from "../../hooks/devices/useCreatePeripheralsForm.js";
import { FieldArray, FormikProvider, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @function PeripheralSubForm
 * @description Subcomponente que renderiza un conjunto de campos para un único Periférico dentro del FieldArray.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formik - La instancia de Formik del formulario principal.
 * @param {number} props.index - El índice del periférico actual en el array `peripherals`.
 * @param {Function} props.onRemove - Función de FieldArray para eliminar este sub-formulario.
 * @param {object} props.catalogos - Objeto que contiene los arrays de datos para los selects.
 * @param {boolean} props.isLoadingCatalogs - Estado de carga de los catálogos.
 * @returns {JSX.Element}
 */
const PeripheralSubForm = React.memo(
  ({
    formik,
    index,
    onRemove,
    catalogos,
    isLoadingCatalogs,
    isRemoveDisabled,
    isReqFlow,
  }) => {
    const peripheral = formik.values.peripherals[index];

    const { user } = useAuthStore();
    const isAdmin = user?.rol === "Admin";

    const [costCenters, setCostCenters] = useState([]);
    const [isLoadingCostCenters, setIsLoadingCostCenters] = useState(false);
    const selectedCenterId =
      peripheral.id_centro_operacion ||
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
      const error = getIn(formik.errors, `peripherals[${index}].${fieldName}`);
      const touched = getIn(
        formik.touched,
        `peripherals[${index}].${fieldName}`
      );
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
          {formik.values.peripherals.length > 1 && !isReqFlow && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={isRemoveDisabled}
              className="text-accent hover:text-error disabled:opacity-50"
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
              autoComplete="off"
              className={inputClasses}
              {...formik.getFieldProps(
                `peripherals[${index}].serial_periferico`
              )}
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
              autoComplete="off"
              className={inputClasses}
              {...formik.getFieldProps(
                `peripherals[${index}].marca_periferico`
              )}
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
              <option value="" hidden>
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

          {isAdmin ? (
            <label className="block mt-6">
              <span className="text-text-main font-semibold">
                Centro de Operación:
              </span>
              <select
                // Clases condicionales para deshabilitar visualmente en flujo de requerimiento
                className={`${inputClasses} ${
                  isReqFlow
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
                {...formik.getFieldProps(
                  `peripherals[${index}].id_centro_operacion`
                )}
                // Deshabilitado si se está cargando el catálogo O si es un flujo de requerimiento (auto-asignación)
                disabled={isLoadingCatalogs || isReqFlow}
              >
                <option value="" hidden>
                  {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
                </option>
                {catalogos.centrosOperacion.map((c) => (
                  <option
                    key={c.id_centro_operacion}
                    value={c.id_centro_operacion}
                  >
                    {c.codigo} - {c.direccion}
                  </option>
                ))}
              </select>
              {getError("id_centro_operacion") && (
                <div className="text-error text-sm mt-1">
                  {getError("id_centro_operacion")}
                </div>
              )}
              {isReqFlow && (
                <div className="text-sm mt-1 text-primary/80 font-medium">
                  Asignado automáticamente por requerimiento.
                </div>
              )}
            </label>
          ) : (
            // --- Caso: Usuario NO es Admin (Encargado) ---
            <div className="block mt-6">
              <span className="text-text-main font-semibold">
                Centro de Operación:
              </span>
              <p className={`${inputClasses} bg-gray-200 text-gray-500`}>
                {"Asignado a tu centro"}
              </p>
            </div>
          )}

          {/* --- INPUTS CONDICIONALES --- */}
          {peripheral.activo_fijo && (
            <label className="block animate-fade-in">
              <span className="text-text-main font-semibold">
                Código de Activo Fijo (Ingresar si lo tiene):
              </span>
              <input
                type="text"
                autoComplete="off"
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
          {peripheral.has_cost_center && (
            <label className="block animate-fade-in mt-6">
              <span className="text-text-main font-semibold">
                Centro de Costo (Área):
              </span>
              <select
                className={inputClasses}
                {...formik.getFieldProps(
                  `peripherals[${index}].id_centro_costo`
                )}
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
          {selectedCenterId && (
            <label className="flex items-center justify-center space-x-2 py-2 mt-8">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                {...formik.getFieldProps(
                  `peripherals[${index}].has_cost_center`
                )}
                checked={peripheral.has_cost_center}
              />
              <span className="text-text-main font-semibold">
                ¿Asignado a un Área?
              </span>
            </label>
          )}
          <label className="flex items-center justify-center space-x-2 py-2 mt-8">
            <input
              type="checkbox"
              autoComplete="off"
              className="h-4 w-4 rounded"
              {...formik.getFieldProps(`peripherals[${index}].activo_fijo`)}
              checked={peripheral.activo_fijo}
            />
            <span className="text-text-main font-semibold">
              ¿Es Activo Fijo?
            </span>
          </label>
        </div>
      </div>
    );
  }
);

/**
 * @function CreatePeripheralForm
 * @description Componente principal del modal para crear Periféricos.
 * Se encarga de obtener los datos de catálogo necesarios (tipos de periféricos, centros de operación)
 * y de orquestar el formulario dinámico.
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClose - Callback para cerrar el modal.
 * @param {Function} props.onSuccess - Callback a ejecutar tras una creación exitosa.
 * @returns {JSX.Element}
 */
export default function CreatePeripheralForm({
  onClose,
  onSuccess,
  idRequerimiento = null,
  requiredQuantity = null,
  setCompleted = () => {},
  isNestedForm = false,
}) {
  const { formik, requiredCount, isLoadingCo } = useCreatePeripheralsForm(
    onSuccess,
    idRequerimiento
  );

  const isReqFlow = idRequerimiento !== null;

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
          api.get("/api/centros-operacion"),
        ]);
        setCatalogos({
          tiposPerifericos: tiposRes.data.peripheralTypes || [],
          centrosOperacion: centrosRes.data.operationCenters || [],
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
  }, []);

  const currentCount = formik.values.peripherals.length;
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

  const ModalFixedWrapper = isNestedForm
    ? React.Fragment
    : (props) => (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
          {props.children}
        </div>
      );

  // 2. Contenedor principal del modal (solo si NO está anidado)
  const ModalContentWrapper = isNestedForm
    ? React.Fragment
    : (props) => (
        <div className="bg-secondary rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
          {props.children}
        </div>
      );

  // 3. Encabezado del modal (solo si NO está anidado)
  const ModalHeader = isNestedForm ? null : (
    <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
      <h2 className="text-2xl font-bold text-primary">
        {isReqFlow
          ? `Registro para Requerimiento #${idRequerimiento}`
          : "Registrar Nuevos Periféricos"}
      </h2>
      <button onClick={onClose} className="text-text-main hover:opacity-70">
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </header>
  );

  return (
    <ModalFixedWrapper>
      <ModalContentWrapper>
        {ModalHeader}{" "}
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className={isNestedForm ? "space-y-6" : "p-6"}
          >
            {isNestedForm && (
              <h3 className="text-xl font-bold text-primary mb-6">
                Registro de Periféricos para Requerimiento #{idRequerimiento}
              </h3>
            )}
            <FieldArray name="peripherals">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {isReqFlow && isLoadingCo && (
                    <div
                      className="bg-gray-50 border tex-primary px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Cargando datos:</strong>
                      <span className="block sm:inline ml-2">
                        Obteniendo Centro de Operación y límite de periféricos
                        del Análisis Técnico...
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
                          Debe registrar exactamente {requiredCount}{" "}
                          periférico(s).
                        </span>
                      </div>
                    )}
                  {formik.values.peripherals.map((peripheral, index) => (
                    <PeripheralSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      catalogos={catalogos}
                      isLoadingCatalogs={isLoadingCatalogs}
                      isRemoveDisabled={isRemoveDisabled || isLoadingCo}
                      isReqFlow={isReqFlow}
                    />
                  ))}
                  {shouldShowAddButton && (
                    <button
                      type="button"
                      onClick={() => push(initialPeripheralValues)}
                      className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      disabled={isAddDisabled || isFormDisabled}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Añadir otro periférico
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
      </ModalContentWrapper>
    </ModalFixedWrapper>
  );
}
