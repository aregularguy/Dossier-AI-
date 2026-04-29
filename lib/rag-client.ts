import { createClient } from '@/lib/supabase/client';

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function ingestDocument(file: File) {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${RAG_API_URL}/api/ingest`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Ingestion failed');
  }
  return res.json() as Promise<{
    document_id: string;
    filename: string;
    page_count: number;
    chunk_count: number;
    status: string;
    message: string;
  }>;
}

export async function askDocuments(question: string, topK: number = 5) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${RAG_API_URL}/api/ask`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, top_k: topK }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Ask failed');
  }
  return res.json() as Promise<{
    answer: string;
    sources: Array<{
      chunk_id: string;
      document_id: string;
      content_preview: string;
      similarity: number;
      metadata: Record<string, unknown>;
    }>;
    question: string;
  }>;
}

export async function listDocuments() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${RAG_API_URL}/api/documents`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json() as Promise<
    Array<{
      id: string;
      filename: string;
      page_count: number | null;
      chunk_count: number;
      status: string;
      created_at: string;
    }>
  >;
}

export async function deleteDocument(documentId: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${RAG_API_URL}/api/documents/${documentId}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) throw new Error('Failed to delete document');
}
