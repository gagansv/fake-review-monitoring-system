export default function Popup({ message, type, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 text-center">
        <h2
          className={`text-xl font-bold mb-3 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>

        <p className="mb-4">{message}</p>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
}
