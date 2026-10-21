
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import ManagePage from "./pages/ManagePage";

const API_URL =
  "https://reyes-inf239-act-3-5-connected.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("gallery");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        setProducts(await response.json());
      } catch (error) {
        console.error("Could not connect to the server:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const saveProduct = async (data) => {
    const isEditing = Boolean(editingProduct);

    const url = isEditing
      ? `${API_URL}/api/products/${editingProduct._id}`
      : `${API_URL}/api/products`;

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Could not save product");
    }

    const savedProduct = await response.json();

    setProducts((prev) =>
      isEditing
        ? prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
        : [savedProduct, ...prev]
    );

    setEditingProduct(null);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Could not delete the product. Please try again.");
      return;
    }

    setProducts((prev) => prev.filter((p) => p._id !== id));

    if (editingProduct?._id === id) {
      setEditingProduct(null);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar view={view} onChangeView={setView} />

      {view === "gallery" ? (
        <GalleryPage products={products} loading={loading} />
      ) : (
        <ManagePage
          products={products}
          editingProduct={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
          onEdit={startEdit}
          onDelete={deleteProduct}
        />
      )}

      <footer className="py-10 text-center text-sm text-slate-400">
        Made by Jayce Rafael D. Reyes · INF239
      </footer>
    </div>
  );
}

export default App;
