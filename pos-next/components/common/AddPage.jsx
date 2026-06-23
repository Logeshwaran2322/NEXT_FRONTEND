'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import api from "../../services/api";
import Sidebar from "../layout/Sidebar";

const AddPage = ({
  fields,
  modelName,
  initialData = {},
  renderForm,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required === false) return;

      if (
        value === undefined ||
        value === null ||
        value.toString().trim() === ""
      ) {
        newErrors[field.name] =
          `${field.label} is required`;
      }

      if (
        field.name === "username" &&
        value &&
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
      ) {
        newErrors[field.name] =
          "Invalid email format";
      }

      if (
        field.type === "password" &&
        value &&
        value.length < 6
      ) {
        newErrors[field.name] =
          "Password must be at least 6 characters";
      }

      if (field.name === "phoneNo" && value) {
        if (!/^\d+$/.test(value)) {
          newErrors[field.name] =
            "Phone number must contain only digits";
        } else if (value.length !== 10) {
          newErrors[field.name] =
            "Phone number must be exactly 10 digits";
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field) => {
    if (field.component) {
      return field.component({
        value: formData[field.name],
        onChange: (value) =>
          setFormData((prev) => ({
            ...prev,
            [field.name]: value,
          })),
      });
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all min-h-[100px]"
        />
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
      />
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const token =
      localStorage.getItem("token");

    try {
      const res = await api.post(
        `/${modelName}/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success === false) {
        setMessage(res.data.message);
        return;
      }

      setMessage("Added successfully");

      setTimeout(() => {
        router.push(`/${modelName}`);
      }, 1500);

    } catch (err) {
      console.log(formData);
      console.error(err);
      setMessage("Failed to add");
    }
  };

  return (
    <Sidebar>
    <div className="min-h-screen bg-[#f4f6fb] flex justify-center py-12 px-4">
      <div className="w-[800px] bg-white p-8 rounded-xl shadow-md border border-slate-100">

        <h3 className="text-center text-blue-600 text-2xl font-bold mb-8 tracking-wide">
          Add {modelName}
        </h3>

        {message && (
          <div className="mb-6 p-3 rounded-md text-center text-sm font-medium bg-red-50 text-red-600 border border-red-100">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Base Fields */}
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <div className="grid grid-cols-[200px_1fr] gap-4 items-center">

                <label className="text-sm font-semibold text-slate-700">
                  {field.label}
                </label>

                {/* Wrapper to control and reduce the field width */}
                <div className="w-full max-w-md">
                  {renderField(field)}
                </div>
              </div>

              {errors[field.name] && (
                <p className="ml-[216px] mt-1 text-xs font-medium text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Extra Customer Fields */}
          {renderForm &&
            renderForm({
              formData,
              handleChange,
              errors,
            })}

          <div className="pt-4 flex flex-col items-center">
            <button
              type="submit"
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md shadow-sm transition-colors text-sm"
            >
              Add {modelName}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(`/${modelName}`)
              }
              className="w-full max-w-md mt-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-md transition-colors text-sm text-center"
            >
              ← Back to List
            </button>
          </div>

        </form>

      </div>
    </div>
    </Sidebar>
  );
};

AddPage.propTypes = {
  fields: PropTypes.array.isRequired,
  modelName: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  renderForm: PropTypes.func,
};

export default AddPage;