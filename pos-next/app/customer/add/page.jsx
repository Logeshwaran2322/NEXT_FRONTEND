"use client";

import { useSearchParams } from "next/navigation";
import AddPage from "../../../components/Common/AddPage";

import CustomerForm, {
  customerBaseFields,
  customerInitialData,
} from "../../../components/customer/CustomerForm";

const CustomerAdd = () => {
  const searchParams = useSearchParams();

  const returnTo =
    searchParams.get("returnTo") ||
    "/customer";

  return (
    <AddPage
      modelName="customer"
      fields={customerBaseFields}
      initialData={customerInitialData}
      redirectTo={`${returnTo}?customerAdded=true`}
      renderForm={(props) => (
        <CustomerForm {...props} />
      )}
    />
  );
};

export default CustomerAdd;