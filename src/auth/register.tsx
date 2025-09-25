import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password === form.confirm && form.email) {
      localStorage.setItem("user", JSON.stringify(form));
      navigate("/"); // después de registrarse vuelve al login
    } else {
      alert("Las contraseñas no coinciden o faltan datos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded-lg"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 border rounded-lg"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Registrarse
        </button>
        <p className="mt-3 text-sm text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
