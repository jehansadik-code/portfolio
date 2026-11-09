"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/scene/hero-scene"), { ssr: false, loading: () => <div className="hero-webgl-fallback" aria-hidden="true"><span /><span /><span /></div> });

export function HeroWebGL() {
  return <div className="hero-webgl" aria-hidden="true"><HeroScene /></div>;
}
