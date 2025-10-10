import React, { useEffect, useState } from "react";
import {
  useCreateUserForm,
  initialUserValues,
} from "../../hooks/users/useCreateUserForm.js";
import { FormikProvider, FieldArray, getIn } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../../config/axios.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

// --- Subcomponente para cada fila del formulario dinámico ---
const UserSubForm = ({
  formik,
  index,
  onRemove,
  catalogos,
  isLoadingCatalogs,
}) => {
  const user = formik.values.users[index];

  const getError = (fieldName) => {
    const error = getIn(formik.errors, `users[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `users[${index}].${fieldName}`);
    return touched && error ? error : null;
  };

  const [inputType, Icon, toggleVisibility] = usePasswordToggle();
  const [inputTypeConfirm, IconConfirm, toggleVisibilityConfirm] =
    usePasswordToggle();

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="bg-background/50 p-6 rounded-lg shadow-inner relative border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-primary">
          Nuevo Usuario #{index + 1}
        </h3>
        {formik.values.users.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error"
            title="Eliminar este usuario"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* --- Fila 1: Datos Personales --- */}
        <label className="block">
          <span className="text-text-main font-semibold">Nombre:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].nombre`)}
          />
          {getError("nombre") && (
            <div className="text-error text-sm mt-1">{getError("nombre")}</div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Apellido:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].apellido`)}
          />
          {getError("apellido") && (
            <div className="text-error text-sm mt-1">
              {getError("apellido")}
            </div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Correo:</span>
          <input
            type="email"
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].correo`)}
          />
          {getError("correo") && (
            <div className="text-error text-sm mt-1">{getError("correo")}</div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Tipo ID:</span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].id_tipo_identificacion`)}
            disabled={isLoadingCatalogs}
          >
            <option value="">
              {isLoadingCatalogs ? "Cargando..." : "Selecciona..."}
            </option>
            {catalogos.tiposIdentificacion.map((t) => (
              <option
                key={t.id_tipo_identificacion}
                value={t.id_tipo_identificacion}
              >
                {t.tipo_identificacion}
              </option>
            ))}
          </select>
          {getError("id_tipo_identificacion") && (
            <div className="text-error text-sm mt-1">
              {getError("id_tipo_identificacion")}
            </div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Identificación:</span>
          <input
            type="text"
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].identificacion`)}
          />
          {getError("identificacion") && (
            <div className="text-error text-sm mt-1">
              {getError("identificacion")}
            </div>
          )}
        </label>
        <label className="block">
          <span className="text-text-main font-semibold">Teléfono:</span>
          <input
            type="tel"
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].telefono`)}
          />
          {getError("telefono") && (
            <div className="text-error text-sm mt-1">
              {getError("telefono")}
            </div>
          )}
        </label>

        {/* --- Fila 2: Credenciales y Asignación --- */}
        <div className="relative">
          <label className="block">
            <span className="text-text-main font-semibold">Contraseña:</span>
            <input
              type={inputType}
              className={`${inputClasses} pr-10`}
              {...formik.getFieldProps(`users[${index}].password`)}
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-0 top-9 flex items-center pr-3 text-gray-500"
            >
              <FontAwesomeIcon icon={Icon} />
            </button>
            {getError("password") && (
              <div className="text-error text-sm mt-1">
                {getError("password")}
              </div>
            )}
          </label>
        </div>
        <div className="relative">
          <label className="block">
            <span className="text-text-main font-semibold">
              Confirmar Contraseña:
            </span>
            <input
              type={inputTypeConfirm}
              className={`${inputClasses} pr-10`}
              {...formik.getFieldProps(`users[${index}].confirmPassword`)}
            />
            <button
              type="button"
              onClick={toggleVisibilityConfirm}
              className="absolute right-0 top-9 flex items-center pr-3 text-gray-500"
            >
              <FontAwesomeIcon icon={IconConfirm} />
            </button>
            {getError("confirmPassword") && (
              <div className="text-error text-sm mt-1">
                {getError("confirmPassword")}
              </div>
            )}
          </label>
        </div>
        <label className="block">
          <span className="text-text-main font-semibold">Rol:</span>
          <select
            className={inputClasses}
            {...formik.getFieldProps(`users[${index}].rol`)}
          >
            <option value="Encargado">Encargado</option>
            <option value="Admin">Admin</option>
          </select>
          {getError("rol") && (
            <div className="text-error text-sm mt-1">{getError("rol")}</div>
          )}
        </label>

        {/* Campo Condicional */}
        {user.rol === "Encargado" && (
          <label className="block animate-fade-in md:col-span-3">
            <span className="text-text-main font-semibold">
              Centro de Operación Asignado:
            </span>
            <select
              className={inputClasses}
              {...formik.getFieldProps(`users[${index}].id_centro_operacion`)}
              disabled={isLoadingCatalogs}
            >
              <option value="">
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
          </label>
        )}
      </div>
    </div>
  );
};

// --- Componente Principal (Modal) ---
export default function CreateUserForm({ onClose, onSuccess }) {
  const formik = useCreateUserForm(onSuccess);

  const [catalogos, setCatalogos] = useState({
    tiposIdentificacion: [],
    centrosOperacion: [],
  });
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [tiposIdRes, centrosOpRes] = await Promise.all([
          api.get("/api/catalogo/tipos-identificacion"),
          api.get("/api/catalogo/centros-operacion"),
        ]);
        setCatalogos({
          tiposIdentificacion: tiposIdRes.data,
          centrosOperacion: centrosOpRes.data,
        });
      } catch (error) {
        formik.setFieldError(
          "apiError",
          "Error al cargar datos para el formulario."
        );
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
            Crear Nuevos Usuarios
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            <FieldArray name="users">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.users.map((user, index) => (
                    <UserSubForm
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
                    onClick={() => push(initialUserValues)}
                    className="flex items-center gap-2 py-2 px-4 bg-accent-secondary text-text-light font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro usuario
                  </button>
                </div>
              )}
            </FieldArray>

            <hr className="my-8 border-gray-300" />

            <footer className="flex flex-col sm:flex-row justify-end items-center gap-4">
              {formik.errors.apiError && (
                <div
                  className="text-error text-sm mr-auto font-semibold"
                  role="alert"
                >
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
                  : `Guardar ${formik.values.users.length} Usuario(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
