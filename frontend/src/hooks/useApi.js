import { useEffect, useState } from 'react';
import { api } from '../utils/api';

/**
 * Fetches a paginated (or plain array) list endpoint.
 * Automatically unwraps `{results: [...]}` so callers just get an array.
 * Pass `{ auth: true }` for endpoints that require the current user's
 * access token (e.g. "my appointments").
 */
export function useApiList(path, params, { enabled = true, auth = false } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params || {});

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get(path, params, { auth })
      .then((res) => {
        if (!active) return;
        setData(Array.isArray(res) ? res : res?.results || []);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, paramsKey, enabled, auth]);

  return { data, loading, error };
}

/** Fetches a single-resource detail endpoint (e.g. /doctors/{slug}/). */
export function useApiDetail(path, { enabled = true, auth = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !path) return undefined;
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get(path, undefined, { auth })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, enabled, auth]);

  return { data, loading, error };
}
