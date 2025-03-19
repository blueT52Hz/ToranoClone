import { useState, useEffect } from "react";
import { useCart, useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/cart";
import { ShippingAddress } from "@/types/user";
import AddressForm from "@/components/user/AddressForm";
import GuestAddressForm from "@/components/user/GuestAddressForm";
import { v4 } from "uuid";
import { notification } from "antd";
import {
  createOrderByUserId,
  createOrderWithoutUserId,
} from "@/services/client/user/user";

export const Checkout = () => {
  const { user, addresses, getDefaultAddress } = useUser();
  const { cart, clearCart } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressState, setAddressState] = useState(addresses);
  const [paymentMethod, setPaymentMethod] =
    useState<Order["payment_method"]>("cod");
  const [note, setNote] = useState("");
  const [shippingFee] = useState(30000);
  const navigate = useNavigate();
  const createOrder = async (orderData: Partial<Order>) => {
    const cartTotal = cart.cartItems.reduce((total, item) => {
      const price =
        item.variant.product.sale_price ?? item.variant.product.base_price;
      return total + price * item.quantity;
    }, 0);

    const shippingFee = orderData.shipping_fee ?? 30000;
    const discount = orderData.discount ?? 0;
    const finalPrice = cartTotal + shippingFee - discount;

    const newOrder: Order = {
      order_id: v4(),
      created_at: new Date(),
      shippingAddress: orderData.shippingAddress!,
      cart: cart,
      note: orderData.note ?? null,
      payment_method: orderData.payment_method ?? "cod",
      status:
        orderData.payment_method === "online_payment"
          ? "pending_payment"
          : "pending_approval",
      discount: discount,
      shipping_fee: shippingFee,
      final_price: finalPrice,
    };
    if (user) {
      const resultOrder = await createOrderByUserId({
        order_id: newOrder.order_id,
        user_id: user.user_id,
        cart_id: cart.cart_id,
        address_id: newOrder.shippingAddress.address_id,
        status: newOrder.status,
        payment_method: newOrder.payment_method,
        note: newOrder.note,
        discount: newOrder.discount,
        shipping_fee: newOrder.shipping_fee,
        final_price: newOrder.final_price,
      });
      if (resultOrder) clearCart();
    } else if (guestAddress) {
      console.log(guestAddress);

      const resultOrder = await createOrderWithoutUserId(
        cart,
        {
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          note: newOrder.note,
          discount: newOrder.discount,
          shipping_fee: newOrder.shipping_fee,
          final_price: newOrder.final_price,
        },
        guestAddress
      );
      if (resultOrder) clearCart();
    }

    return newOrder;
  };

  const [guestAddress, setGuestAddress] = useState<ShippingAddress | null>(
    null
  );

  const defaultAddress = user ? getDefaultAddress() : null;

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.address_id);
    }
  }, [defaultAddress, selectedAddressId]);

  useEffect(() => {
    setAddressState(addresses);
  }, [user]);

  const subtotal = cart.cartItems.reduce((total, item) => {
    const price =
      item.variant.product.sale_price ?? item.variant.product.base_price;
    return total + price * item.quantity;
  }, 0);

  const totalAmount = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddressClick = (addressId: string) => {
    setSelectedAddressId(addressId);
    setGuestAddress(null);
  };

  const handleAddressSaved = (address: ShippingAddress) => {
    setSelectedAddressId(address.address_id);
    setIsAddingAddress(false);
  };

  const handleGuestAddressSaved = (address: ShippingAddress) => {
    setGuestAddress(address);
    setSelectedAddressId("");
  };

  const handlePlaceOrder = () => {
    if (!user && !guestAddress) {
      notification.info({
        message: "Vui lòng nhập địa chỉ giao hàng",
        placement: "topRight",
      });
      return;
    }

    if (user && !selectedAddressId && !guestAddress) {
      notification.info({
        message: "Vui lòng chọn địa chỉ giao hàng",
        placement: "topRight",
      });
      return;
    }

    let shippingAddress: ShippingAddress;

    if (guestAddress) {
      shippingAddress = guestAddress;
    } else {
      const selectedAddress = addresses.find(
        (addr) => addr.address_id === selectedAddressId
      );

      if (!selectedAddress) {
        notification.error({
          message: "Địa chỉ không hợp lệ",
          placement: "topRight",
        });
        return;
      }

      shippingAddress = selectedAddress;
    }

    if (cart.cartItems.length === 0) {
      notification.error({
        message: "Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng",
        placement: "topRight",
      });
      return;
    }

    try {
      const orderData = {
        shippingAddress: shippingAddress,
        payment_method: paymentMethod,
        note: note || null,
        shipping_fee: shippingFee,
      };

      console.log(orderData);

      const createdOrder = createOrder(orderData);

      if (paymentMethod === "online_payment") {
        navigate("/payment", { state: { orderData: createdOrder } });
      } else {
        notification.success({
          message: "Đặt hàng thành công!",
          placement: "topRight",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      notification.error({
        message: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.",
        placement: "topRight",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>

          {user ? (
            isAddingAddress ? (
              <AddressForm
                onClose={() => setIsAddingAddress(false)}
                onAddressAdded={handleAddressSaved}
                setAddressState={setAddressState}
              />
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {addAddressState.length > 0 ? (
                    addAddressState.map((address) => (
                      <div
                        key={address.address_id}
                        className={`border p-4 rounded-md cursor-pointer ${
                          selectedAddressId === address.address_id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAddressClick(address.address_id)}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.address_id}
                            onChange={() =>
                              handleAddressClick(address.address_id)
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {address.full_name}
                              </span>
                              <span className="text-gray-600">
                                {address.phone_number}
                              </span>
                              {address.is_default && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.address_detail}, {address.ward},{" "}
                              {address.district}, {address.city},{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
                >
                  + Thêm địa chỉ mới
                </button>
              </>
            )
          ) : (
            <GuestAddressForm onAddressSaved={handleGuestAddressSaved} />
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

          <div className="space-y-3">
            <div
              className={`border p-3 rounded-md cursor-pointer ${
                paymentMethod === "cod"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-600">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </p>
                </div>
              </div>
            </div>

            {/* <div
              className={`border p-3 rounded-md cursor-pointer ${
                paymentMethod === "bank_transfer"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("bank_transfer")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="h-4 w-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua chuyển khoản ngân hàng
                  </p>
                </div>
              </div>
            </div> */}

            <div
              className={`border p-3 rounded-md cursor-pointer ${
                paymentMethod === "online_payment"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("online_payment")}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "online_payment"}
                  onChange={() => setPaymentMethod("online_payment")}
                  className="h-4 w-4 text-blue-600"
                />
                <div>
                  <p className="font-medium">Thanh toán online</p>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua ví điện tử, thẻ ngân hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Ghi chú</h2>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-12">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

          {cart.cartItems.length > 0 ? (
            <div className="divide-y">
              <div className="pb-4 space-y-4">
                {cart.cartItems.map((item) => (
                  <div key={item.cart_item_id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.variant.image.image_url}
                        alt={item.variant.image.image_name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">
                        {item.variant.product.name}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <span>Màu: {item.variant.color.color_name}, </span>
                        <span>Kích thước: {item.variant.size.size_code}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>x{item.quantity}</span>
                        <span className="font-medium">
                          {formatPrice(
                            (item.variant.product.sale_price ??
                              item.variant.product.base_price) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tính tiền */}
              <div className="py-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Giỏ hàng trống</div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={
              cart.cartItems.length === 0 ||
              (user && !selectedAddressId && !guestAddress) ||
              (!user && !guestAddress)
            }
            className={`w-full mt-6 py-3 rounded-md ${
              cart.cartItems.length === 0 ||
              (user && !selectedAddressId && !guestAddress) ||
              (!user && !guestAddress)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium transition-colors`}
          >
            Đặt hàng
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Bằng việc đặt hàng, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-600">
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};
