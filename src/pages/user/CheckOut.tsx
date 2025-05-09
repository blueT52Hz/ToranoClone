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

const sendOrderWebhook = async (orderData: any, user: any) => {
  try {
    const response = await fetch(
      "https://workflow.proptit.com/webhook/order-sucess",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          fullName: user?.full_name,
          orderId: orderData.order_id,
          totalAmount: orderData.final_price,
          paymentMethod: orderData.payment_method,
          shippingAddress: orderData.shippingAddress,
          items: orderData.cart.cartItems.map((item: any) => ({
            productName: item.variant.product.name,
            quantity: item.quantity,
            price:
              item.variant.product.sale_price ??
              item.variant.product.base_price,
          })),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send order webhook notification");
    }
  } catch (error) {
    console.error("Error sending order webhook notification:", error);
  }
};

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
        guestAddress,
      );
      if (resultOrder) clearCart();
    }

    return newOrder;
  };

  const [guestAddress, setGuestAddress] = useState<ShippingAddress | null>(
    null,
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

  const handlePlaceOrder = async () => {
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
        (addr) => addr.address_id === selectedAddressId,
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

      if (paymentMethod === "online_payment") {
        navigate("/payment", { state: { orderData: orderData, guestAddress } });
      } else {
        const createdOrder = await createOrder(orderData);

        // Gửi webhook notification nếu người dùng đã đăng nhập
        if (user) {
          await sendOrderWebhook(createdOrder, user);
        }

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
    <div className="my-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Địa chỉ giao hàng</h2>

          {user ? (
            isAddingAddress ? (
              <AddressForm
                onClose={() => setIsAddingAddress(false)}
                onAddressAdded={handleAddressSaved}
                setAddressState={setAddressState}
              />
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  {addAddressState.length > 0 ? (
                    addAddressState.map((address) => (
                      <div
                        key={address.address_id}
                        className={`cursor-pointer rounded-md border p-4 ${
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
                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {address.address_detail}, {address.ward},{" "}
                              {address.district}, {address.city},{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
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
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h2>

          <div className="space-y-3">
            <div
              className={`cursor-pointer rounded-md border p-3 ${
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
              className={`cursor-pointer rounded-md border p-3 ${
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
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Ghi chú</h2>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-12 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Đơn hàng của bạn</h2>

          {cart.cartItems.length > 0 ? (
            <div className="divide-y">
              <div className="space-y-4 pb-4">
                {cart.cartItems.map((item) => (
                  <div key={item.cart_item_id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.variant.image.image_url}
                        alt={item.variant.image.image_name}
                        className="h-full w-full rounded object-cover"
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
                      <div className="mt-1 flex justify-between">
                        <span>x{item.quantity}</span>
                        <span className="font-medium">
                          {formatPrice(
                            (item.variant.product.sale_price ??
                              item.variant.product.base_price) * item.quantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tính tiền */}
              <div className="space-y-2 py-4">
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
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">Giỏ hàng trống</div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={
              cart.cartItems.length === 0 ||
              (user && !selectedAddressId && !guestAddress) ||
              (!user && !guestAddress)
            }
            className={`mt-6 w-full rounded-md py-3 ${
              cart.cartItems.length === 0 ||
              (user && !selectedAddressId && !guestAddress) ||
              (!user && !guestAddress)
                ? "cursor-not-allowed bg-gray-300"
                : "bg-blue-600 hover:bg-blue-700"
            } font-medium text-white transition-colors`}
          >
            Đặt hàng
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
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
