"use client";

import { Store, AlertCircle } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "../actions";

const initialState = {
  error: "",
};

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 absolute inset-0 z-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Store className="w-12 h-12 text-slate-900 mb-4" />
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          CMS Administrator
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          <form className="space-y-6" action={formAction}>
            
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off" // Woz Fix: Disables browser autofill suggestions
                  required
                  className="block w-full h-11 appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password" // Woz Fix: 'new-password' is the strongest deterrent against aggressive browser password managers on login fields
                  required
                  className="block w-full h-11 appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full h-11 justify-center items-center rounded-md border border-transparent bg-slate-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Authenticating..." : "Secure Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}