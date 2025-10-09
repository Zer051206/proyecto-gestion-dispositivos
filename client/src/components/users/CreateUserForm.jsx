import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserForm } from "../../hooks/users/useCreateUserForm.js";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useCatalogs } from "../../hooks/catalogue/useCatalogs.js";
import {
  handleKeyTextDown,
  handleKeyNumberDown,
} from "../../utils/inputUtilities.js";

export default function CreateUserForm() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [inputType, Icon, toggleVisibility] = usePasswordToggle();
  const [InputTypeConfirm, IconConfirm, toggleVisibilityConfirm] =
    usePasswordToggle();

  const { tiposIdentificacion, centrosOperacion, isLoadingCatalogs } =
    useCatalogs();

  const { formik, successMessage, handleClearForm } = useCreateUserForm();

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-gray-300 p-2 outline-none bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200";

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background p-4">
      <div className="w-full max-w-4xl">
        <form
          className="bg-secondary p-8 rounded-lg shadow-xl w-full"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-text-main">
            Crear Nuevo Usuario
          </h2>
          <fieldset className="p-4 rounded-md mb-6 border border-gray-300">
            <legend className="px-4 text-lg font-semibold text-primary">
              Información Personal
            </legend>
            {/* Grid responsivo: 1 columna en móvil, 2 en pantallas medianas y superiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nombre */}
              <label className="block">
                <span className="text-text-main font-semibold">Nombre:</span>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyDown={handleKeyNumberDown}
                  className={inputClasses}
                  {...formik.getFieldProps("nombre")}
                />
                {formik.touched.nombre && formik.errors.nombre ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.nombre}
                  </div>
                ) : null}
              </label>

              {/* Apellido */}
              <label className="block">
                <span className="text-text-main font-semibold">Apellido:</span>
                <input
                  type="text"
                  autoComplete="off"
                  onKeyDown={handleKeyNumberDown}
                  className={inputClasses}
                  {...formik.getFieldProps("apellido")}
                />
                {formik.touched.apellido && formik.errors.apellido ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.apellido}
                  </div>
                ) : null}
              </label>

              {/* Tipo de Identificación */}
              <label className="block">
                <span className="text-text-main font-semibold">
                  Tipo de Identificación:
                </span>
                <select
                  className={inputClasses}
                  {...formik.getFieldProps("id_tipo_identificacion")}
                  disabled={isLoadingCatalogs}
                >
                  <option value="">
                    {isLoadingCatalogs
                      ? "Cargando..."
                      : "Selecciona una opción..."}
                  </option>
                  {tiposIdentificacion.map((tipo) => (
                    <option
                      key={tipo.id_tipo_identificacion}
                      value={tipo.id_tipo_identificacion}
                    >
                      {tipo.tipo_identificacion}
                    </option>
                  ))}
                </select>
                {formik.touched.id_tipo_identificacion &&
                formik.errors.id_tipo_identificacion ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.id_tipo_identificacion}
                  </div>
                ) : null}
              </label>

              {/* Identificación */}
              <label className="block">
                <span className="text-text-main font-semibold">
                  Identificación:
                </span>
                <input
                  type="text"
                  onKeyDown={handleKeyNumberDown}
                  autoComplete="off"
                  className={inputClasses}
                  {...formik.getFieldProps("identificacion")}
                />
                {formik.touched.identificacion &&
                formik.errors.identificacion ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.identificacion}
                  </div>
                ) : null}
              </label>

              {/* Teléfono - Ocupa el ancho completo en pantallas grandes */}
              <label className="block md:col-span-2">
                <span className="text-text-main font-semibold">Teléfono:</span>
                <input
                  type="number"
                  autoComplete="off"
                  onKeyDown={handleKeyNumberDown}
                  className={`${inputClasses} md:justify-items-center`}
                  {...formik.getFieldProps("telefono")}
                />
                {formik.touched.telefono && formik.errors.telefono ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.telefono}
                  </div>
                ) : null}
              </label>
            </div>
          </fieldset>
          {/* --- DATOS DE LA CUENTA Y ASIGNACIÓN --- */}
          <fieldset className="p-4 rounded-md mb-6 border border-gray-300">
            <legend className="px-4 text-lg font-semibold text-primary">
              Credenciales y Asignación
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Correo Electrónico */}
              <label className="block md:col-span-2">
                <span className="text-text-main font-semibold">
                  Correo electrónico:
                </span>
                <input
                  type="email"
                  autoComplete="off"
                  className={`${inputClasses} md:justify-items-center`}
                  {...formik.getFieldProps("correo")}
                />
                {formik.touched.correo && formik.errors.correo ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.correo}
                  </div>
                ) : null}
              </label>

              {/* Contraseña */}
              <div className="relative">
                <label className="block">
                  <span className="text-text-main font-semibold">
                    Contraseña:
                  </span>
                  <input
                    type={inputType}
                    autoComplete="off"
                    className={`${inputClasses} pr-10`}
                    {...formik.getFieldProps("password")}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute right-0 top-[42px] flex items-center pr-3 text-gray-500 outline-none"
                  >
                    <Icon />
                  </button>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </label>
              </div>

              {/* Confirmar Contraseña */}
              <div className="relative">
                <label className="block">
                  <span className="text-text-main font-semibold">
                    Confirmar Contraseña:
                  </span>
                  <input
                    type={InputTypeConfirm}
                    className={`${inputClasses} pr-10`}
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibilityConfirm}
                    className="absolute right-0 top-[42px] flex items-center pr-3 text-gray-500 outline-none"
                  >
                    <IconConfirm />
                  </button>
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </div>
                  ) : null}
                </label>
              </div>

              {/* Rol */}
              <label className="block">
                <span className="text-text-main font-semibold">
                  Rol del Usuario:
                </span>
                <select
                  className={inputClasses}
                  {...formik.getFieldProps("rol")}
                >
                  <option value="Encargado">Encargado</option>
                  <option value="Admin">Admin</option>
                </select>
                {formik.touched.rol && formik.errors.rol ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.rol}
                  </div>
                ) : null}
              </label>

              {/* Centro de Operación */}
              <label className="block">
                <span className="text-text-main font-semibold">
                  Centro de Operación:
                </span>
                <select
                  className={inputClasses}
                  {...formik.getFieldProps("id_centro_operacion")}
                  disabled={isLoadingCatalogs}
                >
                  <option value="">
                    {isLoadingCatalogs
                      ? "Cargando..."
                      : "Selecciona un centro..."}
                  </option>
                  {centrosOperacion.map((centro) => (
                    <option
                      key={centro.id_centro_operacion}
                      value={centro.id_centro_operacion}
                    >
                      {centro.codigo} - {centro.direccion}
                    </option>
                  ))}
                </select>
                {formik.touched.id_centro_operacion &&
                formik.errors.id_centro_operacion ? (
                  <div className="text-error text-sm mt-1">
                    {formik.errors.id_centro_operacion}
                  </div>
                ) : null}
              </label>
            </div>
          </fieldset>

          {/* Muestra de mensaje de éxito o error de API */}
          {formik.errors.apiError && (
            <div
              className="mt-4 text-center p-3 bg-accent/10 border border-accent text-accent rounded-md"
              role="alert"
            >
              {formik.errors.apiError}
            </div>
          )}
          {successMessage && (
            <div
              className="mt-4 text-center p-3 bg-success/10 border border-success text-success rounded-md"
              role="alert"
            >
              {successMessage}
            </div>
          )}

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClearForm}
              disabled={formik.isSubmitting || isLoadingCatalogs}
              className="mt-6 w-full bg-accent text-text-light font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:bg-accent/50 disabled:cursor-not-allowed"
            >
              Limpiar formulario
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || isLoadingCatalogs}
              className="mt-6 w-full bg-primary text-text-light font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Creando Usuario..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
