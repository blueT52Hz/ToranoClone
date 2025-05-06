import React from "react";
import useFetch from "@/hooks/useFetch";
import OptimizedImage from "@/components/common/OptimizedImage";

const Test = () => {
  const { data, isLoading, error } = useFetch<any>(
    "http://localhost:8080/api/v1/product/sach-lap-trinh-nodejs-7"
  );

  console.log(data);

  return (
    <div>
      <OptimizedImage src="your-image-url" alt="description" />
    </div>
  );
};

export default Test;
