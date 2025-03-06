import ProductCard from "@/components/Product/ProductCard";
import React from "react";

interface Product {
  name: string;
  slug: string;
  first_img: string;
  second_img: string;
  color: string[];
  size: ("S" | "M" | "L" | "XL")[];
  original_price: number;
  sale_price: number;
  discount: number;
}

interface ProductsSectionProp {
  columns: number;
  products: Product[];
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
