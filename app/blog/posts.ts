export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string };

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingMinutes: number;
  tag: string;
  body: Block[];
}

export const posts: Post[] = [
  {
    slug: 'how-rag-works',
    title: 'How RAG works (and how Dossier AI uses it)',
    description:
      'A plain-language walkthrough of retrieval-augmented generation: chunking, embeddings, vector search, and grounded answers.',
    date: '2026-09-08',
    readingMinutes: 7,
    tag: 'Explainer',
    body: [
      {
        type: 'p',
        text: 'Large language models are good at reasoning over text but they only know what was in their training data. Ask one about a PDF you uploaded five minutes ago and it has nothing to go on. Retrieval-augmented generation (RAG) fixes that by fetching the relevant passages from your documents at question time and handing them to the model as context.',
      },
      {
        type: 'h2',
        text: 'The core idea',
      },
      {
        type: 'p',
        text: 'Instead of asking the model to answer from memory, RAG splits the job into two steps: retrieve, then generate. First a search system finds the handful of passages most likely to contain the answer. Then the language model writes an answer using only those passages. The result is grounded in your actual documents and can cite where each claim came from.',
      },
      {
        type: 'h2',
        text: 'Step 1: Ingestion',
      },
      {
        type: 'p',
        text: 'When you upload a document, Dossier AI processes it before you ever ask a question:',
      },
      {
        type: 'ol',
        items: [
          'Extract the raw text from the PDF, page by page.',
          'Split that text into overlapping chunks of a few hundred words each. Overlap keeps sentences that straddle a boundary from losing their context.',
          'Send every chunk to an embedding model, which turns it into a vector — a list of numbers that captures the passage’s meaning.',
          'Store the vectors, the chunk text, and metadata (document id, page number) in a vector database.',
        ],
      },
      {
        type: 'p',
        text: 'This is why uploading is not instant: the page count and chunk count you see afterward are the units the retriever will search over.',
      },
      {
        type: 'h2',
        text: 'Step 2: Retrieval',
      },
      {
        type: 'p',
        text: 'When you ask a question, it gets embedded with the same model that embedded the chunks. Now the question and every chunk live in the same vector space, so "closeness" between vectors means "similar meaning." The retriever pulls the top matches — Dossier AI defaults to the five nearest chunks.',
      },
      {
        type: 'quote',
        text: 'Semantic search is the whole trick: "What was the termination notice period?" can match a clause that never uses the word "termination," because the meanings are close even when the words are not.',
      },
      {
        type: 'h2',
        text: 'Step 3: Generation',
      },
      {
        type: 'p',
        text: 'The retrieved chunks are stitched into a prompt along with your question and an instruction: answer using only the provided context, and say so if the answer is not there. The model then writes a response that stays anchored to your document instead of guessing.',
      },
      {
        type: 'p',
        text: 'Every answer in the Ask view comes back with its source chunks and a similarity score, so you can click through and check the model against the original text.',
      },
      {
        type: 'h2',
        text: 'Why not just paste the whole document?',
      },
      {
        type: 'ul',
        items: [
          'Cost and speed: sending 80 pages on every question is slow and expensive; sending 5 chunks is neither.',
          'Accuracy: models get distracted by long, mostly-irrelevant context. A tight, relevant prompt produces better answers.',
          'Scale: retrieval works the same whether you have one document or a thousand.',
        ],
      },
      {
        type: 'h2',
        text: 'Where it can go wrong',
      },
      {
        type: 'ul',
        items: [
          'If the answer is spread across many chunks, the top 5 may miss part of it.',
          'Bad chunking (splitting mid-table, for example) produces passages that are hard to retrieve or read.',
          'If nothing relevant is retrieved, a well-built system says "I could not find this" rather than inventing an answer.',
        ],
      },
      {
        type: 'p',
        text: 'RAG is not magic — it is search plus a careful prompt. But it is the most reliable way to get a language model to answer questions about text it has never seen before.',
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
