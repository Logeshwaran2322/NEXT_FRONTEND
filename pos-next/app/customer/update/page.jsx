"use client";

import UpdatePage from "../../../components/Common/UpdatePage";

import CustomerForm, {
  customerBaseFields,
} from "../../../components/customer/CustomerForm";

const CustomerUpdate = () => {
  return (
    <UpdatePage
      modelName="customer"
      fields={customerBaseFields}
      renderForm={(props) => (
        <CustomerForm {...props} />
      )}
    />
  );
};

export default CustomerUpdate;