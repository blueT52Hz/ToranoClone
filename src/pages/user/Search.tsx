import Pagination from "@/components/user/Pagination";
import ProductsSection from "@/components/user/ProductsSection";
import { Product } from "@/types/product";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q");
  const type = searchParams.get("type");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="container min-w-full px-12">
      <section className="search-section py-7">
        <div className="search-header">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl mb-[10px] font-bold">Tìm kiếm</div>
            <div className="">
              Có <b>{"53"} </b>
              sản phẩm cho tìm kiếm
            </div>
          </div>
        </div>
        <Divider />
        <div className="mb-4 text-lg">
          Kết quả tìm kiếm cho <strong>{q}.</strong>
        </div>
        {products.length !== 0 ? (
          <ProductsSection columns={5} products={products}></ProductsSection>
        ) : (
          <div>Không có sản phẩm nào </div>
        )}
        <Pagination totalPages={10} currentPage={currentPage} />
      </section>
    </div>
  );
};

export default Search;
