"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PackageIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
  CloseIcon,
  CheckIcon,
} from "@/components/ui/Icons";

interface Variant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
}

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  sku: string;
  category: { id: string; name: string };
  collection?: { id: string; name: string } | null;
  images: Array<{ url: string }>;
  variants: Variant[];
  totalStock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // New Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    salePrice: "",
    sku: "",
    categoryId: "",
    fabricDetails: "",
    careInstructions: "",
    fitInfo: "",
    imageUrl: "",
    variants: [
      { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
      { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 20 },
      { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
    ],
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = search
        ? `/api/admin/products?search=${encodeURIComponent(search)}`
        : "/api/admin/products";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Products error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Fetch categories for the dropdown
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories[0]) {
            setNewProduct((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleAdjustStock = async (variantId: string, delta: number) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stockDelta: delta, reason: delta > 0 ? "RESTOCK" : "DAMAGE_ADJUSTMENT" }),
      });
      if (res.ok) fetchProducts();
    } catch (e) {
      console.error("Stock adjustment error:", e);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you certain you wish to permanently excise "${name}" from the catalog?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setFormError(data.error || "Failed to register product");
      }
    } catch {
      setFormError("Network error creating product");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/20 gap-4">
        <div>
          <span className="text-label text-gold text-xs tracking-[0.25em] uppercase block mb-1">
            Inventory & Catalog
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl text-ivory font-medium">
            Garment Vault & Stock Ledger
          </h1>
          <p className="text-xs text-ivory/60 mt-1 font-light">
            Review live inventory counts, regulate variant stock levels, and register new apparel silhouettes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gold text-noir text-xs uppercase tracking-[0.15em] font-semibold hover:bg-gold-light transition-all shadow-md self-start sm:self-auto inline-flex items-center gap-2"
        >
          <PlusIcon size={14} />
          Register New Silhouette
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
            placeholder="Search garment by name or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-noir border border-border/40 text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
          />
          <SearchIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40"
          />
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-noir border border-border/40 text-xs uppercase tracking-wider text-ivory/80 hover:text-gold hover:border-gold transition-colors"
        >
          Search
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-ivory/50 uppercase tracking-widest">
          Consulting Catalog Ledger...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center border border-border/20 bg-noir-light/30">
          <p className="text-xs text-ivory/50">No garments match the current query criteria.</p>
        </div>
      ) : (
        <div className="border border-border/20 bg-noir-light/30 overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory/80">
            <thead className="bg-noir border-b border-border/20 text-[10px] uppercase tracking-wider text-ivory/50">
              <tr>
                <th className="py-3 px-4">Silhouette</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Appraisal Price</th>
                <th className="py-3 px-4">Variant Inventory Regulation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {products.map((p) => {
                const img =
                  p.images[0]?.url ||
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800";

                return (
                  <tr key={p.id} className="hover:bg-noir-light/50 transition-colors">
                    {/* Silhouette name & photo */}
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="relative w-12 h-16 flex-shrink-0 bg-noir border border-border/40 overflow-hidden">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="font-serif text-sm text-ivory hover:text-gold transition-colors font-medium block"
                        >
                          {p.name}
                        </Link>
                        <span className="font-mono text-[10px] text-ivory/40">
                          SKU: {p.sku}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-[11px] text-gold/90 font-medium uppercase tracking-wider">
                      {p.category?.name || "General"}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-mono">
                      {p.salePrice ? (
                        <>
                          <span className="text-burgundy font-semibold block">
                            ₹{p.salePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-ivory/40 line-through text-[10px]">
                            ₹{p.basePrice.toLocaleString("en-IN")}
                          </span>
                        </>
                      ) : (
                        <span>₹{p.basePrice.toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* Variant Inventory Pills */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.variants.map((v) => (
                          <div
                            key={v.id}
                            className={`p-1.5 border text-[11px] flex items-center gap-2 rounded-sm ${
                              v.stock <= 5
                                ? "border-amber-500/60 bg-amber-950/20 text-amber-300"
                                : "border-border/40 bg-noir text-ivory"
                            }`}
                          >
                            <span className="font-mono font-medium">{v.size}</span>
                            <span className="text-[10px] text-ivory/60">({v.colorName})</span>
                            <span className="font-mono font-bold">{v.stock}</span>

                            <div className="flex items-center gap-1 border-l border-border/40 pl-1.5 ml-1">
                              <button
                                onClick={() => handleAdjustStock(v.id, -1)}
                                className="px-1 text-ivory/60 hover:text-ivory"
                                title="Reduce stock (-1)"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleAdjustStock(v.id, 5)}
                                className="px-1 text-gold hover:text-gold-light"
                                title="Add stock (+5)"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="text-ivory/40 hover:text-red-400 p-1 transition-colors"
                        title="Excise product"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Register New Silhouette Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-border/40 max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-ivory/50 hover:text-ivory"
            >
              <CloseIcon size={18} />
            </button>

            <span className="text-label text-gold text-[10px] tracking-[0.25em] uppercase block mb-1">
              Atelier Catalog
            </span>
            <h2 className="heading-display text-2xl text-ivory mb-6 font-medium">
              Register New Luxury Silhouette
            </h2>

            {formError && (
              <div className="p-3 mb-4 bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setNewProduct({ ...newProduct, name, slug });
                    }}
                    placeholder="e.g. Sovereign Velvet Opera Cape"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Unique Route Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    placeholder="sovereign-velvet-opera-cape"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                  Atelier Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Architectural cut, fabric hand, draping characteristics..."
                  className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                    placeholder="18500"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Sale Price (Optional ₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.salePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                    placeholder="15000"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Category Hierarchy *
                  </label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                  High-Resolution Photography URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Fabric Provenance
                  </label>
                  <input
                    type="text"
                    value={newProduct.fabricDetails}
                    onChange={(e) => setNewProduct({ ...newProduct, fabricDetails: e.target.value })}
                    placeholder="100% Grade 6A Mulberry Silk, 25 Momme"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                    Tailored Fit Notes
                  </label>
                  <input
                    type="text"
                    value={newProduct.fitInfo}
                    onChange={(e) => setNewProduct({ ...newProduct, fitInfo: e.target.value })}
                    placeholder="Sculpted drop shoulder, true to size"
                    className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 uppercase tracking-wider text-ivory/50 hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-gold text-noir uppercase tracking-[0.15em] font-semibold hover:bg-gold-light transition-all disabled:opacity-50"
                >
                  {formSubmitting ? "Transcribing..." : "Mint Silhouette"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
