import { useState, useEffect, useCallback } from 'react';
import {
  SearchButton,
  SearchProvider,
  useSearch,
  type SearchResult,
  Icon,
} from '@mintlify/components';
import { navigate } from 'astro:transitions/client';
import { useDebouncedCallback } from 'use-debounce';

const SEARCH_OPEN_EVENT = 'open-search';

type SearchIndexItem = {
  path: string;
  title: string;
  description: string;
  icon: string;
  breadcrumbs: string[];
  content?: string;
  snippet?: string;
};

const SITE_ID = import.meta.env.PUBLIC_SITE_ID ?? 'docfiy-ornek';
const SEARCH_API = import.meta.env.PUBLIC_SEARCH_API_URL ?? '/api/search';

export function openSearch() {
  window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT));
}

function SearchEventListener() {
  const search = useSearch();

  useEffect(() => {
    const handleOpen = () => search?.open();
    window.addEventListener(SEARCH_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, handleOpen);
  }, [search]);

  return null;
}

const normalizePath = (path: string | undefined): string => {
  if (!path) return '/';
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.endsWith('index')) {
    normalized = normalized.replace('index', '');
  }
  return normalized;
};

const SEARCH_HISTORY_KEY = 'docfiy-search-history';
const MAX_HISTORY_ITEMS = 5;
const DEBOUNCE_DELAY_IN_MS = 100;

function scoreItem(item: SearchIndexItem, query: string): number {
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const path = item.path.toLowerCase();
  const content = (item.content ?? '').toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (path.includes(q)) return 40;
  if (description.includes(q)) return 30;
  if (content.includes(q)) return 20;
  return 0;
}

function toSearchResult(item: SearchIndexItem, index: number): SearchResult {
  const preview = item.snippet || item.description;
  return {
    id: item.path || `result-${index}`,
    header: item.title,
    content: preview,
    link: normalizePath(item.path),
    metadata: {
      title: item.title,
      description: preview,
      breadcrumbs: item.breadcrumbs,
      iconName: item.icon || 'hashtag',
    },
  };
}

export function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load search history:', err);
    }

    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => setSearchIndex(data))
      .catch((err) => console.error('Failed to load search index:', err));
  }, []);

  const searchLocally = useCallback(
    (searchQuery: string) => {
      const q = searchQuery.trim().toLowerCase();
      return searchIndex
        .map((item) => ({ item, score: scoreItem(item, q) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(({ item }, index) => toSearchResult(item, index));
    },
    [searchIndex],
  );

  const performSearch = useCallback(
    async (searchQuery: string) => {
      setIsLoading(true);
      const q = searchQuery.trim();

      try {
        const response = await fetch(SEARCH_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, siteId: SITE_ID }),
        });

        if (response.ok) {
          const data = (await response.json()) as { results?: SearchIndexItem[] };
          if (Array.isArray(data.results)) {
            setResults(data.results.map((item, index) => toSearchResult(item, index)));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API search unavailable, using local index:', err);
      }

      setResults(searchLocally(q));
      setIsLoading(false);
    },
    [searchLocally],
  );

  const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
    performSearch(searchQuery);
  }, DEBOUNCE_DELAY_IN_MS);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        debouncedSearch.cancel();
        setResults([]);
        setIsLoading(false);
        return;
      }

      setResults([]);
      setIsLoading(true);
      debouncedSearch(searchQuery);
    },
    [debouncedSearch],
  );

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.link);

    try {
      const newHistory = [
        result,
        ...recentSearches.filter((item) => item.id !== result.id),
      ].slice(0, MAX_HISTORY_ITEMS);

      setRecentSearches(newHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  };

  const addIconsToResults = (items: SearchResult[]): SearchResult[] => {
    return items.map((item) => {
      const iconName = item.metadata?.iconName || 'hashtag';
      return {
        ...item,
        icon: <Icon icon={iconName} size={16} color="gray" />,
      };
    });
  };

  if (!mounted) {
    return <SearchButton />;
  }

  return (
    <SearchProvider
      searchProps={{
        onSearch: handleSearch,
        results: addIconsToResults(results),
        isLoading,
        onSelectResult: handleSelectResult,
        recentSearches: addIconsToResults(recentSearches),
      }}
    >
      <SearchEventListener />
      <SearchButton />
    </SearchProvider>
  );
}
