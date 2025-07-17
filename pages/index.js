import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    doorNumber: '',
    amount: '',
    phoneNumber: '',
    paymentMode: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Allow only one paymentMode at a time
      setFormData((prev) => ({
        ...prev,
        paymentMode: checked ? value : '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doc = new jsPDF();
    doc.text(`Name: ${formData.name}`, 10, 10);
    doc.text(`Door Number: ${formData.doorNumber}`, 10, 20);
    doc.text(`Amount: ₹${formData.amount}`, 10, 30);
    doc.text(`Phone Number: +91${formData.phoneNumber}`, 10, 40);
    doc.text(`Payment Mode: ${formData.paymentMode}`, 10, 50);

    // Save PDF locally on device
    doc.save("receipt.pdf");
    
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], "receipt.pdf", { type: 'application/pdf' });

    const form = new FormData();
    form.append("file", file);

    try {
      const uploadRes = await axios.post('https://tmpfiles.org/api/v1/upload', form);
      const uploadedUrl = uploadRes.data.data.url;

      const message = `Hi! Here is your receipt for ₹${formData.amount}. Click to download: ${uploadedUrl}`;
      const whatsappUrl = `https://wa.me/91${formData.phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("PDF upload failed:", error);
      alert("Failed to upload PDF. Please try again.");
    }

    // Reset form
    setFormData({
      name: '',
      doorNumber: '',
      amount: '',
      phoneNumber: '',
      paymentMode: '',
    });
  };

  return (
    <div className="container mt-5">
      <h2>Indraprasth Santhigram Fest</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Door Number:</label>
          <input name="doorNumber" className="form-control" value={formData.doorNumber} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Amount (₹):</label>
          <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Phone Number:</label>
          <input type="tel" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} required pattern="[0-9]{10}" />
        </div>
        <div className="mb-3">
          <label>Payment Mode:</label><br />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="paymentMode"
              value="Cash"
              checked={formData.paymentMode === "Cash"}
              onChange={handleChange}
            />
            <label className="form-check-label">Cash</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="paymentMode"
              value="Online"
              checked={formData.paymentMode === "Online"}
              onChange={handleChange}
            />
            <label className="form-check-label">Online</label>
          </div>
        </div>
        <button className="btn btn-primary">Submit & Send to WhatsApp</button>
      </form>
    </div>
  );
};

export default Home;
