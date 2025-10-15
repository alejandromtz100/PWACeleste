import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.username || !form.password) {
      setLoading(false);
      return setError("Todos los campos son obligatorios");
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setLoading(false);
      return setError("Correo electrónico no válido");
    }
    if (form.password.length < 6) {
      setLoading(false);
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al registrar usuario");

      // Guardamos token y datos en localStorage
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/inicio");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-md">
          Crear Cuenta
        </h2>

        {error && (
          <p className="bg-red-500/80 text-white p-2 rounded-lg mb-3 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="mt-4 text-sm text-center text-white/80">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-green-400 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
