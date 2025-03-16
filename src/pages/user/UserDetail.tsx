import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoTab from "@/components/user/UserInfoTab";
import UserAddressTab from "@/components/user/UserAddressTab";
import { supabase } from "@/services/supabaseClient";
import { ShippingAddress, User } from "@/types/user";
import Loading from "@/components/common/Loading";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "address">("info");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user and addresses
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Fetch user info
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (userError) throw userError;

      // Fetch addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from("shipping_address")
        .select("*")
        .eq("user_id", userId);

      if (addressesError) throw addressesError;

      setUser(userData);
      setAddresses(addressesData || []);

      setIsLoading(false);
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "info"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "address"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Địa chỉ
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && <UserInfoTab user={user} />}
        {activeTab === "address" && userId && (
          <UserAddressTab
            addresses={addresses}
            userId={userId}
            onAddressesUpdated={(updatedAddresses) =>
              setAddresses(updatedAddresses)
            }
          />
        )}
      </div>
    </div>
  );
}
