import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    doorNumber: "",
    amount: "",
    phoneNumber: "",
    paymentMode: "",
    message: "", // new field
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Allow only one paymentMode at a time
      setFormData((prev) => ({
        ...prev,
        paymentMode: checked ? value : "",
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

    /*
    const doc = new jsPDF();
    doc.text(`Name: ${formData.name}`, 10, 10);
    doc.text(`Door Number: ${formData.doorNumber}`, 10, 20);
    doc.text(`Amount: ₹${formData.amount}`, 10, 30);
    doc.text(`Phone Number: +91${formData.phoneNumber}`, 10, 40);
    doc.text(`Payment Mode: ${formData.paymentMode}`, 10, 50);
    */
    const doc = new jsPDF();

    // Add "PAID" watermark
    doc.saveGraphicsState(); // Save current graphics state

    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150); // Light gray
    doc.setTextColor(200); // Even lighter

    // Draw diagonal watermark text with rotation and low opacity
    doc.text("PAID", 35, 150, {
      angle: 45,
      opacity: 0.1, // Watermark style
    });

    doc.restoreGraphicsState(); // Restore to previous state

    // Heading 1
    doc.setFontSize(18);
    doc.text(
      "INDRAPRASTHA GANESH UTSAV COMMITTEE",
      105,
      20, // Y-position for first heading
      null,
      null,
      "center"
    );

    // Heading 2
    const serialNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit
    doc.setFontSize(14);
    doc.text(
      `Donation Receipt - #${serialNumber}`,
      105,
      30, // Move down to separate line (adjust as needed)
      null,
      null,
      "center"
    );

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25); // Top horizontal line

    let startY = 40;

    // Content with bold labels
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(formData.name, 80, startY);

    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Door Number:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(formData.doorNumber, 80, startY);

    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Amount Paid:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.amount}/-`, 80, startY);

    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Phone Number:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(`+91${formData.phoneNumber}`, 80, startY);

    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Mode:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(formData.paymentMode, 80, startY);

    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Message:", 30, startY);
    doc.setFont("helvetica", "normal");

    // Split long message into lines to avoid overflow
    const messageLines = doc.splitTextToSize(formData.message, 100);
    doc.text(messageLines, 80, startY);

    // Update startY to move below multiline text
    startY += messageLines.length * 10;

    //startY += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Received by:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text("Indraprastha Youth", 80, startY);

    // Add date next to it or below
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN"); // Format: DD/MM/YYYY

    startY += 10; // move to next line, or adjust X/Y for side-by-side
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 30, startY);
    doc.setFont("helvetica", "normal");
    doc.text(formattedDate, 80, startY);

    // Bottom line
    doc.line(20, startY + 10, 190, startY + 10);

    doc.setFontSize(10);
    doc.setTextColor(100); // Light gray for footer
    doc.text(
      "Thank you for your payment!",
      105,
      startY + 20,
      null,
      null,
      "center"
    );

    // Save PDF locally on device
    doc.save(`Receipt${formData.doorNumber}.pdf`);

    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], "receipt.pdf", {
      type: "application/pdf",
    });

    const form = new FormData();
    form.append("file", file);

    try {
      const uploadRes = await axios.post(
        "https://tmpfiles.org/api/v1/upload",
        form
      );
      const uploadedUrl = uploadRes.data.data.url;

      const message = `Hi! Here is your receipt for ₹${formData.amount}. Donation towards Indrastha Ganesh Utsav. Click to download: ${uploadedUrl} Thanks for your contribution`;
      const whatsappUrl = `https://wa.me/91${
        formData.phoneNumber
      }?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("PDF upload failed:", error);
      alert("Failed to upload PDF. Please try again.");
    }

    // Reset form
    setFormData({
      name: "",
      doorNumber: "",
      amount: "",
      phoneNumber: "",
      paymentMode: "",
      message: "", // reset this too
    });
  };

  return (
    <div className="bg-center">
      <div className="d-flex justify-content-center align-items-center text-white">
        <h2>Indraprastha Santhigram</h2>
      </div>
      <div className=" d-flex justify-content-end align-items-center text-white container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name:</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Door Number:</label>
            <input
              name="doorNumber"
              className="form-control"
              value={formData.doorNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Amount (₹):</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />
          </div>
          <div className="mb-3">
            <label>Message:</label>
            <textarea
              name="message"
              className="form-control"
              rows="3"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Payment Mode:</label>
            <br />
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
    </div>
  );
};

export default Home;
