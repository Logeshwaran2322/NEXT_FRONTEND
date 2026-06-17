'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import api from "../../services/api";

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
          className="w-full border rounded-lg px-3 py-2"
        />
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
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
    <div className="min-h-screen bg-[#f4f6fb] flex justify-center py-10">
      <div className="w-[800px] bg-white p-8 rounded-xl shadow">

        <h3 className="text-center text-blue-600 text-2xl font-bold mb-8">
          Add {modelName}
        </h3>

        {message && (
          <div className="mb-4 text-center text-red-500">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Base Fields */}
          {fields.map((field) => (
            <div key={field.name}>
              <div className="grid grid-cols-[220px_1fr] gap-4 items-center">

                <label className="font-semibold">
                  {field.label}
                </label>

                {renderField(field)}
              </div>

              {errors[field.name] && (
                <p className="ml-[235px] mt-1 text-sm text-red-500">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Add {modelName}
          </button>

        </form>

        <button
          onClick={() =>
            router.push(`/${modelName}`)
          }
          className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-lg"
        >
          ← Back
        </button>

      </div>
    </div>
  );
};

AddPage.propTypes = {
  fields: PropTypes.array.isRequired,
  modelName: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  renderForm: PropTypes.func,
};

export default AddPage;