import { products } from '../lib/products';

export async function getStaticProps() {
  return {
    props: {
      products
    }
  };
}

export default function ProductsPage({ products }) {
  return (
    <div>
      <h1>Our Menu</h1>
      <div className="product-grid">
        {products.map((product) => (
          <a key={product.id} href={`/${product.id}`}>
            <div className="product-card">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>${product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}