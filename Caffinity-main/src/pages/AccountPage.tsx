import React, { useState, useEffect } from "react";
import { User, ShoppingBag, MapPin, LogOut, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import type { Order, Address } from "../types";
import toast from "react-hot-toast";

type Tab = "dashboard" | "orders" | "profile" | "addresses";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { user, logout, loading: authLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (authLoading)
    return <div className="text-center py-20">Loading account...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab profile={user} />;
      case "orders":
        return <OrdersTab />;
      case "profile":
        return <ProfileTab profile={user} />;
      case "addresses":
        return <AddressesTab userId={user._id} />;
      default:
        return null;
    }
  };

  const NavItem = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: Tab;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === tab
        ? "bg-brand-gray-light text-brand-black font-semibold"
        : "hover:bg-brand-gray-light text-brand-black/70"
        }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <title>Caffinity - {user.firstName} Account</title>

      <div className="bg-brand-gray-light min-h-[calc(100vh-12rem)]">
        <div className="container mx-auto px-6 py-12">
          <h1 className="font-heading text-4xl mb-8">My Account</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-fit">
              <nav className="space-y-2">
                <NavItem tab="dashboard" icon={User} label="Dashboard" />
                <NavItem tab="orders" icon={ShoppingBag} label="Orders" />
                <NavItem tab="profile" icon={User} label="Profile Details" />
                <NavItem tab="addresses" icon={MapPin} label="Addresses" />
                <button
                  onClick={() => {
                    const conf = window.confirm(
                      "Are you sure you want to logout?"
                    );
                    if (!conf) return;
                    logout().then(() => navigate("/"))
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition-colors hover:bg-brand-gray-light text-brand-black/70"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </aside>
            <main className="md:col-span-3 bg-white p-8 rounded-lg shadow-sm">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------- Tabs ----------------

const DashboardTab = ({ profile }: { profile: any }) => (
  <div>
    <h2 className="font-heading text-2xl mb-4">Hello, {profile.firstName}!</h2>
    <p className="text-brand-black/70">
      From your account dashboard you can view your recent orders, manage your
      shipping addresses, and edit your account details.
    </p>
  </div>
);

const OrdersTab = () => {
  const { orders: contextOrders } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextOrders) {
      const sortedOrders = [...contextOrders].sort((a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    }
    setLoading(false);
  }, [contextOrders]);

  if (loading) return <div>Loading order history...</div>;
  if (orders.length === 0) return (
    <div>
      <h2 className="font-heading text-2xl mb-6">Order History</h2>
      <p className="text-brand-black/70">You have no past orders.</p>
    </div>
  );

  return (
    <div>
      <h2 className="font-heading text-2xl mb-6">Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-brand-gray rounded-md p-4"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h3 className="font-semibold">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</h3>
                <p className="text-sm text-brand-black/70">
                  Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="font-semibold">
                  {order.currency === 'usd' ? '$' : '€'}
                  {order.totalPrice.toFixed(2)}
                </p>
                <p className="text-sm capitalize text-brand-black/70">
                  <span className={`font-medium text-brand-black rounded-full px-3 py-1 ${order.orderStatus === 'processing' ? 'bg-brand-yellow/15 text-brand-yellow' : 'bg-brand-green/15 text-brand-green'}`}>{order.orderStatus}</span>
                  <span className="mx-2">|</span> Payment: <span className="font-medium text-brand-black">{order.paymentStatus}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-md bg-brand-gray-light flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-brand-gray-dark">No img</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-brand-black/70">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {order.currency === 'usd' ? '$' : '€'}{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileTab = ({ profile }: { profile: any }) => {
  const { updateProfile, deleteAccount } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
  });

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by context toaster
    }
  };

  const handleDelete = async () => {
    const conf = window.confirm("Are you absolutely sure you want to permanently delete your account? This action cannot be undone.");
    if (!conf) return;

    setIsDeleting(true);
    try {
      const deleted = await deleteAccount();
      if (deleted) {
        navigate("/");
      }
    } catch (error) {
      // Error handled by context toaster
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="font-heading text-2xl">Profile Details</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`w-full px-4 py-3 border border-brand-gray rounded-md ${isEditing ? "bg-white" : "bg-brand-gray-light"
                }`}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`w-full px-4 py-3 border border-brand-gray rounded-md ${isEditing ? "bg-white" : "bg-brand-gray-light"
                }`}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            className="w-full px-4 py-3 border border-brand-gray rounded-md bg-brand-gray-light"
            readOnly
          />
          <p className="text-xs text-brand-black/60 mt-1">Email cannot be changed</p>
        </div>
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
            <Button type="button" onClick={handleCancel} variant="outline" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </form>

      <div className="mt-12 pt-8 border-t border-brand-gray/50">
        <h3 className="font-heading text-xl text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-brand-black/70 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={isDeleting}
          className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  );
};

