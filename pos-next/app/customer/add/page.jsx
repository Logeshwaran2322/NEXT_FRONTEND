"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";

import api from "../../../services/api";
import CustomerForm, {
  customerInitialData,
} from "../../../components/customer/CustomerForm";

export default function CustomerAddPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState(customerInitialData);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Customer Details
    if (!formData.name?.trim()) {
      newErrors.name =
        "Customer name is required";
    }

    if (!formData.phoneNo?.trim()) {
      newErrors.phoneNo =
        "Phone number is required";
    } else if (
      !/^[0-9]{10}$/.test(
        formData.phoneNo
      )
    ) {
      newErrors.phoneNo =
        "Enter valid 10 digit phone number";
    }

    if (!formData.email?.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter valid email";
    }

    if (!formData.partyType?.trim()) {
      newErrors.partyType =
        "Party type is required";
    }

    if (
      formData.creditLimit &&
      Number(formData.creditLimit) < 0
    ) {
      newErrors.creditLimit =
        "Credit limit cannot be negative";
    }

    if (
      formData.balance &&
      isNaN(
        Number(formData.balance)
      )
    ) {
      newErrors.balance =
        "Balance must be numeric";
    }

    if (
      !formData.balanceType?.trim()
    ) {
      newErrors.balanceType =
        "Balance type required";
    }

    // Billing Address
    if (
      !formData.billingAddress
        ?.addressLine?.trim()
    ) {
      newErrors.billingAddressLine =
        "Billing address required";
    }

    if (
      !formData.billingAddress
        ?.city?.trim()
    ) {
      newErrors.billingCity =
        "Billing city required";
    }

    if (
      !formData.billingAddress
        ?.state?.trim()
    ) {
      newErrors.billingState =
        "Billing state required";
    }

    if (
      !formData.billingAddress
        ?.zip?.trim()
    ) {
      newErrors.billingZip =
        "Billing ZIP required";
    }

    if (
      !formData.billingAddress
        ?.country?.trim()
    ) {
      newErrors.billingCountry =
        "Billing country required";
    }

    // Shipping Address
    if (
      !formData.shippingAddress
        ?.addressLine?.trim()
    ) {
      newErrors.shippingAddressLine =
        "Shipping address required";
    }

    if (
      !formData.shippingAddress
        ?.city?.trim()
    ) {
      newErrors.shippingCity =
        "Shipping city required";
    }

    if (
      !formData.shippingAddress
        ?.state?.trim()
    ) {
      newErrors.shippingState =
        "Shipping state required";
    }

    if (
      !formData.shippingAddress
        ?.zip?.trim()
    ) {
      newErrors.shippingZip =
        "Shipping ZIP required";
    }

    if (
      !formData.shippingAddress
        ?.country?.trim()
    ) {
      newErrors.shippingCountry =
        "Shipping country required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        creditLimit:
          Number(
            formData.creditLimit
          ) || 0,

        balance:
          Number(
            formData.balance
          ) || 0,
      };

      const response =
        await api.post(
          "/customer/add",
          payload
        );

      if (
        response.data?.success ===
        false
      ) {
        alert(
          response.data.message
        );
        return;
      }

      alert(
        "Customer added successfully"
      );

      setFormData(
        customerInitialData
      );

      router.push(
        "/customer"
      );
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Unable to save customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="min-h-screen bg-[#f4f6fb] py-10 px-4 flex justify-center items-start">
        {/* Adjusted page wrapper to 800px max width for an optimized, professional footprint */}
        <div className="w-full max-w-[800px] bg-white rounded-xl shadow-md border border-slate-100 p-8">

          <h1 className="text-2xl font-bold mb-8 text-blue-600 tracking-wide">
            Add Customer
          </h1>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >
            {/* The child sub-inputs inside CustomerForm will now automatically scale cleanly within this optimized parent */}
            <CustomerForm
              formData={
                formData
              }
              handleChange={
                handleChange
              }
              errors={
                errors
              }
            />

            {/* Separator Line to clean up section breaks */}
            <hr className="border-slate-100 my-4" />

            {/* Action buttons resized to a balanced, user-friendly max width */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">

              <button
                type="submit"
                disabled={
                  loading
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm transition-colors text-sm disabled:opacity-70 text-center"
              >
                {loading
                  ? "Saving..."
                  : "Save Customer"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.back()
                }
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium px-6 py-2.5 rounded-md transition-colors text-sm text-center"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>
    </Sidebar>
  );
}