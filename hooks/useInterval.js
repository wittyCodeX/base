import { useEffect } from 'react'

export default function useInterval(
  callback,
  delay,
  leading = true
) {
  useEffect(() => {
    if (delay === null) {
      return;
    }

    let timeout;
    tick(delay, /* skip= */ !leading);
    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };

    async function tick(delay, skip = false) {
      if (!skip) {
        const promise = callback();

        // Defer the next interval until the current callback has resolved.
        if (promise) await promise;
      }

      timeout = setTimeout(() => tick(delay), delay);
    }
  }, [callback, delay, leading]);
}
