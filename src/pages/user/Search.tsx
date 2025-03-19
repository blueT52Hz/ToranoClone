import Loading from "@/components/common/Loading";
import Pagination from "@/components/user/Pagination";
import ProductsSection from "@/components/user/ProductsSection";
import { getPublishedProducts } from "@/services/client/product";
import { Product } from "@/types/product";
import { Divider } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const perpage = 15;
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isLoading, setIsLoading] = useState(false);
  const q = searchParams.get("q") || ""; // Đảm bảo không bị null
  const type = searchParams.get("type") || "";
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const result = await getPublishedProducts();
      setProducts(result);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const removeDiacritics = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = removeDiacritics(q.toLowerCase());

    const filtered = products.filter((product) => {
      const normalizedName = removeDiacritics(product.name.toLowerCase());
      return normalizedName.includes(normalizedQuery);
    });

    return filtered.slice(perpage * (currentPage - 1), perpage * currentPage);
  }, [products, q, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (isLoading) return <Loading />;

  return (
    <div className="container min-w-full px-12">
      <section className="search-section py-7">
        <div className="search-header">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl mb-[10px] font-bold">Tìm kiếm</div>
            <div className="">
              Có <b>{products.length} </b>
              sản phẩm cho tìm kiếm
            </div>
          </div>
        </div>
        <Divider />
        <div className="mb-4 text-lg">
          Kết quả tìm kiếm cho <strong>{q}.</strong>
        </div>
        {filteredProducts.length !== 0 ? (
          <ProductsSection
            columns={5}
            products={filteredProducts}
          ></ProductsSection>
        ) : (
          <div>Không có sản phẩm nào </div>
        )}
        <Pagination
          total={filteredProducts.length}
          currentPage={currentPage}
          perpage={perpage}
        />
      </section>
    </div>
  );
};

export default Search;
