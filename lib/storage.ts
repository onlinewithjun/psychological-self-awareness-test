import "client-only";

import type { AssessmentDraft, SessionRecord, StoryDraft } from "@/lib/types";

const HISTORY_KEY = "xiangdu-history";
const DRAFT_KEY = "xiangdu-draft";
const STORY_DRAFT_KEY = "xiangdu-story-draft";
const STORAGE_EVENT = "xiangdu-storage-change";

type CacheEntry<T> = {
  raw: string | null;
  parsed: T;
};

const draftCache: CacheEntry<AssessmentDraft | null> = {
  raw: null,
  parsed: null,
};

const historyCache: CacheEntry<SessionRecord[]> = {
  raw: null,
  parsed: [],
};

const storyDraftCache: CacheEntry<StoryDraft | null> = {
  raw: null,
  parsed: null,
};

function readJson<T>(
  key: string,
  fallback: T,
  cache: CacheEntry<T>,
): T {
  if (typeof window === "undefined") {
    return cache.parsed ?? fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (cache.raw === raw) {
    return cache.parsed;
  }

  try {
    const parsed = raw ? (JSON.parse(raw) as T) : fallback;
    cache.raw = raw;
    cache.parsed = parsed;
    return parsed;
  } catch {
    cache.raw = raw;
    cache.parsed = fallback;
    return fallback;
  }
}

function emitStorageChange(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function writeJson<T>(key: string, value: T, cache: CacheEntry<T>) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = JSON.stringify(value);
  window.localStorage.setItem(key, raw);
  cache.raw = raw;
  cache.parsed = value;
  emitStorageChange(key);
}

export function loadDraft() {
  return readJson<AssessmentDraft | null>(DRAFT_KEY, null, draftCache);
}

export function saveDraft(draft: AssessmentDraft) {
  writeJson(DRAFT_KEY, draft, draftCache);
}

export function clearDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DRAFT_KEY);
  draftCache.raw = null;
  draftCache.parsed = null;
  emitStorageChange(DRAFT_KEY);
}

export function loadHistory() {
  return readJson<SessionRecord[]>(HISTORY_KEY, [], historyCache);
}

export function saveHistory(history: SessionRecord[]) {
  writeJson(HISTORY_KEY, history, historyCache);
}

export function storeSession(session: SessionRecord) {
  const history = loadHistory();
  const deduped = history.filter((item) => item.id !== session.id);
  saveHistory([session, ...deduped].slice(0, 12));
}

export function getSessionById(sessionId: string) {
  return loadHistory().find((item) => item.id === sessionId) ?? null;
}

export function loadStoryDraft() {
  return readJson<StoryDraft | null>(STORY_DRAFT_KEY, null, storyDraftCache);
}

export function saveStoryDraft(draft: StoryDraft) {
  writeJson(STORY_DRAFT_KEY, draft, storyDraftCache);
}

export function clearStoryDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORY_DRAFT_KEY);
  storyDraftCache.raw = null;
  storyDraftCache.parsed = null;
  emitStorageChange(STORY_DRAFT_KEY);
}

export function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onStoreChange();
  const customHandler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, customHandler as EventListener);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, customHandler as EventListener);
  };
}
