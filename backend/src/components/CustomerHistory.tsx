// src/pages/CustomerHistory.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "../api/axios";

// Payment Interface
interface Payment {
  payment_id: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  note?: string;
  payment_date: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
  };
  plan: {
    name: string;
    price: number;
    duration: {
      value: number;
      unit: string;
    };
    currency: string;
  } | null;
  subscription: {
    id: string;
    start_date: string;
    end_date: string;
    plan_type: string;
    status: string;
  };
}

export default function CustomerHistory() {
  const { id } = useParams<{ id: string }>(); // subscription_id
  const navigate = useNavigate();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const limit = 10;

  const fetchPayments = async () => {
    if (!id) {
      setError("Subscription ID is missing in URL");
      setLoading(false);
      return;
    }

    const url = `/admin/subscription/${id}/payments?page=${page}&limit=${limit}`;
    console.log("Fetching payments from URL:", url);

    try {
      setLoading(true);
      const res = await axios.get(url);

      if (res.data.success) {
        const paymentsData = res.data.data || [];
        setPayments(paymentsData);
        setTotalPages(res.data.totalPages || 1);

        if (paymentsData.length === 0) {
          setError("No payments found for this subscription.");
        } else {
          setError("");
        }
      } else {
        setError(res.data.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError("Error fetching payments. Check console for details.");
      setPayments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [id, page]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Loading payment history...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Back Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow hover:bg-[#064d99] transition flex items-center gap-2"
          >
            <FiArrowLeft size={18} /> Back
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Subscription Payment History</h2>

        {error && payments.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-gray-500 text-lg gap-4">
            <div>{error}</div>
          </div>
        ) : (
          <>
            {/* Payments Table */}
            <div className="overflow-x-auto border shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-sm uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">User Name</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Duration</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Note</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {payments.map((p) => {
                    const user = p.user.firstname
                      ? p.user
                      : { firstname: "N/A", lastname: "N/A", email: "N/A", mobile: "N/A" };
                    const plan = p.plan || {
                      name: "Free Plan",
                      price: 0,
                      duration: { value: 1, unit: "day" },
                      currency: "INR",
                    };

                    return (
                      <tr key={p.payment_id || p.subscription.id}>
                        <td className="px-4 py-3">{new Date(p.payment_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{user.firstname} {user.lastname}</td>
                        <td className="px-4 py-3">{plan.name}</td>
                        <td className="px-4 py-3">{plan.duration.value} {plan.duration.unit}</td>
                        <td className="px-4 py-3">{plan.currency} {p.amount}</td>
                        <td className="px-4 py-3">{p.payment_method}</td>
                        <td className="px-4 py-3 font-semibold">{p.subscription.status}</td>
                        <td className="px-4 py-3">{p.note || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
