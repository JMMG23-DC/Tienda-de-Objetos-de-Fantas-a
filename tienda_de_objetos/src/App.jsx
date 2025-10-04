

import { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar.jsx';
import FeaturedCategories from './FeaturedCategories.jsx';
import BestSellers from './BestSellers.jsx';
import NewCategories from './NewCategories.jsx';
import NewProducts from './NewProducts.jsx';
import Banner from './Banner.jsx';

import Cart from './Cart.jsx';
import Footer from './Footer.jsx';
import SearchResults from './SearchResults.jsx';
import ProductDetail from './ProductDetail.jsx';


function App() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="landing-page">
      <header>
        <SearchBar onSearch={setSearch} />
      </header>
      {selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : search ? (
        <SearchResults search={search} onSelect={setSelectedProduct} />
      ) : (
        <>
          <Banner />
          <div id="categorias">
            <FeaturedCategories />
          </div>
          <div id="mas-vendidos">
            <BestSellers />
          </div>
          <section className="bottom-section" id="nuevos">
            <NewCategories />
            <NewProducts />
          </section>
        </>
      )}
      <div id="carrito">
        <Cart />
      </div>
      <Footer />
    </div>
  );
}

export default App
