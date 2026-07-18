import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Work from "./components/Work";
import Quote from "./components/Quote";
import Footer from "./components/Footer";
import CaseStudyPaywall from "./pages/CaseStudyPaywall";
import AboutMe from "./pages/AboutMe";
import PreviewMotion from "./pages/PreviewMotion";
import PreviewFuturistic from "./pages/PreviewFuturistic";
import PreviewSand from "./pages/PreviewSand";
import PreviewTexture from "./pages/PreviewTexture";
import PreviewVine from "./pages/PreviewVine";
import PreviewLeaf from "./pages/PreviewLeaf";
import PreviewWorkRows from "./pages/PreviewWorkRows";
import PreviewWorkStack from "./pages/PreviewWorkStack";
import { skills } from "./data/content";

function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={skills} />
      <Work />
      <Quote />
    </main>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const isPreview = pathname.startsWith("/preview/");

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      {!isPreview && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/work/paywall-experiments" element={<CaseStudyPaywall />} />
        <Route path="/preview/motion" element={<PreviewMotion />} />
        <Route path="/preview/futuristic" element={<PreviewFuturistic />} />
        <Route path="/preview/sand" element={<PreviewSand />} />
        <Route path="/preview/texture" element={<PreviewTexture />} />
        <Route path="/preview/vine" element={<PreviewVine />} />
        <Route path="/preview/leaf" element={<PreviewLeaf />} />
        <Route path="/preview/work-rows" element={<PreviewWorkRows />} />
        <Route path="/preview/work-stack" element={<PreviewWorkStack />} />
      </Routes>
      {!isPreview && <Footer />}
    </>
  );
}

export default App;
