import { useEffect } from 'react'

export default function useAutoResize(deps = []) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const els = document.querySelectorAll('.auto-resize');
    els.forEach((el) => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    });
  }, deps);

  function autoResize(e) {
    const el = e.target;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  return autoResize;
}
