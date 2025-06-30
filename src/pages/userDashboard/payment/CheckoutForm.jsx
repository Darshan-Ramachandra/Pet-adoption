import { useContext, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../../../components/providers/AuthProvider";
import { useParams } from "react-router-dom";

const CheckoutForm = () => {
  const [values, setValues] = useState({
    donationAmount: "",
    name: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const baseUrl = "http://localhost:5007";

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optionally fetch donation campaign details if needed
    // For now, just post the payment
    const payment = {
      email: values.email || user?.email,
      name: values.name || user?.displayName,
      donationId: id,
      donationAmount: values.donationAmount,
      date: new Date(),
      status: "pending",
    };
    try {
      const res = await axiosSecure.post("/payments", payment);
      if (res.data?.paymentResult?.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Thank you for your donation!",
          showConfirmButton: false,
          timer: 1500,
        });
        setSubmitted(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Thank you for your donation!</h2>
        <p>We appreciate your support.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Donate</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Donation Amount</label>
        <input
          type="number"
          name="donationAmount"
          value={values.donationAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          min="1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
      >
        Donate
      </button>
    </form>
  );
};

export default CheckoutForm;
