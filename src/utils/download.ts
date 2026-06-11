import { API_URL } from "../config";

export type LabTestFileType = "pdf" | "hl7";

/**
 * Fetch a generated report artifact through the authenticated API. The files are
 * streamed by the backend (not served from the public static path), so the
 * bearer token is required and the request always reaches the backend.
 */
async function fetchLabTestFile(
  recordId: number | string,
  type: LabTestFileType
): Promise<Blob> {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/lab-tests/${recordId}/download/${type}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${type.toUpperCase()} (status ${response.status})`);
  }

  return response.blob();
}

/** Download a report artifact to disk with the given file name. */
export async function downloadLabTestFile(
  recordId: number | string,
  type: LabTestFileType,
  fileName: string
): Promise<void> {
  const blob = await fetchLabTestFile(recordId, type);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
}

/**
 * Fetch a report artifact and return an object URL suitable for previewing in an
 * <iframe>/<embed>. Caller is responsible for revoking the URL.
 */
export async function getLabTestFileObjectUrl(
  recordId: number | string,
  type: LabTestFileType
): Promise<string> {
  const blob = await fetchLabTestFile(recordId, type);
  return window.URL.createObjectURL(blob);
}
