"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart, UserPlus, X, ChevronRight } from "lucide-react";
import api from "../../services/api";
import PropTypes from "prop-types";
import Select from "react-select";
import Sidebar from "../../components/layout/Sidebar";

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-GB").replaceAll("/", "-");
};

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    height: "42px",
    border: "none",
    boxShadow: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    cursor: "text",
    width: "100%",
  }),
  valueContainer: (base) => ({
    ...base,
    height: "42px",
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#111827",
    fontSize: "14px",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "42px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#4B5563",
    padding: "0 8px",
    "&:hover": { color: "#111827" },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6B7280",
    fontSize: "14px",
    fontWeight: "400",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
    fontWeight: "600",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    border: "1px solid #9CA3AF",
    overflow: "hidden",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563EB"
      : state.isFocused
      ? "#F3F4F6"
      : "white",
    color: state.isSelected ? "white" : "#1F2937",
    fontSize: "14px",
    padding: "10px 14px",
    cursor: "pointer",
  }),
};

const CustomerField = ({ value, onChange, customers }) => {
  const options = customers.map((c) => ({
    value: c.identifier,
    label: c.name ?? c.identifier,
  }));

  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <div className="flex-1 min-w-[240px]">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
        Customer
      </label>
      <div className="flex items-center bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-2 shadow-sm">
        <Select
          options={options}
          value={selectedOption}
          onChange={(opt) => onChange(opt?.value || "")}
          placeholder="Search customer…"
          className="flex-1 text-sm"
          styles={customSelectStyles}
        />
      </div>
    </div>
  );
};

