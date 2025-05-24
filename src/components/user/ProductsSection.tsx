import ProductCard from "@/components/user/Product/ProductCard";
import { Product } from "@/types/product.type";

interface ProductsSectionProp {
  columns: number;
  products: Product[];
  gap?: number;
}

const ProductsSection = (props: ProductsSectionProp) => {
  const { gap, columns, products } = props;
  return (
    <section className="ProductsSection w-full">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap || 15}px`,
        }}
      >
        {products.map((product, index) => {
          return <ProductCard key={index} item={product} />;
        })}
      </div>
    </section>
  );
};

export default ProductsSection;
