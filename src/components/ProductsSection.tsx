import ProductCard from "@/components/Product/ProductCard";
import { Product } from "@/types/product";

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
          return (
            <ProductCard
              key={index}
              perPage={0}
              currentSlide={0}
              item={product}
              isDragging={false}
            ></ProductCard>
          );
        })}
      </div>
    </section>
  );
};

export default ProductsSection;
