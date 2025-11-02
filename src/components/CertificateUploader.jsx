import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { uploadToIPFS } from "../utils/ipfsUpload";
import { getContract } from "../utils/contract";
import "../styles/CertificateUploader.css";

const CertificateUploader = ({ courses }) => {
  const [file, setFile] = useState(null);
  const [imageURI, setImageURI] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWalletAddress(signer.address);
      } catch (err) {
        console.error("Wallet fetch error:", err);
        setStatus("❌ Unable to fetch wallet address.");
      }
    };
    fetchWallet();
  }, []);

  const uploadCertificateImage = async () => {
    if (!file) {
      setStatus("❌ Please select a certificate image.");
      return;
    }

    try {
      setStatus("⏳ Uploading image to IPFS...");
      const imageCID = await uploadToIPFS(file);
      const uri = `ipfs://${imageCID}`;
      setImageURI(uri);
      setStatus("✅ Image uploaded. Ready to issue certificate.");
    } catch (err) {
      console.error("Image upload error:", err);
      setStatus("❌ Error uploading image.");
    }
  };

  const issueCertificate = async () => {
    if (!imageURI || !selectedCourseId || !studentAddress) {
      setStatus("❌ Upload image, select course, and enter student address.");
      return;
    }

    try {
      const selectedCourse = courses.find(
        (c) => Number(c[0]) === parseInt(selectedCourseId)
      );
      const instructorAddress = selectedCourse?.[5];

      if (
        !selectedCourse ||
        instructorAddress?.toLowerCase() !== walletAddress?.toLowerCase()
      ) {
        setStatus("❌ You are not the instructor for this course.");
        return;
      }

      const metadata = {
        name: "Certificate of Completion",
        description: `Awarded to ${studentAddress} for completing ${selectedCourse[1]}`,
        image: imageURI,
        attributes: [
          { trait_type: "Course", value: selectedCourse[1] },
          { trait_type: "Issued By", value: "BlockchainVerse" },
          { trait_type: "Date", value: new Date().toISOString().split("T")[0] }
        ]
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json"
      });
      const metadataFile = new File([metadataBlob], "metadata.json");

      setStatus("⏳ Uploading metadata to IPFS...");
      const metadataCID = await uploadToIPFS(metadataFile);
      const tokenURI = `ipfs://${metadataCID}`;

      const contract = await getContract();
      const tx = await contract.issueCertificate(
        selectedCourseId,
        studentAddress,
        tokenURI
      );
      await tx.wait();

      setStatus("✅ Certificate NFT issued to student!");
    } catch (err) {
      console.error("Issue error:", err);
      setStatus("❌ Error issuing certificate.");
    }
  };

  return (
    <div className="certificate-uploader-container">
      <h2>Instructor Certificate Issuer</h2>

      <label>Upload Certificate Image:</label>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadCertificateImage}>Upload</button>

      <label>Select Course:</label>
      {!Array.isArray(courses) ? (
        <p>⏳ Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>⚠️ No courses available. Create a course first.</p>
      ) : courses.filter(
          (course) =>
            course[5]?.toLowerCase() === walletAddress?.toLowerCase()
        ).length === 0 ? (
        <p>⚠️ No courses found for your wallet. Make sure you're logged in as an instructor.</p>
      ) : (
        <select
          onChange={(e) => setSelectedCourseId(e.target.value)}
          value={selectedCourseId}
        >
          <option value="">-- Select a course --</option>
          {courses
            .filter(
              (course) =>
                course[5]?.toLowerCase() === walletAddress?.toLowerCase()
            )
            .map((course) => (
              <option key={course[0]} value={course[0]}>
                {course[1]}
              </option>
            ))}
        </select>
      )}

      <label>Enter Student Wallet Address:</label>
      <input
        type="text"
        value={studentAddress}
        onChange={(e) => setStudentAddress(e.target.value)}
        placeholder="0x..."
      />

      <button onClick={issueCertificate}>Issue NFT Certificate</button>

      <p>{status}</p>
    </div>
  );
};

export default CertificateUploader;
