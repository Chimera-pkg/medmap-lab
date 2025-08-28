import { CHAINMARKX_BASE_URL } from "../config";

export async function cmxLogin(email: string, password: string) {
  const res = await fetch(`${CHAINMARKX_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function cmxUploadDocument(params: {
  file_name: string;
  content: string;
  owner: string;
  user: string;
}) {
  const res = await fetch(`${CHAINMARKX_BASE_URL}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json() as Promise<{
    message: string;
    data: { id: string; hash: string };
  }>;
}

export async function cmxEncodeDocument(id: string) {
  const res = await fetch(`${CHAINMARKX_BASE_URL}/data/${id}/encode`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Encode failed");
  return res.json();
}

export async function cmxGetDocDetails(userId: string, id: string) {
  const res = await fetch(
    `${CHAINMARKX_BASE_URL}/user/${userId}/data/${id}/details`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Details failed");
  return res.json() as Promise<{ data: { hash: string; block: string } }>;
}

export async function cmxUploadBlock(id: string, block: string) {
  const res = await fetch(`${CHAINMARKX_BASE_URL}/data/${id}/block`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ block }),
  });
  if (!res.ok) throw new Error("Block upload failed");
  return res.json();
}

export async function cmxExportPdf(id: string) {
  const res = await fetch(`${CHAINMARKX_BASE_URL}/data/${id}/export`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Export PDF failed");
  return await res.blob(); // application/pdf
}
