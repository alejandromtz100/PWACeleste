import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">Bienvenido 🎉</h1>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
