import React from "react";

/**
 * @function LoginFormSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del LoginForm.
 * Se muestra mientras el componente principal se carga de forma perezosa (lazy loading).
 * @returns {JSX.Element}
 */
export default function LoginFormSkeleton() {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-background p-4 animate-pulse">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-sm border-2 border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div className="mt-6 h-12 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
}
