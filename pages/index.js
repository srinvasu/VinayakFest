// src/components/CustomFormWithPDF.js
import React, { useState } from "react";
import { jsPDF } from "jspdf";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    doorNumber: "",
    amount: "",
    phone: "",
    paymentMode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (mode) => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: prev.paymentMode === mode ? "" : mode,
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Payment Receipt`, 10, 10);
    doc.text(`Name: ${formData.name}`, 10, 20);
    doc.text(`Door Number: ${formData.doorNumber}`, 10, 30);
    doc.text(`Amount: ₹${formData.amount}`, 10, 40);
    doc.text(`Phone: +91${formData.phone}`, 10, 50);
    doc.text(`Payment Mode: ${formData.paymentMode}`, 10, 60);
    doc.save("payment-details.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.paymentMode) {
      alert("Please select a payment mode.");
      return;
    }

    generatePDF();

    const message = `Hello, here is the payment info:\nName: ${formData.name}\nDoor No: ${formData.doorNumber}\nAmount: ₹${formData.amount}\nPayment Mode: ${formData.paymentMode}`;
    const whatsappUrl = `https://wa.me/91${
      formData.phone
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setFormData({
      name: "",
      doorNumber: "",
      amount: "",
      phone: "",
      paymentMode: "",
    });
  };
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Indraprastha Santigram Ganesh Festival</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Door Number</label>
          <input
            type="text"
            className="form-control"
            name="doorNumber"
            value={formData.doorNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit number"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Mode</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="cash"
              checked={formData.paymentMode === "Cash"}
              onChange={() => handleCheckboxChange("Cash")}
            />
            <label className="form-check-label" htmlFor="cash">
              Cash
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="online"
              checked={formData.paymentMode === "Online"}
              onChange={() => handleCheckboxChange("Online")}
            />
            <label className="form-check-label" htmlFor="online">
              Online
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit & Send WhatsApp
        </button>
      </form>
    </div>
  );
};
export default Home;
