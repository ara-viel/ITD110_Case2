import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Sidebar from "./Sidebar";
import './Certificate.css';


const Certificate = () => {
  const certificateRef = useRef();
  const [name, setName] = useState("");
  const [type, setType] = useState("Indigency");

  const downloadPDF = () => {
    const opt = {
      margin: 1,
      filename: `${type}-Certificate.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(certificateRef.current).set(opt).save();
  };

  const printCertificate = () => {
    const printContents = certificateRef.current.innerHTML;
    const printWindow = window.open("", "", "width=400,height=500");
    printWindow.document.write(`
      <html>
        <head>
          <title>${type} Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .certificate { border: 2px solid #000; padding: 20px; }
            .center { text-align: center; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const currentDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="content">

    <div className="p-4">
      <div style={{ display: 'flex' }}>
              <Sidebar />
            </div>
      <h1 className="text-xl font-bold mb-4">Barangay Certificate Generator</h1>

      <div className="mb-4">
        <label className="block mb-1">Select Certificate Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2  short-input">
          <option value="Indigency">Indigency</option>
          <option value="Clearance">Barangay Clearance</option>
          <option value="Good Moral">Good Moral</option>
        </select>
        <label className="block mb-1">                             Resident Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2  short-input" />
      </div>

      

      <button onClick={downloadPDF} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Download PDF</button>
      <button onClick={printCertificate} className="bg-blue-500 text-white px-4 py-2 rounded">Print</button>

      {/* Certificate preview */}
      <div className="mt-8 border p-6" ref={certificateRef}>
        <div className="certificate">
          <div className="center">
            <img src="/images/logo.jpg" alt="Brgy Logo" width="80" />
            <h2>Republic of the Philippines</h2>
            <h3>Barangay Hindang</h3>
            <h3>{type} Certificate</h3>
            <hr style={{ margin: "20px 0" }} />
            <p>To whom it may concern:</p>
            <p>
              This is to certify that <strong>{name || "____________________"}</strong> is a resident of Barangay Hindang and is issued this
              <strong> {type}</strong> for whatever legal purpose it may serve.
            </p>
            <p className="mt-4">Issued on {currentDate} at Barangay Hindang.</p>

            <div className="signature">
              <p><strong>Barangay Captain</strong></p>
              <img src="/images/signature.png" alt="Signature" width="120" />
              <p>Alden Richards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Certificate;
