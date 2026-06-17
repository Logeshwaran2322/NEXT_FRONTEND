'use client';

import AddPage from "../../../components/Common/AddPage";
import Sidebar from "../../../components/layout/Sidebar";

export default function BrandAdd() {
  const fields = [
    {
      name: "identifier",
      label: "Identifier",
      type: "text",
    },
    {
      name: "brandName",
      label: "Brand Name",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
    },
  ];

  return (
    <Sidebar>
      <AddPage
        fields={fields}
        modelName="brand"
      />
    </Sidebar>
  );
}