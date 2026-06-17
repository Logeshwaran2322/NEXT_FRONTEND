'use client';

import ListPage from "../../components/Common/ListPage";
import Sidebar from "../../components/layout/Sidebar";

export default function CustomerList() {
  const keys = [
    "id",
    "name",
    "email",
    "phoneNo",
    "balance",
    "balanceType",
    "partyType",
    "creditLimit",
    "address",
  ];

  const fields = [
    {
      name: "id",
      label: "Id",
      type: "text",
    },
    {
      name: "name",
      label: "Customer Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "text",
    },
    {
      name: "balance",
      label: "Balance",
      type: "number",
    },
    {
      name: "balanceType",
      label: "Balance Type",
      type: "text",
    },
    {
      name: "partyType",
      label: "Party Type",
      type: "text",
    },
    {
      name: "creditLimit",
      label: "Credit Limit",
      type: "number",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      required: false,
    },
  ];

  return (
    <Sidebar>
      <ListPage
        keys={keys}
        fields={fields}
        modelName="customer"
      />
    </Sidebar>
  );
}