const CartTable = ({ entries, onQtyChange, onRemove }) => (
  <div className="w-full space-y-4 mb-6">
    {entries.length === 0 ? (
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <ShoppingCart size={22} className="text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">Cart is empty</p>
          <p className="text-sm text-gray-500 font-medium">Select a product on the left to add items</p>
        </div>
      </div>
    ) : (
      entries.map((entry, i) => (
        <div key={entry.identifier ?? i} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:border-gray-300 p-5 relative transition-all">
          
          {/* Header Area of Vertical Row */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
            <div>
              <h4 className="text-base font-black text-gray-900">{entry.productIdentifier}</h4>
              <p className="text-xs font-mono font-bold text-gray-400 mt-0.5">SKU: {entry.identifier}</p>
            </div>
            <button
              onClick={() => onRemove(i)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all shadow-xs"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Core Structured Price Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
            
            {/* MRP Pricing */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">MRP</span>
              <span className="text-sm text-gray-400 line-through font-medium">
                {currency(entry.quantity > 0 ? entry.originalPrice / entry.quantity : 0)}
              </span>
            </div>

            {/* Sale Selling Price */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sale Price</span>
              <span className="text-sm text-gray-900 font-bold">{currency(entry.unitPrice)}</span>
            </div>

            {/* Qty Counter Picker */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</span>
              <div className="inline-flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-300 shadow-xs">
                <button
                  onClick={() => {
                    const newQty = entry.quantity - 1;
                    if (newQty >= 1) onQtyChange(i, newQty);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-950 active:scale-95 transition-all text-base font-bold border border-gray-200"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-900">{entry.quantity}</span>
                <button
                  onClick={() => onQtyChange(i, entry.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-950 active:scale-95 transition-all text-base font-bold border border-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total MRP Field Restored */}
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total MRP</span>
              <span className="text-sm text-gray-700 font-semibold">{currency(entry.originalPrice)}</span>
            </div>

            {/* Subtotal block column */}
            <div className="text-right sm:text-left">
              <span className="block text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Subtotal</span>
              <span className="text-base font-black text-blue-700">{currency(entry.totalPrice)}</span>
            </div>

          </div>
        </div>
      ))
    )}
  </div>
);

const CartTotals = ({ cart }) => (
  <div className="flex justify-end">
    <div className="w-full bg-white rounded-2xl border-2 border-gray-200 shadow-md p-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200">
        Order Summary
      </h3>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-semibold">Original Price</span>
        <span className="text-gray-900 font-bold">{currency(cart?.totalOriginalPrice)}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-semibold">Discount</span>
        <span className="text-emerald-600 font-bold">− {currency(cart?.totalDiscount)}</span>
      </div>
      <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
        <span className="text-base font-bold text-gray-900">Total Payable</span>
        <span className="text-xl font-black text-blue-700 tracking-tight">
          {currency(cart?.totalPrice)}
        </span>
      </div>
    </div>
  </div>
);

const CartPage = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [cartData, setCartData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phoneNo: "",
    email: "",
    creditLimit: 0,
  });

  const getHeaders = () => {
    const token = globalThis.localStorage?.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    api
      .post("/product/list", { page: 0, sizePerPage: 500 }, { headers: getHeaders() })
      .then((res) => setProducts(res.data.dtoList ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    api
      .post("/customer/list", { page: 0, sizePerPage: 500 }, { headers: getHeaders() })
      .then((res) => setCustomers(res.data.dtoList ?? []))
      .catch(console.error);
  }, []);

  const fetchCart = async (customerId) => {
    if (!customerId) {
      setCartData(null);
      setEntries([]);
      return;
    }
    try {
      const cartRes = await api.get(`/cart/get?identifier=${customerId}`, { headers: getHeaders() });
      setCartData(cartRes.data);
      const entriesRes = await api.post("/cartEntry/list", { page: 0, sizePerPage: 500 }, { headers: getHeaders() });
      const allEntries = entriesRes.data ?? [];
      const customerEntries = allEntries.filter((entry) => entry.cartIdentifier === customerId);
      setEntries(customerEntries);
    } catch (err) {
      console.error(err);
      setCartData(null);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchCart(customer);
  }, [customer]);

  const handleAddProduct = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      console.log("Selected Customer:", customer);
      console.log("Payload:", { productIdentifier: selectedProduct, cartIdentifier: customer, quantity: 1 });
      await api.post("/cartEntry/add", { productIdentifier: selectedProduct, cartIdentifier: customer, quantity: 1 }, { headers: getHeaders() });
      setSelectedProduct("");
      await fetchCart(customer);
      showMessage("Item added successfully");
    } catch {
      showMessage("Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleQtyChange = async (index, qty) => {
    const entry = entries[index];
    if (!qty || Number(qty) < 1) return;
    try {
      await api.post("/cartEntry/update", { ...entry, quantity: Number(qty) }, { headers: getHeaders() });
      await fetchCart(customer);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (index) => {
    const entry = entries[index];
    try {
      await api.post(`/cartEntry/delete?identifier=${entry.identifier}`, {}, { headers: getHeaders() });
      await fetchCart(customer);
      showMessage("Item removed");
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClearCart = async () => {
    if (!customer) return;
    if (!confirm("Are you sure you want to clear the cart?")) return;
    try {
      await api.post("/cart/delete", { identifier: customer }, { headers: getHeaders() });
      setEntries([]);
      setCartData(null);
      showMessage("Cart cleared successfully");
    } catch (err) {
      console.error(err);
      showMessage("Failed to clear cart");
    }
  };

  const handleCustomerSave = async () => {
    try {
      if (!newCustomer.name.trim()) { showMessage("Customer name required"); return; }
      if (!/^[6-9]\d{9}$/.test(newCustomer.phoneNo)) { showMessage("Enter valid phone number"); return; }
      const exists = customers.some((c) => c.phoneNo === newCustomer.phoneNo);
      if (exists) { showMessage("Phone number already exists"); return; }
      
      const res = await api.post("/customer/add", {
        name: newCustomer.name,
        phoneNo: newCustomer.phoneNo,
        email: newCustomer.email,
        creditLimit: Number(newCustomer.creditLimit),
        balance: 0,
        balanceType: "CR",
        partyType: "CUSTOMER",
        billingAddress: {},
        shippingAddress: {},
      }, { headers: getHeaders() });

      const added = res.data;
      setCustomers((prev) => [...prev, added]);
      setCustomer(added.identifier);
      setShowCustomerPopup(false);
      setNewCustomer({ name: "", phoneNo: "", email: "", creditLimit: 0 });
      showMessage("Customer Added");
    } catch (err) {
      console.error(err);
      showMessage("Save Failed");
    }
  };

  const productOptions = products.map((p) => ({
    value: p.identifier,
    label: p.productName ?? p.identifier,
  }));
  const selectedProductOption = productOptions.find((o) => o.value === selectedProduct) || null;

  return (
    <Sidebar>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <ShoppingCart size={19} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">Cart</h1>
                <p className="text-xs font-bold text-gray-500 mt-0.5">{today()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span>Home</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-700">Cart</span>
            </div>
          </div>

          {/* Pop-up Notification Toast */}
          {message && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-2xl z-[10000] flex items-center gap-3 border border-gray-700 tracking-wide animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {message}
            </div>
          )}

          {/* First Row — Customer Selection, Customer ID, & Details */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 mb-6">
            <div className="flex flex-wrap gap-5 items-end">
              <CustomerField value={customer} onChange={setCustomer} customers={customers} />

              <button
                onClick={() => setShowCustomerPopup(true)}
                className="flex items-center justify-center gap-2 h-[44px] px-5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 hover:text-blue-700 border-2 border-blue-200 active:scale-98 transition-all shadow-xs"
              >
                <UserPlus size={16} />
                New Customer
              </button>

              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Customer ID
                </label>
                <div className="h-[44px] flex items-center px-4 bg-gray-50 border-2 border-gray-300 rounded-xl text-sm text-gray-900 font-mono font-bold shadow-inner">
                  {customer || <span className="text-gray-400">—</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Product & Vertical Cart Table Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
            
            {/* Left Side: Product Selector */}
            <div className="lg:col-span-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 lg:sticky lg:top-6">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Add Product to Order
              </label>
              <div className="space-y-4">
                <div className="w-full flex items-center bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-2 shadow-sm">
                  <Select
                    options={productOptions}
                    value={selectedProductOption}
                    onChange={(opt) => setSelectedProduct(opt?.value || "")}
                    placeholder="Search product..."
                    className="flex-1 text-sm"
                    styles={customSelectStyles}
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  disabled={!selectedProduct || saving}
                  className="w-full flex items-center justify-center gap-2 h-[44px] px-6 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
                >
                  <Plus size={16} className="stroke-[3]" />
                  Add Item to Cart
                </button>
              </div>
            </div>

            {/* Right Side: Vertical Item Cards + Totals Calculation */}
            <div className="lg:col-span-8 flex flex-col">
              <CartTable entries={entries} onQtyChange={handleQtyChange} onRemove={handleRemove} />
              <CartTotals cart={cartData} />
            </div>

          </div>

          {/* Footer Navigation Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/home")}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors py-2"
            >
              ← Back to Home Dashboard
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={handleClearCart}
                disabled={!customer || entries.length === 0}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl border-2 border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 hover:border-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Clear Cart
              </button>
              <button
                onClick={() => showMessage("Cart saved")}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-98"
              >
                Save Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Overlay Modal Panel */}
      {showCustomerPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-[99999] p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all">
            <div className="flex items-center justify-between px-6 py-4.5 border-b-2 border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <UserPlus size={16} className="text-blue-600" />
                </div>
                <h2 className="text-base font-black text-gray-900">Create New Customer</h2>
              </div>
              <button
                onClick={() => setShowCustomerPopup(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-all border border-transparent hover:border-gray-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Ravi Kumar", type: "text" },
                { label: "Phone Number", key: "phoneNo", placeholder: "10-digit mobile number", type: "tel" },
                { label: "Email Address", key: "email", placeholder: "customer@email.com", type: "email" },
                { label: "Credit Limit (₹)", key: "creditLimit", placeholder: "0.00", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={newCustomer[key]}
                    onChange={(e) => setNewCustomer({ ...newCustomer, [key]: e.target.value })}
                    className="w-full h-11 px-4 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all shadow-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4.5 bg-gray-50 border-t-2 border-gray-200">
              <button
                onClick={() => setShowCustomerPopup(false)}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-300 text-sm font-bold text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomerSave}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-98"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

CustomerField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
};

CartTable.propTypes = {
  entries: PropTypes.array.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

CartTotals.propTypes = {
  cart: PropTypes.shape({
    totalOriginalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalDiscount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default CartPage;