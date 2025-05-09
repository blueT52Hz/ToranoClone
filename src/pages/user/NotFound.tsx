import { Button } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mb-8 text-2xl font-medium text-gray-600">
        Không tìm thấy trang
      </h2>
      <p className="mb-8 text-gray-500">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
      </p>
      <Link to="/">
        <Button type="primary" size="large">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
