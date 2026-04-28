"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/dashboardStats";
import { getMonthlyEnquiries } from "@/lib/getMonthlyEnquiries";
import { Home, FileText, Mail } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Page() {
  const [stats, setStats] = useState({
    properties: 0,
    blogs: 0,
    enquiries: 0,
  });

  const [growthData, setGrowthData] = useState({
    labels: [],
    data: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const statsData = await getDashboardStats();
      const monthlyData = await getMonthlyEnquiries();

      setStats(statsData);
      setGrowthData(monthlyData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const barData = {
    labels: ["Properties", "Blogs", "Enquiries"],
    datasets: [
      {
        label: "Data Overview",
        data: [stats.properties, stats.blogs, stats.enquiries],
        backgroundColor: ["#3B82F6", "#22C55E", "#DBA40D"],
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: growthData.labels,
    datasets: [
      {
        label: "Enquiries Growth",
        data: growthData.data,
        borderColor: "#DBA40D",
        backgroundColor: "#DBA40D33",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <main className="flex flex-col gap-0 p-5">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <p className="text-gray-500">Welcome to the admin panel.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <Card
          title="Total Properties"
          value={stats.properties}
          loading={loading}
          icon={Home}
          color="bg-blue-500"
        />
        <Card
          title="Total Blogs"
          value={stats.blogs}
          loading={loading}
          icon={FileText}
          color="bg-green-500"
        />
        <Card
          title="Enquiries"
          value={stats.enquiries}
          loading={loading}
          icon={Mail}
          color="bg-[#DBA40D]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Enquiries Growth</h2>
          <Line data={lineData} />
        </div>
      </div>
    </main>
  );
}

function Card({ title, value, loading, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">
          {loading ? "..." : value}
        </h2>
      </div>

      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}
