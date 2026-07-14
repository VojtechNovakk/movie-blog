"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";

type Movie = {
  movie_id: number;
  name: string;
  director: string;
  length: number;
  review: string;
  date: string;
  poster: string;
  cinema_name: string;
  cinema_website: string;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function MovieViewer({ movies }: { movies: Movie[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // useMemo = přepočítá filtrovaný seznam JEN když se změní searchQuery nebo movies
  const filteredMovies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return movies; // prázdný dotaz = všechny filmy
    return movies.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    );
  }, [movies, searchQuery]);

  const stageRef = useRef<HTMLDivElement>(null);
  const posterContainerRef = useRef<HTMLDivElement>(null);
  const posterImgRef = useRef<HTMLImageElement>(null);
  const mainStarsRef = useRef<HTMLDivElement>(null);
  const mainMetaRef = useRef<HTMLDivElement>(null);
  const mainReviewRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const wheelState = useRef({
    rotation: 0,
    activeIndex: -1,
    dragStartX: 0,
    startRotation: 0,
    dragging: false,
    dragged: false,
    animId: null as number | null,
    target: 0,
    cards: [] as HTMLDivElement[],
    items: [] as Movie[],
  });

  const norm = useCallback((a: number) => {
    return (((a + 180) % 360) + 360) % 360 - 180;
  }, []);

  useEffect(() => {
    if (!filteredMovies || filteredMovies.length === 0) {
      // Pokud hledání nic nenajde, vyčistíme wheel
      const stage = stageRef.current;
      if (stage) stage.innerHTML = "";
      return;
    }

    const items = filteredMovies;
    const N = items.length;
    const STEP = 11;
    const R = 750;
    const ROT_MAX = 0;
    const ROT_MIN = -(N - 1) * STEP;

    const stage = stageRef.current!;
    const posterContainer = posterContainerRef.current!;
    const posterImg = posterImgRef.current!;
    const mainStars = mainStarsRef.current!;
    const mainMeta = mainMetaRef.current!;
    const mainReview = mainReviewRef.current!;

    const ws = wheelState.current;
    ws.items = items;
    ws.rotation = 0;
    ws.activeIndex = -1;

    // Build ticket DOM elements
    stage.innerHTML = "";
    ws.cards = items.map((f, i) => {
      const el = document.createElement("div");
      // Ticket: Tailwind classes + .ticket for JS targeting
      el.className =
        "ticket absolute top-0 left-0 w-[160px] h-[280px] drop-shadow-[0_6px_12px_rgba(0,0,0,0.06)] transition-[filter] duration-300";
      el.innerHTML = `
        <div class="ticket-inner w-full h-full bg-white flex flex-col">
          <div class="ticket-top h-[170px] py-6 px-3.5 flex flex-col justify-center items-center text-center">
            <div class="font-bebas text-[26px] font-normal leading-[1.05] text-black mb-3 tracking-[0.5px] line-clamp-3">${f.name}</div>
            <div class="text-[11px] text-[#444] mb-1.5 tracking-[0.5px] uppercase">dir. <b class="text-black font-bold">${f.director}</b></div>
            <div class="text-[11px] text-[#777] font-mono">${formatDuration(f.length)}</div>
          </div>
          <div class="h-0 w-[85%] mx-auto border-t-2 border-dotted border-black/18 z-[2]"></div>
          <div class="flex-1 flex flex-col justify-center items-center pb-1">
            <div class="text-base text-black font-bold tracking-[2px] font-mono">NO. ${String(N - i).padStart(3, "0")}</div>
          </div>
        </div>
      `;
      el.addEventListener("click", () => {
        if (!ws.dragged) animateTo(-i * STEP);
      });
      stage.appendChild(el);
      return el;
    });

    // --- updateSpotlight ---
    function updateSpotlight(index: number) {
      if (ws.activeIndex === index) return;
      ws.activeIndex = index;
      const f = ws.items[index];

      mainStars.classList.remove("visible");
      mainMeta.classList.remove("visible");
      mainReview.classList.remove("visible");

      setTimeout(() => {
        mainReview.innerHTML = `<div class="review-text">${f.review}</div>`;
        mainStars.innerHTML = "★★★★☆";
        mainMeta.innerHTML = `Watched on ${new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<br>@ <a href="${f.cinema_website}" target="_blank">${f.cinema_name}</a>`;

        posterImg.src = f.poster;

        if (posterContainer) {
          posterContainer.style.setProperty("--glow-color", "transparent");
        }

        const scrollContainer = mainReview;
        if (scrollContainer) scrollContainer.scrollTop = 0;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mainStars.classList.add("visible");
            mainMeta.classList.add("visible");
            mainReview.classList.add("visible");
          });
        });
      }, 400);
    }

    // --- render ---
    function render() {
      const w = stage.clientWidth;
      const px = w / 2;
      const py = stage.clientHeight + 480;

      let bestI = 0;
      let bestAbs = 999;

      const angles = ws.cards.map((_el, i) => {
        const a =
          (((i * STEP + ws.rotation + 180) % 360) + 360) % 360 - 180;
        const abs = Math.abs(a);
        if (abs < bestAbs) {
          bestAbs = abs;
          bestI = i;
        }
        return a;
      });

      angles.forEach((a, i) => {
        const abs = Math.abs(a);
        const rad = (a * Math.PI) / 180;
        const x = px + R * Math.sin(rad) - 80;
        const y = py - R * Math.cos(rad) - 70;

        let scale = Math.max(0.6, 1 - abs / 180);
        if (i === bestI) scale *= 1.22;

        const opacity = abs > 90 ? 0 : Math.max(0.1, 1 - abs / 85);

        ws.cards[i].style.transform = `translate(${x}px, ${y}px) rotate(${a}deg) scale(${scale})`;
        ws.cards[i].style.opacity = String(opacity);
        ws.cards[i].style.zIndex = String(Math.round(1000 - abs));

        if (i === bestI) {
          ws.cards[i].classList.add("is-active");
        } else {
          ws.cards[i].classList.remove("is-active");
        }
      });

      updateSpotlight(bestI);
    }

    function clampRot(v: number) {
      return Math.min(ROT_MAX, Math.max(ROT_MIN, v));
    }

    function animateTo(t: number) {
      ws.target = clampRot(t);
      if (ws.animId) return;

      const step = () => {
        ws.rotation += (ws.target - ws.rotation) * 0.15;
        render();
        if (Math.abs(ws.target - ws.rotation) > 0.15) {
          ws.animId = requestAnimationFrame(step);
        } else {
          ws.rotation = ws.target;
          render();
          ws.animId = null;
        }
      };
      ws.animId = requestAnimationFrame(step);
    }

    // --- Pointer / Drag ---
    const onPointerDown = (e: PointerEvent) => {
      ws.dragging = true;
      ws.dragged = false;
      ws.dragStartX = e.clientX;
      ws.startRotation = ws.rotation;
      stage.setPointerCapture(e.pointerId);
      if (ws.animId) {
        cancelAnimationFrame(ws.animId);
        ws.animId = null;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!ws.dragging) return;
      const dx = e.clientX - ws.dragStartX;
      if (Math.abs(dx) > 5) ws.dragged = true;
      const raw = ws.startRotation + dx * 0.3;

      if (raw > ROT_MAX) ws.rotation = ROT_MAX + (raw - ROT_MAX) * 0.3;
      else if (raw < ROT_MIN) ws.rotation = ROT_MIN + (raw - ROT_MIN) * 0.3;
      else ws.rotation = raw;

      render();
    };

    const onPointerUp = () => {
      ws.dragging = false;
      animateTo(Math.round(ws.rotation / STEP) * STEP);
    };

    let wheelTimeout: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (ws.animId) {
        cancelAnimationFrame(ws.animId);
        ws.animId = null;
      }
      ws.rotation = clampRot(ws.rotation + e.deltaY * 0.15);
      render();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        animateTo(Math.round(ws.rotation / STEP) * STEP);
      }, 150);
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", render);

    render();

    return () => {
      if (stage) {
        stage.removeEventListener("pointerdown", onPointerDown);
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerup", onPointerUp);
        stage.removeEventListener("wheel", onWheel);
      }
      window.removeEventListener("resize", render);
      if (ws.animId) cancelAnimationFrame(ws.animId);
    };
  }, [filteredMovies, norm]);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    let cursorRafId: number;

    if (
      window.matchMedia("(pointer: fine)").matches &&
      cursorDot &&
      cursorRing
    ) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      };

      const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        cursorRafId = requestAnimationFrame(renderCursor);
      };

      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(".ticket") ||
          target.closest("input") ||
          target.closest(".poster-container") ||
          target.closest("a")
        ) {
          cursorDot.classList.add("hover");
          cursorRing.classList.add("hover");
        }
      };

      const onMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(".ticket") ||
          target.closest("input") ||
          target.closest(".poster-container") ||
          target.closest("a")
        ) {
          cursorDot.classList.remove("hover");
          cursorRing.classList.remove("hover");
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseover", onMouseOver);
      document.body.addEventListener("mouseout", onMouseOut);
      cursorRafId = requestAnimationFrame(renderCursor);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseover", onMouseOver);
        document.body.removeEventListener("mouseout", onMouseOut);
        cancelAnimationFrame(cursorRafId);
      };
    }
  }, []);

  if (!movies || movies.length === 0) {
    return (
      <div className="p-20 text-center text-[#888]">
        No movies found. Add some via the admin panel.
      </div>
    );
  }

  return (
    <>
      {/* Film Grain */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[9999] opacity-[0.035] animate-[grain_1s_steps(2)_infinite] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.75%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      {/* Custom Cursor */}
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed top-0 left-0 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black transition-[width,height,opacity] duration-200"
      ></div>
      <div
        ref={cursorRingRef}
        className="cursor-ring fixed top-0 left-0 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-black/25 transition-[width,height,border-color,background-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      ></div>

      {/* Header */}
      <header className="w-full pt-10 flex justify-center relative z-10 shrink-0">
        <div className="flex flex-col items-center gap-5 w-full max-w-[400px]">
          <div className="text-sm font-bold tracking-[8px] uppercase text-black">
            FilmFilm
          </div>
          <div className="w-full px-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f5] backdrop-blur-[10px] border border-[#ccc] rounded-full py-3 px-6 font-sans text-base text-black outline-none transition-all duration-300 text-center appearance-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] placeholder:text-[#888] placeholder:tracking-[0.5px] placeholder:font-normal focus:border-black focus:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus:bg-white"
              placeholder="Search a masterpiece..."
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center items-center relative z-[5] pb-[min(240px,30vh)] min-h-0">
        {filteredMovies.length === 0 ? (
          <div className="text-center text-[#888] text-lg">
            No movies match your search.
          </div>
        ) : (
          <>
            <div className="content-wrapper flex items-center justify-center gap-[clamp(40px,8vw,80px)] w-full max-w-[1200px] min-h-0">
              {/* Poster */}
              <div
                className="poster-container aspect-[2/3] max-w-[320px] h-[min(420px,50vh)] rounded-[4px] overflow-hidden transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-[#f9f9f9] shrink-0 relative hover:scale-[1.03] hover:-translate-y-2.5"
                ref={posterContainerRef}
              >
                <img
                  ref={posterImgRef}
                  src={filteredMovies[0]?.poster}
                  alt="Movie Poster"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Review */}
              <div className="review-section w-[560px] h-[min(420px,50vh)] flex flex-col">
                <div
                  className="stagger-item text-xl tracking-[6px] mb-3 text-black shrink-0 pt-2.5"
                  id="main-stars"
                  ref={mainStarsRef}
                ></div>
                <div
                  className="review-meta stagger-item font-mono text-[10px] uppercase text-[#777] mb-6 tracking-[0.5px]"
                  id="main-meta"
                  ref={mainMetaRef}
                ></div>
                <div
                  className="review-content stagger-item max-h-full overflow-y-auto pr-6 pb-5 flex flex-col"
                  id="main-review"
                  ref={mainReviewRef}
                ></div>
              </div>
            </div>

            {/* Wheel */}
            <div
              className="wheel-stage fixed bottom-0 left-0 w-full h-[320px] touch-pan-y select-none outline-none z-20"
              ref={stageRef}
            ></div>
          </>
        )}
      </main>
    </>
  );
}
