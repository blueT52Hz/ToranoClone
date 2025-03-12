import { useState } from "react";
import { Order } from "@/types/cart";
import { OrderTable } from "@/components/admin/orders/OrderTable";

const Orders = () => {
  const mockOrders: Order[] = Array.from({ length: 45 }, (_, index) => ({
    order_id: `ORD${String(index + 1).padStart(5, "0")}`,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    shippingAddress: {
      address_id: `ADDR${index + 1}`,
      full_name: `Khách hàng ${index + 1}`,
      phone_number: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `Số ${Math.floor(Math.random() * 200) + 1}, Đường ${Math.floor(Math.random() * 100) + 1}`,
      city: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"][
        Math.floor(Math.random() * 5)
      ],
      district: `Quận ${Math.floor(Math.random() * 12) + 1}`,
      ward: `Phường ${Math.floor(Math.random() * 20) + 1}`,
      is_default: Math.random() > 0.8,
      created_at: new Date(),
      updated_at: new Date(),
    },
    cart: {
      cart_id: `CART${index + 1}`,
      cartItems: [],
      cart_total_price: Math.floor(100000 + Math.random() * 900000),
    },
    note: Math.random() > 0.7 ? `Ghi chú cho đơn hàng ${index + 1}` : null,
    payment_method: ["cod", "online_payment", "bank_transfer"][
      Math.floor(Math.random() * 3)
    ] as any,
    status: ["pending_approval", "shipping", "completed", "canceled"][
      Math.floor(Math.random() * 4)
    ] as any,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 100000) : null,
    shipping_fee: 30000,
    final_price: Math.floor(150000 + Math.random() * 1500000),
  }));

  return <OrderTable orders={mockOrders} />;
};

export default Orders;
