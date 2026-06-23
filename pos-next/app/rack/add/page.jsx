'use client';

import AddPage from "../../../components/Common/AddPage";
import Sidebar from "../../../components/layout/Sidebar";
import Shelves from "../../../components/dropdown/shelves";

export default function RackAdd() {
const fields = [
{
name: "identifier",
label: "Identifier",
type: "text",
},
{
name: "name",
label: "Rack Name",
type: "text",
},
{
name: "shelves",
label: "Shelves",
component: Shelves,
},
];

  return (
    <Sidebar>
      <AddPage
        fields={fields}
        modelName="rack"
      />
    </Sidebar>
  );
}