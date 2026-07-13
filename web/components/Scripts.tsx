'use client';
import { useEffect } from 'react';

export default function Scripts() {
  useEffect(() => {
    // language toggle (visual)
    const lt = document.getElementById('langtog');
    const onLang = () => {
      const b = lt?.querySelector('b');
      if (lt) lt.innerHTML = b && b.textContent === 'FR' ? 'FR \u00b7 <b>EN</b>' : '<b>FR</b> \u00b7 EN';
    };
    lt?.addEventListener('click', onLang);

    // scroll reveal
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

    // custom cursor
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let raf = 0;
    const c = document.getElementById('cursor');
    if (fine && !rm && c) {
      let cx = 0, cy = 0, tx = 0, ty = 0;
      const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); };
      document.addEventListener('mousemove', move);
      const loop = () => {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
        raf = requestAnimationFrame(loop);
      };
      loop();
      const grow = () => c.classList.add('grow');
      const shrink = () => c.classList.remove('grow');
      const hov = document.querySelectorAll('a,button,[data-hover],.cx,.wk,.eco a');
      hov.forEach((el) => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink); });
      return () => {
        document.removeEventListener('mousemove', move);
        cancelAnimationFrame(raf);
        hov.forEach((el) => { el.removeEventListener('mouseenter', grow); el.removeEventListener('mouseleave', shrink); });
        lt?.removeEventListener('click', onLang);
        obs.disconnect();
      };
    }
    return () => { lt?.removeEventListener('click', onLang); obs.disconnect(); };
  }, []);
  return null;
}
