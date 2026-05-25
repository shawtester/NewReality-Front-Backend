import {
  AdminSensitiveFieldsProvider,
  SensitiveFieldsUnlock,
} from "../components/AdminSensitiveFields";
import ListView from "./components/listview";

export default function Page() {
  return (
    <AdminSensitiveFieldsProvider>
      <main className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl">Contacts</h1>
          <SensitiveFieldsUnlock />
        </div>
        <ListView />
      </main>
    </AdminSensitiveFieldsProvider>
  );
}
