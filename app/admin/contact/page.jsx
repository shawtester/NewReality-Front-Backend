import AdminSensitiveLock from "../components/AdminSensitiveLock";
import ListView from "./components/listview";

export default function Page() {
  return (
    <AdminSensitiveLock
      title="Contact Details Locked"
      description="Enter the access key to view saved contact details."
    >
      <main className="flex flex-col gap-4 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Contacts</h1>
        </div>
        <ListView />
      </main>
    </AdminSensitiveLock>
  );
}
