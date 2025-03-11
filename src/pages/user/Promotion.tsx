import { Link } from "react-router-dom";

export default function PromotionPage() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <section className="he-thong-cua-hang">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">
          Mua sắm thả ga - Nhận ưu đãi hết ý!!!
        </h1>
        <p className="mt-2">
          Chương trình ưu đãi cực hấp dẫn, chưa từng có dành riêng cho quý khách
          hàng mua sắm <strong>trực tiếp</strong> tại hệ thống cửa hàng của{" "}
          <strong>TORANO</strong>. Sau khi xuất hóa đơn, quý khách được nhận
          ngay 1 voucher tới 30% cho lần mua sắm tiếp theo.
        </p>
        <div className="mt-4">
          <h2 className="font-bold">
            Với mỗi hóa đơn mua sắm từ ngày{" "}
            <span className="text-black">15 - 27/01/2025</span>:
          </h2>
          <ul className="list-disc list-inside mt-2">
            <li>
              Có giá trị từ 1.200.000đ trở lên, Quý khách nhận ngay 1 Voucher
              giảm giá độc quyền 20%
            </li>
            <li>
              Có giá trị từ 1.700.000đ trở lên, Quý khách nhận ngay 1 Voucher
              giảm giá độc quyền 30%
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <img
            src="https://file.hstatic.net/200000690725/file/7016_e787c8cdf3b1b34977220ce4b58ec257_8733cd6d628c43199916316faad69722_grande.jpg"
            alt="Gift Voucher"
            className="w-full rounded-lg"
          />
        </div>
        <div className="mt-6">
          <h2 className="font-bold">Điều kiện sử dụng Voucher:</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Áp dụng cho 1 sản phẩm nguyên giá bất kỳ</li>
            <li>
              Thời gian áp dụng voucher tới ngày <strong>16/02/2025</strong>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <p>
            Còn chần chờ gì nữa, đến <strong>TORANO</strong> gần nhất để tha hồ
            mua sắm và rinh voucher ngay thôi nào!
          </p>
          <Link
            to="/pages/he-thong-cua-hang"
            className="text-blue-600 font-semibold flex items-center mt-2"
          >
            <span role="img" aria-label="store">
              👉
            </span>{" "}
            Hệ thống cửa hàng Torano
          </Link>
        </div>
      </div>
    </section>
  );
}
