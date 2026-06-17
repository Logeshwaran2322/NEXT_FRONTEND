'use client';

import AddPage from "../../../components/Common/AddPage";
import Sidebar from "../../../components/layout/Sidebar";

export default function UnitAdd() {
  const fields = [
    {
      name: "identifier",
      label: "Identifier",
      type: "text",
    },
    {
      name: "name",
      label: "Unit Name",
      type: "text",
    },
  ];

  return (
    <Sidebar>
      <AddPage
        fields={fields}
        modelName="unit"
      />
    </Sidebar>
  );
}