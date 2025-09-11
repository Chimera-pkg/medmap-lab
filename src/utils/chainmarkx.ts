import { CHAINMARKX_BASE_URL, CHAINMARKX_USER_ID } from "../config";

// Export CHAINMARKX_USER_ID agar bisa diimport dari file lain
export { CHAINMARKX_USER_ID };

// Helper untuk convert blob ke base64
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Test function untuk health check
export async function cmxHealthCheck() {
  try {
    const response = await fetch(`${CHAINMARKX_BASE_URL}/`, {
      credentials: "include",
    });
    if (!response.ok)
      throw new Error(`Health check failed: ${response.status}`);
    const result = await response.text();
    console.log("ChainMarkX Health Check:", result);
    return result;
  } catch (error) {
    console.error("ChainMarkX Health Check Error:", error);
    throw error;
  }
}

// Login ke ChainMarkX
export async function cmxLogin(email: string, password: string) {
  try {
    const response = await fetch(`${CHAINMARKX_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("ChainMarkX Login successful:", result);
    return result;
  } catch (error) {
    console.error("ChainMarkX Login error:", error);
    throw error;
  }
}

// Upload document ke ChainMarkX
// export async function cmxUploadDocument(params: {
//   file_name: string;
//   content: string; // base64 PDF
//   owner: string;
//   user: string;
// }) {
//   try {
//     const response = await fetch(`${CHAINMARKX_BASE_URL}/data`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(params),
//     });

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("Document uploaded:", result);
//     return result;
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw error;
//   }
// }

export async function cmxUploadDocument(params: {
  file_name: string;
  content: string;
  owner: string;
  user: string;
}) {
  try {
    const response = await fetch(
      `/chainmarkx/user/admin@mail.com/profile/export`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({
          block: "9",
          pdf_path: params.content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Watermarking failed: ${response.status}`);
    }

    // Return the watermarked PDF as a Blob
    return await response.blob();
  } catch (error) {
    console.error("Watermarking error:", error);
    throw error;
  }
}

// Encode watermark ke document
export async function cmxEncodeDocument(id: string) {
  try {
    const response = await fetch(`${CHAINMARKX_BASE_URL}/data/${id}/encode`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Encode failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Document encoded:", result);
    return result;
  } catch (error) {
    console.error("Encode error:", error);
    throw error;
  }
}

// Get document details (hash & block)
export async function cmxGetDocDetails(userId: string, id: string) {
  try {
    const response = await fetch(
      `${CHAINMARKX_BASE_URL}/user/${userId}/data/${id}/details`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Get details failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Document details:", result);
    return result;
  } catch (error) {
    console.error("Get details error:", error);
    throw error;
  }
}

// Export PDF dengan watermark
export async function cmxExportPdf(id: string): Promise<Blob> {
  try {
    const response = await fetch(`${CHAINMARKX_BASE_URL}/data/${id}/export`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Export PDF failed: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("PDF exported:", blob);
    return blob;
  } catch (error) {
    console.error("Export PDF error:", error);
    throw error;
  }
}

// Verify PDF
export async function cmxVerifyPdf(userId: string, pdfFile: File) {
  try {
    const formData = new FormData();
    formData.append("file", pdfFile);

    const response = await fetch(
      `${CHAINMARKX_BASE_URL}/user/${userId}/verify/pdf`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Verify PDF failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("PDF verified:", result);
    return result;
  } catch (error) {
    console.error("Verify PDF error:", error);
    throw error;
  }
}
