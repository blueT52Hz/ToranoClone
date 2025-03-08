import ProductCard from "@/components/Product/ProductCard";
import { Product, ProductPreview } from "@/types/product";
import React from "react";

interface ProductsSectionProp {
  columns: number;
  products: ProductPreview[];
}

const ProductsSection = (props: ProductsSectionProp) => {
  const { columns, products } = props;
  return (
    <section className="ProductsSection">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "16px",
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
