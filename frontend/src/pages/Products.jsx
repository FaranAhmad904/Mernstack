
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  ShoppingBag,
  Grid2X2,
  List,
  RotateCcw,
  Star,
} from "lucide-react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.products)
          ? response.data.products
          : [];

        setProducts(data);

        const prices = data.map((p) => Number(p.price) || 0);

        if (prices.length) {
          setMaxPrice(Math.max(200000, ...prices));
        }
      } catch (err) {
        console.error("PRODUCTS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((p) => p.category?.trim())
            .filter(Boolean)
        ),
      ].sort(),
    [products]
  );

  const brands = useMemo(
    () =>
      [
        ...new Set(
          products
            .map((p) => p.brand?.trim())
            .filter(Boolean)
        ),
      ].sort(),
    [products]
  );

  const priceCeiling = useMemo(
    () =>
      Math.max(
        200000,
        ...products.map((p) => Number(p.price) || 0)
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      // Category filter
      if (
        selectedCategory.toLowerCase() !== "all" &&
        product.category?.trim().toLowerCase() !==
          selectedCategory.trim().toLowerCase()
      ) {
        return false;
      }

      // Search filter
      const searchable = [
        product.name,
        product.category,
        product.description,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) {
        return false;
      }

      // Price filter
      const price = Number(product.price) || 0;

      if (price < minPrice || price > maxPrice) {
        return false;
      }

      // Brand filter
      if (
        selectedBrands.length &&
        !selectedBrands.includes(product.brand)
      ) {
        return false;
      }

      // Rating filter
      if (
        minRating &&
        Number(product.rating || 0) < minRating
      ) {
        return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    selectedBrands,
    minRating,
  ]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price || 0) - Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price || 0) - Number(a.price || 0)
        );
        break;

      case "name-asc":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || "")
          )
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(b.name || "").localeCompare(
            String(a.name || "")
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [filteredProducts, sortBy]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-PK");

  const toggleBrand = (brand) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("default");
    setMinPrice(0);
    setMaxPrice(priceCeiling);
    setSelectedBrands([]);
    setMinRating(0);
  };

  return (
    <div className="products-page">
      <Navbar />

      <main className="catalog-shell">
        {/* LEFT FILTER SIDEBAR */}
        <aside className="catalog-sidebar">
          <div className="filter-title">
            <SlidersHorizontal size={17} />
            <h2>Filters</h2>
          </div>

          {/* PRICE RANGE */}
          <section className="filter-section">
            <h3>Price Range</h3>

            <div className="price-inputs">
              <label>
                <span>Min (Rs.)</span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      Math.max(
                        0,
                        Number(e.target.value) || 0
                      )
                    )
                  }
                />
              </label>

              <label>
                <span>Max (Rs.)</span>
                <input
                  type="number"
                  min={minPrice}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      Math.max(
                        minPrice,
                        Number(e.target.value) || 0
                      )
                    )
                  }
                />
              </label>
            </div>

            <input
              className="price-range"
              aria-label="Maximum price"
              type="range"
              min="0"
              max={priceCeiling}
              value={Math.min(maxPrice, priceCeiling)}
              onChange={(e) =>
                setMaxPrice(
                  Math.max(
                    minPrice,
                    Number(e.target.value)
                  )
                )
              }
            />

            <div className="price-caption">
              <span>Rs. {formatPrice(minPrice)}</span>
              <span>Rs. {formatPrice(maxPrice)}</span>
            </div>
          </section>

          {/* CATEGORY FILTER */}
          <section className="filter-section">
            <h3>Category</h3>

            <div className="filter-links">
              <Link
                className={
                  selectedCategory === "All" ? "active" : ""
                }
                to="/products"
              >
                All Products
                <span>{products.length}</span>
              </Link>

              {categories.slice(0, 7).map((category) => (
                <Link
                  key={category}
                  className={
                    selectedCategory.toLowerCase() ===
                    category.toLowerCase()
                      ? "active"
                      : ""
                  }
                  to={`/products?category=${encodeURIComponent(
                    category
                  )}`}
                >
                  {category}

                  <span>
                    {
                      products.filter(
                        (p) => p.category === category
                      ).length
                    }
                  </span>
                </Link>
              ))}

              {categories.length > 7 && (
                <details className="more-filters">
                  <summary>See more</summary>

                  {categories.slice(7).map((category) => (
                    <Link
                      key={category}
                      to={`/products?category=${encodeURIComponent(
                        category
                      )}`}
                    >
                      {category}
                    </Link>
                  ))}
                </details>
              )}
            </div>
          </section>

          {/* BRAND FILTER */}
          {brands.length > 0 && (
            <section className="filter-section">
              <h3>Brands</h3>

              <div className="checkbox-list">
                {brands.map((brand) => (
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />

                    <span>{brand}</span>

                    <small>
                      {
                        products.filter(
                          (p) => p.brand === brand
                        ).length
                      }
                    </small>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* RATING FILTER */}
          <section className="filter-section">
            <h3>Ratings</h3>

            <div className="rating-filters">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className={
                    minRating === rating ? "selected" : ""
                  }
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                  />

                  <span
                    className="rating-stars"
                    aria-label={`${rating} stars`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={
                          i < rating ? "currentColor" : "none"
                        }
                      />
                    ))}
                  </span>

                  <span>{rating} & up</span>
                </label>
              ))}

              {minRating > 0 && (
                <button
                  className="clear-rating"
                  type="button"
                  onClick={() => setMinRating(0)}
                >
                  Clear rating
                </button>
              )}
            </div>
          </section>

          <button
            className="reset-filters"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            Reset filters
          </button>
        </aside>

        {/* MAIN PRODUCTS SECTION */}
        <section className="catalog-main">
          {/* TOP TOOLBAR */}
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />

              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="toolbar-right">
              <span className="result-count">
                Showing {sortedProducts.length ? 1 : 0}–
                {sortedProducts.length} of {products.length} results
              </span>

              <label className="sort-control">
                <span>Sort by:</span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="default">Top Rated</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </label>

              <div className="view-toggle">
                <button
                  type="button"
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid2X2 size={16} />
                </button>

                <button
                  type="button"
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* PAGE TITLE */}
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">SHOPHUB COLLECTION</p>

              <h1>
                {selectedCategory === "All"
                  ? "Discover Products"
                  : selectedCategory}
              </h1>
            </div>

            <span className="mobile-result-count">
              {sortedProducts.length} products
            </span>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="catalog-message">
              <div className="loading-spinner" />
              <h2>Loading products</h2>
              <p>
                Please wait while we load the latest collection.
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="catalog-message error">
              <h2>Unable to load products</h2>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY RESULTS */}
          {!loading &&
            !error &&
            sortedProducts.length === 0 && (
              <div className="catalog-message">
                <Search size={30} />

                <h2>No matching products</h2>

                <p>
                  Try changing your search or filter selections.
                </p>

                <button type="button" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            )}

          {/* PRODUCT GRID */}
          {!loading &&
            !error &&
            sortedProducts.length > 0 && (
              <div
                className={`products-grid ${
                  viewMode === "list" ? "list-view" : ""
                }`}
              >
                {sortedProducts.map((product) => (
                  <article
                    className="shop-product-card"
                    key={product._id}
                  >
                    <Link
                      to={`/products/${product._id}`}
                      className="shop-product-image"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name || "Product"}
                          loading="lazy"
                        />
                      ) : (
                        <div className="shop-no-image">
                          No Image
                        </div>
                      )}

                      <span className="image-category">
                        {product.category || "Product"}
                      </span>
                    </Link>

                    <button
                      className={`favorite-button ${
                        favorites.includes(product._id)
                          ? "is-favorite"
                          : ""
                      }`}
                      type="button"
                      onClick={() => toggleFavorite(product._id)}
                      aria-label={
                        favorites.includes(product._id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={16}
                        fill={
                          favorites.includes(product._id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <div className="shop-product-info">
                      <h2>
                        <Link to={`/products/${product._id}`}>
                          {product.name || "Untitled product"}
                        </Link>
                      </h2>

                      <div className="product-rating">
                        <span className="rating-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={
                                i <
                                Math.round(
                                  Number(product.rating || 0)
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </span>

                        <span>
                          {product.rating
                            ? Number(product.rating).toFixed(1)
                            : "New"}
                        </span>

                        {product.reviewsCount != null && (
                          <small>
                            ({product.reviewsCount} reviews)
                          </small>
                        )}
                      </div>

                      <p className="product-description">
                        {product.description ||
                          "Explore product details and specifications."}
                      </p>

                      <div className="shop-product-bottom">
                        <strong>
                          Rs. {formatPrice(product.price)}
                        </strong>

                        <Link
                          to={`/products/${product._id}`}
                          className="product-action"
                        >
                          <ShoppingBag size={14} />
                          View Product
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default Products;
