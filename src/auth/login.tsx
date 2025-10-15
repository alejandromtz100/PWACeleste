import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { savePendingLogin } from "../db"; // ✅ conexión a IndexedDB

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setLoading(false);
      return setError("Todos los campos son obligatorios");
    }

    try {
      // Intentar login normalmente
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error de conexión");

      // ✅ Si fue exitoso
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/inicio");
    } catch (err: any) {
      console.warn("💾 Guardando intento de login offline...");
      // ✅ Guardar datos offline
      await savePendingLogin({ data: form });

      // ✅ Registrar sincronización al volver el internet
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync?.register("sync-logins");
        console.log("🔔 Sincronización 'sync-logins' registrada");
      }

      setError("Sin conexión — se intentará iniciar sesión cuando vuelvas a estar online");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-md">
          Bienvenido de nuevo
        </h2>

        {error && (
          <p className="bg-red-500/80 text-white p-2 rounded-lg mb-3 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 
          text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 border border-white/30 
          text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
          text-white py-3 rounded-lg font-semibold text-lg shadow-lg 
          hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <p className="mt-4 text-sm text-center text-white/80">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-pink-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
