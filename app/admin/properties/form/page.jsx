"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import { createNewProperty, updateProperty } from "../../../../lib/firestore/products/write";

import BasicDetails from "./components/BasicDetails";
import Overview from "./components/Overview";
import FloorPlans from "./components/FloorPlans";
import Amenities from "./components/Amenities";
import Location from "./components/Location";
import FAQ from "./components/FAQ";
import Disclaimer from "./components/Disclaimer";
import Image from "./components/Image";

export default function Page() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  /* Nested state updater */
  const handleData = (key, value) => {
    setData((prev) => {
      const keys = key.split(".");
      let updated = { ...prev };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] || {}) };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  /* Submit handler */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!data?.title) throw new Error("Project name is required");
      if (!data?.location) throw new Error("Location is required");

      if (id) {
        await updateProperty({ data: { ...data, id } });
        toast.success("Property updated successfully");
      } else {
        await createNewProperty({ data });
        toast.success("Property created successfully");
      }

      router.push("/admin/properties");
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">
          {id ? "Update Property" : "Create Property"}
        </h1>

        <Button type="submit" isLoading={isLoading}>
          {id ? "Update" : "Create"}
        </Button>
      </div>

      <BasicDetails data={data} handleData={handleData} />
      <Image data={data} handleData={handleData} />
      <Overview data={data} handleData={handleData} />
      <FloorPlans data={data} handleData={handleData} />
      <Amenities data={data} handleData={handleData} />
      <Location data={data} handleData={handleData} />
      <FAQ data={data} handleData={handleData} />
      <Disclaimer data={data} handleData={handleData} />
    </form>
  );
}
