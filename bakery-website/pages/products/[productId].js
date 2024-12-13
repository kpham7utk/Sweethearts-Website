import { products } from '../lib/products';

export async function getStaticPaths() {
  const paths = products.map((product) => ({
    params: { productId: product.id }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => p.id === params.productId);
  return { props: { product } };
}

export default function ProductDetail({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} style={{ maxWidth: '300px' }} />
      <p>{product.description}</p>
      <p><strong>${product.price}</strong></p>
      <button>Add to Cart</button>
    </div>
  );
}