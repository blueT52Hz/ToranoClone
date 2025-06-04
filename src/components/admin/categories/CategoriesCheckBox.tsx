import { categoryApi } from "@/apis/admin/category.api";
import { CategoryProduct } from "@/types/category.type";
import { ProductForm, ProductDetailAdmin } from "@/types/product.type";
import { useQuery } from "@tanstack/react-query";
import { UseFormSetValue } from "node_modules/react-hook-form/dist/types";
import { useEffect, useState } from "react";

interface CategoriesCheckBoxProps {
  product: ProductDetailAdmin | null;
  setValue: UseFormSetValue<ProductForm>;
}

export const CategoriesCheckBox = ({
  product,
  setValue,
}: CategoriesCheckBoxProps) => {
  const [categories, setCategories] = useState<CategoryProduct[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryProduct[]
  >([]);
  const { data: categoriesData } = useQuery({
    queryKey: ["categoriesForProduct"],
    queryFn: () => categoryApi.getCategoriesForProduct(),
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.data.data);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (product) {
      setSelectedCategories(
        categories.filter((c) => product.category_ids.includes(c.category_id)),
      );
    }
  }, [product, categories]);

  const handleCategoryChange = (category: CategoryProduct) => {
    const newSelectedCategories = selectedCategories.some(
      (c) => c.category_id === category.category_id,
    )
      ? selectedCategories.filter((c) => c.category_id !== category.category_id)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    setValue(
      "category_ids",
      newSelectedCategories.map((c) => c.category_id),
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Danh mục sản phẩm</h2>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.category_id} className="flex items-center">
              <input
                type="checkbox"
                id={category.category_id}
                name="categories"
                value={category.category_id}
                checked={selectedCategories.some(
                  (c) => c.category_id === category.category_id,
                )}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label
                htmlFor={category.category_id}
                className="ml-2 text-sm text-gray-700"
              >
                {category.category_name}
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Chưa có danh mục nào</p>
        )}
      </div>
    </div>
  );
};
