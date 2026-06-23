"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import api from "../../../services/api";
import Sidebar from "../../../components/layout/Sidebar";

import CustomerForm, {
  customerInitialData,
} from "../../../components/customer/CustomerForm";

export default function CustomerUpdatePage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const identifier =
    searchParams.get(
      "identifier"
    ) || "";

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [errors,
    setErrors] =
    useState({});

  const [formData,
    setFormData] =
    useState(
      customerInitialData
    );

  useEffect(() => {
    if (identifier) {
      loadCustomer();
    }
  }, [identifier]);

  const loadCustomer =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            `/customer/get?identifier=${identifier}`
          );

        setFormData({
          ...customerInitialData,
          ...response.data,
        });

      } catch (error) {
        console.log(error);

        alert(
          "Unable to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]:
            value,
        })
      );
    };

  const validate = () => {
    const validation = {};

    if (!formData.name?.trim()) {
      validation.name =
        "Customer name required";
    }

    if (!formData.phoneNo?.trim()) {
      validation.phoneNo =
        "Phone required";
    } else if (
      !/^[0-9]{10}$/.test(
        formData.phoneNo
      )
    ) {
      validation.phoneNo =
        "Enter valid 10 digit phone number";
    }

    if (!formData.email?.trim()) {
      validation.email =
        "Email required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      validation.email =
        "Enter valid email";
    }

    if (!formData.partyType?.trim()) {
      validation.partyType =
        "Party type required";
    }

    if (
      formData.creditLimit &&
      Number(
        formData.creditLimit
      ) < 0
    ) {
      validation.creditLimit =
        "Credit limit cannot be negative";
    }

    if (
      isNaN(
        Number(
          formData.balance
        )
      )
    ) {
      validation.balance =
        "Balance must be numeric";
    }

    // Billing
    if (
      !formData.billingAddress
        ?.addressLine
    ) {
      validation.billingAddressLine =
        "Billing address required";
    }

    if (
      !formData.billingAddress
        ?.city
    ) {
      validation.billingCity =
        "Billing city required";
    }

    if (
      !formData.billingAddress
        ?.state
    ) {
      validation.billingState =
        "Billing state required";
    }

    if (
      !formData.billingAddress
        ?.zip
    ) {
      validation.billingZip =
        "Billing ZIP required";
    }

    if (
      !formData.billingAddress
        ?.country
    ) {
      validation.billingCountry =
        "Billing country required";
    }

    // Shipping
    if (
      !formData.shippingAddress
        ?.addressLine
    ) {
      validation.shippingAddressLine =
        "Shipping address required";
    }

    if (
      !formData.shippingAddress
        ?.city
    ) {
      validation.shippingCity =
        "Shipping city required";
    }

    if (
      !formData.shippingAddress
        ?.state
    ) {
      validation.shippingState =
        "Shipping state required";
    }

    if (
      !formData.shippingAddress
        ?.zip
    ) {
      validation.shippingZip =
        "Shipping ZIP required";
    }

    if (
      !formData.shippingAddress
        ?.country
    ) {
      validation.shippingCountry =
        "Shipping country required";
    }

    setErrors(
      validation
    );

    return (
      Object.keys(
        validation
      ).length === 0
    );
  };

  const updateCustomer =
    async (e) => {
      e.preventDefault();

      if (
        !validate()
      )
        return;

      try {
        setSaving(
          true
        );

        await api.post(
          "/customer/update",
          {
            ...formData,
            identifier,
            creditLimit:
              Number(
                formData.creditLimit
              ) || 0,
            balance:
              Number(
                formData.balance
              ) || 0,
          }
        );

        alert(
          "Customer updated successfully"
        );

        router.push(
          "/customer"
        );

      } catch (error) {
        console.log(error);

        alert(
          "Update failed"
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  return (
    <Sidebar>
      <div className="min-h-screen bg-[#f4f6fb] py-10 px-4 flex justify-center items-start">
        {/* Confined container to 800px max width to stop it from occupying the whole screen */}
        <div className="w-full max-w-[800px] bg-white rounded-xl shadow-md border border-slate-100 p-8">

          {/* Clean header centered with the layout */}
          <h1 className="text-2xl font-bold mb-8 text-blue-600 tracking-wide">
            Update Customer
          </h1>

          <form
            onSubmit={
              updateCustomer
            }
            className="space-y-6"
          >

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

            {/* Separator line for aesthetic clarity before actions */}
            <hr className="border-slate-100 my-4" />

            {/* Combined, tightly bounded actions block sitting side-by-side */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md">

              <button
                type="submit"
                disabled={
                  saving
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-sm transition-colors text-sm text-center disabled:opacity-70"
              >
                {saving
                  ? "Updating..."
                  : "Update Customer"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/customer"
                  )
                }
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium px-6 py-2.5 rounded-md transition-colors text-sm text-center"
              >
                Back
              </button>

            </div>

          </form>

        </div>
      </div>
    </Sidebar>
  );
}