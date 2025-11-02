import axios from 'axios';

export async function uploadToIPFS(data) {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', blob, 'metadata.json');

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
      },
    });

    return res.data.IpfsHash;
  } catch (err) {
    console.error('❌ IPFS upload failed:', err.response?.data || err.message);
    throw err;
  }
}