const AddressesTab = ({ userId }: { userId: string }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const loadAddresses = () => {
    const allAddresses = JSON.parse(localStorage.getItem("all_addresses") || "[]");
    const userAddresses = allAddresses.filter((addr: Address) => addr.userId === userId);
    setAddresses(userAddresses);
  };

  const handleSave = () => {
    if (!formData.label || !formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.country || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const allAddresses = JSON.parse(localStorage.getItem("all_addresses") || "[]");

    if (editingId) {
      // Update existing address
      const updatedAddresses = allAddresses.map((addr: Address) =>
        addr.id === editingId ? { ...formData, id: editingId, userId } : addr
      );
      localStorage.setItem("all_addresses", JSON.stringify(updatedAddresses));
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const newAddress: Address = {
        ...formData as Address,
        id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
      };

      // If this is the first address or set as default, make it default
      if (addresses.length === 0 || formData.isDefault) {
        const updatedAddresses = allAddresses.map((addr: Address) =>
          addr.userId === userId ? { ...addr, isDefault: false } : addr
        );
        updatedAddresses.push({ ...newAddress, isDefault: true });
        localStorage.setItem("all_addresses", JSON.stringify(updatedAddresses));
      } else {
        allAddresses.push(newAddress);
        localStorage.setItem("all_addresses", JSON.stringify(allAddresses));
      }
      toast.success("Address added successfully");
    }

    resetForm();
    loadAddresses();
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAdding(true);
  };

  const handleDelete = (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    const allAddresses = JSON.parse(localStorage.getItem("all_addresses") || "[]");
    const updatedAddresses = allAddresses.filter((addr: Address) => addr.id !== addressId);
    localStorage.setItem("all_addresses", JSON.stringify(updatedAddresses));
    toast.success("Address deleted successfully");
    loadAddresses();
  };

  const handleSetDefault = (addressId: string) => {
    const allAddresses = JSON.parse(localStorage.getItem("all_addresses") || "[]");
    const updatedAddresses = allAddresses.map((addr: Address) => ({
      ...addr,
      isDefault: addr.id === addressId && addr.userId === userId,
    }));
    localStorage.setItem("all_addresses", JSON.stringify(updatedAddresses));
    toast.success("Default address updated");
    loadAddresses();
  };

  const resetForm = () => {
    setFormData({
      label: "",
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl">My Addresses</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        )}
      </div>

      {isAdding ? (
        <div className="border border-brand-gray rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-1">
                Label (e.g., Home, Work) *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
                placeholder="Home"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-brand-gray rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-brand-black">Set as default address</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {editingId ? "Update Address" : "Save Address"}
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {addresses.length === 0 && !isAdding ? (
          <p className="text-brand-black/70">No addresses saved yet.</p>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${address.isDefault ? "border-brand-black bg-brand-gray-light/30" : "border-brand-gray"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{address.label}</h3>
                    {address.isDefault && (
                      <span className="text-xs bg-brand-black text-white px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-brand-black">{address.fullName}</p>
                  <p className="text-sm text-brand-black/70">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-brand-black/70">
                    {address.city}, {address.state && `${address.state}, `}{address.postalCode}
                  </p>
                  <p className="text-sm text-brand-black/70">{address.country}</p>
                  <p className="text-sm text-brand-black/70">Phone: {address.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 hover:bg-brand-gray-light rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-brand-black/70" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-sm text-brand-black/70 hover:text-brand-black mt-3"
                >
                  Set as default
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountPage;
