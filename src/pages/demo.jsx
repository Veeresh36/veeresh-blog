/**
 * ReadBlog.jsx — Production-grade blog reader
 * Stack: React + Tailwind CSS + ReactMarkdown
 *
 * Features:
 *  - 10/10 SEO (JSON-LD BlogPosting + BreadcrumbList + FAQPage, canonical, OG, Twitter, prev/next link tags)
 *  - Dark / light mode with localStorage persistence
 *  - Reading-progress bar + SmartTOC with per-section progress
 *  - Focus / reading mode (hides sidebar + ads)
 *  - AI text-to-speech (ElevenLabs + Claude narration → browser TTS fallback)
 *  - Text-selection toolbar: copy + highlight (saved to localStorage)
 *  - Emoji reaction bar (optimistic local + optional Supabase backend)
 *  - Key-Takeaways box, FAQ accordion (schema-ready), AI Summary card
 *  - Floating share bar (WhatsApp, Telegram, Facebook, LinkedIn, Instagram copy)
 *  - Pinterest deep-link button per post
 *  - Affiliate product cards
 *  - Reading streak badge + "Finish by HH:MM" badge
 *  - Comment section (Supabase)
 *  - Prev / Next post navigation
 *  - Related posts grid
 *  - View count (Supabase RPC)
 *  - Bookmark (localStorage)
 *  - Scroll-to-top FAB
 *  - Full footer with social links
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// ═══════════════════════════════════════════════════════
//  SITE CONFIG  — edit these values
// ═══════════════════════════════════════════════════════
const SITE = {
  name:         "Veeresh Bashetti",
  tagline:      "Life, Growth & The Journey",
  pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
  email:        "veeresh.b.bashetti@gmail.com",
  baseUrl:      "https://veereshbashetti.com",
  locale:       "en_IN",
};

const ADSENSE_CLIENT   = "ca-pub-XXXXXXXXXXXXXXXX"; // replace with your ID
const SUPABASE_URL     = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_URL     : "";
const SUPABASE_ANON_KEY= typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_ANON_KEY: "";

const TOC_EMOJIS   = ["📌","💡","📊","🔥","🧠","✨","🚀","🎯","📝","⚡"];
const REACTIONS    = ["❤️","🔥","💡","🤔"];
const REACTION_LBL = { "❤️":"Love","🔥":"Fire","💡":"Insightful","🤔":"Thoughtful" };

// ═══════════════════════════════════════════════════════
//  FRONTMATTER PARSER
// ═══════════════════════════════════════════════════════
function parseFrontmatter(raw) {
  const src = raw.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  const m   = src.match(/^\s*---\s*\n([\s\S]*?)\n---\s*/);
  if (!m) return { data:{}, content:src };

  const yaml    = m[1];
  const content = src.slice(m[0].length).trim();
  const data    = {};
  const lines   = yaml.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const keyOnly = line.match(/^([\w-]+):\s*$/);
    if (keyOnly) {
      const key = keyOnly[1]; i++;
      const items = [];
      while (i < lines.length) {
        const il = lines[i];
        if (il.match(/^[\w-]+:\s/) || il.match(/^[\w-]+:\s*$/)) break;
        if (il.match(/^\s{0,4}-\s/)) {
          const v = il.replace(/^\s*-\s*/,"").trim();
          if (v.includes(":")) {
            const obj={};
            const ci=v.indexOf(":");
            obj[v.slice(0,ci).trim()]=v.slice(ci+1).trim().replace(/^["']|["']$/g,"");
            i++;
            while(i<lines.length){
              const sub=lines[i];
              if(!sub.match(/^\s{2,}[\w-]+:\s/)) break;
              const sc=sub.indexOf(":");
              obj[sub.slice(0,sc).trim()]=sub.slice(sc+1).trim().replace(/^["']|["']$/g,"");
              i++;
            }
            items.push(obj);
          } else { items.push(v.replace(/^["']|["']$/g,"")); i++; }
        } else i++;
      }
      data[key]=items.length?items:"";
      continue;
    }
    const ci=line.indexOf(":");
    if(ci===-1){i++;continue;}
    const key=line.slice(0,ci).trim();
    let   val=line.slice(ci+1).trim().replace(/^["']|["']$/g,"").trim();
    if(val==="true") val=true; else if(val==="false") val=false;
    data[key]=val; i++;
  }
  return { data, content };
}

// ═══════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════
const slugToId = t =>
  String(t).toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();

const formatDate = d => {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}); }
  catch { return d; }
};

const estimateReadTime = text => Math.max(1, Math.round(text.trim().split(/\s+/).length / 238));

const normalizeTags = tags => {
  if (!Array.isArray(tags)) return [];
  return tags.map(t=>{
    if(typeof t==="string") return t.trim();
    if(t&&typeof t==="object"){ const k=Object.keys(t)[0]; return k?String(k).trim():null; }
    return null;
  }).filter(Boolean);
};

const buildTOC = md =>
  md.split("\n").filter(l=>l.match(/^## /)).map((l,i)=>{
    const label = l.replace(/^## /,"").trim();
    const id    = slugToId(label);
    return { id, label, emoji: TOC_EMOJIS[i%TOC_EMOJIS.length] };
  });

// ═══════════════════════════════════════════════════════
//  HOOKS
// ═══════════════════════════════════════════════════════
function useReadingProgress() {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const fn=()=>{
      const doc=document.documentElement;
      const tot=doc.scrollHeight-doc.clientHeight;
      setP(tot>0?Math.round((doc.scrollTop/tot)*100):0);
    };
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  return p;
}

function useActiveTOC(items) {
  const [activeId,setActiveId]=useState(items[0]?.id||"");
  const [secPct,setSecPct]=useState({});
  useEffect(()=>{
    if(!items.length) return;
    const obs=new IntersectionObserver(
      entries=>entries.forEach(e=>{if(e.isIntersecting) setActiveId(e.target.id);}),
      {rootMargin:"-15% 0px -70% 0px"}
    );
    document.querySelectorAll("h2[id]").forEach(h=>obs.observe(h));
    const calc=()=>{
      const ids=items.map(t=>t.id);
      const res={};
      ids.forEach((id,i)=>{
        const el=document.getElementById(id); if(!el) return;
        const next=i<ids.length-1?document.getElementById(ids[i+1]):null;
        const top=el.getBoundingClientRect().top+window.scrollY;
        const bot=next?next.getBoundingClientRect().top+window.scrollY:document.documentElement.scrollHeight;
        const scrolled=window.scrollY+window.innerHeight*0.2-top;
        res[id]=Math.min(100,Math.max(0,(scrolled/(bot-top))*100));
      });
      setSecPct(res);
    };
    window.addEventListener("scroll",calc,{passive:true});
    calc();
    return ()=>{ obs.disconnect(); window.removeEventListener("scroll",calc); };
  },[items]);
  return { activeId, secPct };
}

function useDarkMode() {
  const [dark,setDark]=useState(()=>{
    if(typeof window==="undefined") return false;
    const s=localStorage.getItem("blog-theme");
    if(s) return s==="dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",dark?"dark":"light");
    localStorage.setItem("blog-theme",dark?"dark":"light");
  },[dark]);
  return [dark,()=>setDark(d=>!d)];
}

function useFontSize() {
  const [sz,setSz]=useState(17);
  return [sz,()=>setSz(s=>Math.min(s+1,21)),()=>setSz(s=>Math.max(s-1,14))];
}

function useScrollToTop() {
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>600);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  return show;
}

function useFadeIn(delay=0) {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    el.style.opacity="0"; el.style.transform="translateY(16px)";
    el.style.transition=`opacity .5s ease ${delay}ms,transform .5s ease ${delay}ms`;
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){el.style.opacity="1";el.style.transform="none";obs.unobserve(el);}
    },{threshold:0.06});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[delay]);
  return ref;
}

function useSelectionToolbar() {
  const [tip,setTip]=useState(null);
  useEffect(()=>{
    const up=()=>{
      const sel=window.getSelection();
      if(!sel||sel.isCollapsed||sel.toString().trim().length<3){setTip(null);return;}
      const r=sel.getRangeAt(0); const rect=r.getBoundingClientRect();
      setTip({text:sel.toString().trim(),x:rect.left+rect.width/2,y:rect.top+window.scrollY-52});
    };
    const dn=e=>{if(!e.target.closest("[data-sel-toolbar]")) setTip(null);};
    document.addEventListener("mouseup",up);
    document.addEventListener("mousedown",dn);
    return ()=>{ document.removeEventListener("mouseup",up); document.removeEventListener("mousedown",dn); };
  },[]);
  return [tip,setTip];
}

function useReadingStreak() {
  const [streak,setStreak]=useState(0);
  useEffect(()=>{
    const today=new Date().toDateString();
    const stored=JSON.parse(localStorage.getItem("reading-streak")||"{}");
    const last=stored.lastDate||"", count=stored.count||0;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    if(last===today){ setStreak(count); }
    else if(last===yesterday){ const n=count+1; localStorage.setItem("reading-streak",JSON.stringify({lastDate:today,count:n})); setStreak(n); }
    else { localStorage.setItem("reading-streak",JSON.stringify({lastDate:today,count:1})); setStreak(1); }
  },[]);
  return streak;
}

function useReadingMode() {
  const [on,setOn]=useState(false);
  useEffect(()=>{
    document.documentElement.setAttribute("data-rm",on?"on":"off");
    return ()=>document.documentElement.removeAttribute("data-rm");
  },[on]);
  return [on,()=>setOn(o=>!o)];
}

function useFinishTime(readTime,progress) {
  return useMemo(()=>{
    if(!readTime||progress>=100) return null;
    const remaining=Math.max(0,readTime*(1-progress/100));
    const fin=new Date(Date.now()+remaining*60000);
    return fin.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  },[readTime,progress]);
}

function useHighlights(slug) {
  const [hl,setHl]=useState(()=>{ try{return JSON.parse(localStorage.getItem(`hl:${slug}`)||"[]");}catch{return [];} });
  const save=useCallback(text=>{
    setHl(prev=>{
      if(prev.find(h=>h.text===text)) return prev;
      const next=[{id:Date.now(),text,date:new Date().toISOString()},...prev].slice(0,20);
      localStorage.setItem(`hl:${slug}`,JSON.stringify(next)); return next;
    });
  },[slug]);
  const remove=useCallback(id=>{
    setHl(prev=>{
      const next=prev.filter(h=>h.id!==id);
      localStorage.setItem(`hl:${slug}`,JSON.stringify(next)); return next;
    });
  },[slug]);
  return {hl,save,remove};
}

function useReactions(slug) {
  const [counts,setCounts]=useState({});
  const [myVotes,setMyVotes]=useState(()=>{ try{return JSON.parse(localStorage.getItem(`rxn:${slug}`)||"{}");}catch{return {};} });
  const react=useCallback(emoji=>{
    if(myVotes[emoji]) return;
    const next={...myVotes,[emoji]:true};
    setMyVotes(next); localStorage.setItem(`rxn:${slug}`,JSON.stringify(next));
    setCounts(c=>({...c,[emoji]:(c[emoji]||0)+1}));
    if(!SUPABASE_URL||!SUPABASE_ANON_KEY) return;
    fetch(`${SUPABASE_URL}/rest/v1/reactions`,{method:"POST",headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({slug,emoji})}).catch(()=>{});
  },[slug,myVotes]);
  return {counts,myVotes,react};
}

function useViewCount(slug) {
  const [views,setViews]=useState(null);
  useEffect(()=>{
    if(!slug||!SUPABASE_URL||!SUPABASE_ANON_KEY) return;
    fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view`,{method:"POST",headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({p_slug:slug})}).then(r=>r.json()).then(n=>{if(typeof n==="number") setViews(n);}).catch(()=>{});
  },[slug]);
  return views;
}

function useSyncedSidebarScroll(containerRef,layoutRef) {
  useEffect(()=>{
    const container=containerRef.current, layout=layoutRef.current;
    if(!container||!layout) return;
    let raf=null;
    const sync=()=>{
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        if(window.innerWidth<1024) return;
        const lr=layout.getBoundingClientRect();
        const stickyTop=96;
        const total=lr.height-window.innerHeight+stickyTop;
        const scrolled=-lr.top+stickyTop;
        if(total<=0) return;
        const ratio=Math.min(1,Math.max(0,scrolled/total));
        const sh=container.scrollHeight-container.clientHeight;
        if(sh<=0) return;
        container.scrollTop=sh*ratio;
      });
    };
    window.addEventListener("scroll",sync,{passive:true});
    window.addEventListener("resize",sync,{passive:true});
    sync();
    return ()=>{ window.removeEventListener("scroll",sync); window.removeEventListener("resize",sync); if(raf) cancelAnimationFrame(raf); };
  },[containerRef,layoutRef]);
}

// ─── SEO Hook ─────────────────────────────────────────────────────────
function useSEO(fm, slug, content="", morePosts=[]) {
  useEffect(()=>{
    if(!fm.title) return;
    document.title=fm.seo?.title||`${fm.title} — ${SITE.name}`;
    const setMeta=(name,val,prop=false)=>{
      const attr=prop?"property":"name";
      let el=document.querySelector(`meta[${attr}="${name}"]`);
      if(!el){el=document.createElement("meta");el.setAttribute(attr,name);document.head.appendChild(el);}
      el.setAttribute("content",val);
    };
    const desc=fm.seo?.description||fm.description||fm.excerpt||"";
    const url=`${SITE.baseUrl}/blog/${slug}`;
    const img=fm.image||"";
    const words=content.trim().split(/\s+/).length;
    const mins=Math.max(1,Math.round(words/238));
    setMeta("description",desc);
    if(fm.seo?.keywords?.length) setMeta("keywords",fm.seo.keywords.join(", "));
    setMeta("og:type","article",true);setMeta("og:title",fm.title,true);setMeta("og:description",desc,true);
    setMeta("og:url",url,true);setMeta("og:site_name",SITE.name,true);setMeta("og:locale",SITE.locale,true);
    if(img) setMeta("og:image",img,true);
    if(fm.date) setMeta("article:published_time",fm.date,true);
    if(fm.author) setMeta("article:author",fm.author,true);
    normalizeTags(fm.tags).forEach(t=>setMeta("article:tag",t,true));
    setMeta("twitter:card","summary_large_image");setMeta("twitter:title",fm.title);setMeta("twitter:description",desc);
    if(img) setMeta("twitter:image",img);
    let can=document.querySelector('link[rel="canonical"]');
    if(!can){can=document.createElement("link");can.rel="canonical";document.head.appendChild(can);}
    can.href=url;
    ["prev","next"].forEach(r=>{const ex=document.querySelector(`link[rel="${r}"]`);if(ex)ex.remove();});
    const ci=morePosts.findIndex(p=>p.slug===slug);
    if(morePosts[ci-1]){const el=document.createElement("link");el.rel="prev";el.href=`${SITE.baseUrl}/blog/${morePosts[ci-1].slug}`;document.head.appendChild(el);}
    if(morePosts[ci+1]){const el=document.createElement("link");el.rel="next";el.href=`${SITE.baseUrl}/blog/${morePosts[ci+1].slug}`;document.head.appendChild(el);}
    const graph=[
      {"@type":"BlogPosting","@id":`${url}#article`,headline:fm.title,description:desc,image:img,datePublished:fm.date||"",dateModified:fm.date||"",
        author:{"@type":"Person",name:fm.author||SITE.name,url:SITE.baseUrl},
        publisher:{"@type":"Person",name:SITE.name,url:SITE.baseUrl},
        keywords:normalizeTags(fm.tags).join(", "),inLanguage:"en-IN",url,wordCount:words,timeRequired:`PT${mins}M`},
      {"@type":"BreadcrumbList",itemListElement:[
        {"@type":"ListItem",position:1,name:"Home",item:SITE.baseUrl},
        {"@type":"ListItem",position:2,name:"Blog",item:`${SITE.baseUrl}/#blog`},
        ...(fm.category?[{"@type":"ListItem",position:3,name:fm.category,item:`${SITE.baseUrl}/category/${fm.category?.toLowerCase().replace(/\s+/g,"-")}`}]:[]),
        {"@type":"ListItem",position:fm.category?4:3,name:fm.title,item:url},
      ]},
    ];
    if(Array.isArray(fm.faqs)&&fm.faqs.length){
      graph.push({"@type":"FAQPage",mainEntity:fm.faqs.map(({q,a})=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
    }
    let sc=document.getElementById("article-schema");
    if(!sc){sc=document.createElement("script");sc.id="article-schema";sc.type="application/ld+json";document.head.appendChild(sc);}
    sc.textContent=JSON.stringify({"@context":"https://schema.org","@graph":graph});
  },[fm,slug,content,morePosts]);
}

// ─── TTS Hook ──────────────────────────────────────────────────────────
const NARRATION_PROMPT=`You are converting a blog post into a warm, emotionally resonant spoken narration.
Rules:
- Write like an experienced Indian storyteller reading his own journal to a close friend
- Use natural spoken rhythm — short punchy sentences mixed with longer flowing ones
- Add breath pauses with commas and ellipses where a speaker would naturally pause
- Build emotion gradually: start grounded, rise toward the key insight, end with warmth
- Use "I" and personal language — this feels lived-in, not reported
- No markdown, no bullets, no headers — plain flowing prose only, max 200 words
- The listener should feel something, not just understand something
Blog content:`;

const VOICE_CONFIG={voiceId:"TX3LPaxmHKxFdv7VOQHJ",stability:0.30,similarity_boost:0.82,style:0.60,use_speaker_boost:true};

function useTextToSpeech(content) {
  const [speaking,setSpeaking]=useState(false);
  const [loading,setLoading]=useState(false);
  const [supported,setSupported]=useState(false);
  const audioRef=useRef(null);
  useEffect(()=>{setSupported(true);},[]);
  const stop=useCallback(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current.src="";audioRef.current=null;}
    window.speechSynthesis?.cancel();
    setSpeaking(false);setLoading(false);
  },[]);
  const rewrite=useCallback(async text=>{
    const ELEVENLABS_KEY = typeof import.meta !== "undefined" ? import.meta.env?.VITE_ELEVENLABS_API_KEY : "";
    if(!ELEVENLABS_KEY) throw new Error("No ElevenLabs key");
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`${NARRATION_PROMPT}\n\n${text.slice(0,3000)}`}]})});
    const d=await r.json();
    return d.content?.[0]?.text?.trim()||text;
  },[]);
  const speakEl=useCallback(async text=>{
    const ELEVENLABS_KEY = typeof import.meta !== "undefined" ? import.meta.env?.VITE_ELEVENLABS_API_KEY : "";
    if(!ELEVENLABS_KEY) throw new Error("No key");
    const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_CONFIG.voiceId}/stream`,{method:"POST",headers:{"xi-api-key":ELEVENLABS_KEY,"Content-Type":"application/json",Accept:"audio/mpeg"},body:JSON.stringify({text,model_id:"eleven_turbo_v2_5",voice_settings:{stability:VOICE_CONFIG.stability,similarity_boost:VOICE_CONFIG.similarity_boost,style:VOICE_CONFIG.style,use_speaker_boost:VOICE_CONFIG.use_speaker_boost}})});
    if(!r.ok){const e=await r.text();throw new Error(e);}
    const blob=await r.blob();
    const url=URL.createObjectURL(blob);
    const audio=new Audio(url);
    audioRef.current=audio;
    audio.onended=()=>{setSpeaking(false);URL.revokeObjectURL(url);};
    audio.onerror=()=>{setSpeaking(false);URL.revokeObjectURL(url);};
    await audio.play();setSpeaking(true);
  },[]);
  const speakFallback=useCallback(raw=>{
    const plain=raw.replace(/#{1,6}\s+/g,"").replace(/\*\*?([^*]+)\*\*?/g,"$1").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/`[^`]+`/g,"").replace(/^\s*[-*>]\s+/gm,"").slice(0,4000);
    const voices=window.speechSynthesis.getVoices();
    const voice=voices.find(v=>v.name.includes("Google UK English Male"))||voices.find(v=>v.name.includes("Daniel"))||voices.find(v=>v.lang==="en-IN")||voices.find(v=>v.lang.startsWith("en-"))||voices[0];
    const u=new SpeechSynthesisUtterance(plain);
    if(voice) u.voice=voice; u.rate=0.80; u.pitch=0.95; u.volume=1; u.lang="en-IN";
    u.onend=()=>setSpeaking(false);
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); setSpeaking(true);
  },[]);
  const toggle=useCallback(async()=>{
    if(!supported) return;
    if(speaking||loading){stop();return;}
    setLoading(true);
    try { const n=await rewrite(content); await speakEl(n); setLoading(false); }
    catch(err) { console.warn("ElevenLabs failed:",err); setLoading(false); speakFallback(content); }
  },[content,speaking,loading,supported,stop,rewrite,speakEl,speakFallback]);
  useEffect(()=>()=>stop(),[stop]);
  return {speaking,loading,supported,toggle};
}

// ═══════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════
const I = ({ d, size=18, cls="" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={cls} aria-hidden="true">
    <path d={d}/>
  </svg>
);

const PinIcon = ({ size=16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const SunIcon  = () => <I d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>;
const MoonIcon = () => <I d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>;
const ShareIcon= () => <I d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>;
const CopyIcon = () => <I d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4z" size={14}/>;
const CheckIcon= () => <I d="M20 6L9 17l-5-5" size={14}/>;
const ArrowUpIcon=()=> <I d="M18 15l-6-6-6 6"/>;
const BkIcon=({f})=>f?<svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>:<I d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={16}/>;

// ═══════════════════════════════════════════════════════
//  ADSENSE UNIT
// ═══════════════════════════════════════════════════════
const AdUnit = ({ slot, format="auto", responsive="true", style={}, className="" }) => {
  useEffect(()=>{ try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){} },[slot]);
  return (
    <div className={`ad-wrapper overflow-hidden clear-both my-6 text-center ${className}`}>
      <span className="block text-[0.57rem] tracking-[.18em] uppercase mb-1.5 font-semibold" style={{color:"#A8A09A"}}>— Advertisement —</span>
      <ins className="adsbygoogle block rounded-xl" style={{minHeight:"90px",...style}}
        data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot}
        data-ad-format={format} data-full-width-responsive={responsive}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  PROGRESS BAR
// ═══════════════════════════════════════════════════════
const ProgressBar = ({ pct }) => (
  <div className="fixed top-[68px] left-0 right-0 h-[3px] z-[99]" style={{background:"rgba(200,190,180,.25)"}} aria-hidden="true">
    <div className="h-full transition-[width] duration-75 ease-linear" style={{width:`${pct}%`,background:"linear-gradient(90deg,#E60023,#FF6B6B)"}}/>
  </div>
);

// ═══════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════
const Navbar = ({ dark, toggleDark, incFont, decFont, readingMode, toggleRM, content }) => {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [copied,setCopied]=useState(false);
  const {speaking,loading,supported,toggle:tts}=useTextToSpeech(content);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn,{passive:true}); return ()=>window.removeEventListener("scroll",fn);
  },[]);
  const share=async()=>{
    if(navigator.share){try{await navigator.share({title:document.title,url:window.location.href});}catch(_){}}
    else{await navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2000);}
  };

  const bdr={borderColor:dark?"rgba(255,255,255,.1)":"rgba(26,22,18,.12)"};
  const txt={color:dark?"#FAF8F4":"#3D3530"};
  const navBg={background:dark?"rgba(15,14,13,.93)":"rgba(250,248,244,.93)",backdropFilter:"blur(20px)",borderBottom:scrolled?`1px solid ${dark?"rgba(255,255,255,.06)":"rgba(26,22,18,.08)"}`:"1px solid transparent"};

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled?"shadow-sm":""}`} style={navBg}>
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight" style={{color:dark?"#FAF8F4":"#1A1612"}}>
            Veeresh<span style={{color:"#E60023"}}>.</span>
          </Link>
          <Link to="/blog" className="hidden md:inline-flex items-center gap-1.5 text-[.75rem] font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-70"
            style={{...bdr,color:dark?"rgba(250,248,244,.55)":"#7A6E64"}}>
            ← All Posts
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Font size */}
          <div className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-lg border" style={bdr}>
            <button onClick={decFont} className="w-7 h-7 flex items-center justify-center text-[.68rem] font-bold rounded-md hover:opacity-60 transition-opacity" style={txt} aria-label="Decrease font">A−</button>
            <div className="w-px h-3 mx-0.5" style={{background:dark?"rgba(255,255,255,.15)":"rgba(26,22,18,.15)"}}/>
            <button onClick={incFont} className="w-7 h-7 flex items-center justify-center text-[.82rem] font-bold rounded-md hover:opacity-60 transition-opacity" style={txt} aria-label="Increase font">A+</button>
          </div>
          {/* Dark mode */}
          <button onClick={toggleDark} className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all hover:opacity-70" style={{...bdr,...txt}} aria-label="Toggle theme">
            {dark?<SunIcon/>:<MoonIcon/>}
          </button>
          {/* TTS */}
          {supported&&(
            <button onClick={tts} className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg border transition-all hover:opacity-70"
              style={{borderColor:(speaking||loading)?"#E60023":bdr.borderColor,color:(speaking||loading)?"#E60023":txt.color,background:(speaking||loading)?(dark?"rgba(230,0,35,.1)":"#FFF5F6"):"transparent",animation:speaking?"ttsPulse 1.5s infinite":"none"}}
              aria-label={loading?"Preparing…":speaking?"Stop":"Read aloud"}>
              {loading?<span style={{display:"inline-block",width:14,height:14,border:"2px solid #E60023",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                :speaking?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><path d="M6 6h4v12H6zM14 6h4v12h-4z"/></svg>
                :<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>}
            </button>
          )}
          {/* Focus mode */}
          <button onClick={toggleRM}
            className="hidden md:flex items-center gap-1.5 text-[.75rem] font-semibold px-3 py-2 rounded-lg border transition-all hover:opacity-70"
            style={{borderColor:readingMode?"#E60023":bdr.borderColor,color:readingMode?"#E60023":txt.color,background:readingMode?(dark?"rgba(230,0,35,.1)":"#FFF5F6"):"transparent"}}
            aria-pressed={readingMode} aria-label={readingMode?"Exit focus":"Focus mode"}>
            {readingMode?"✕ Exit focus":"⊡ Focus"}
          </button>
          {/* Share */}
          <button onClick={share} className="hidden md:flex items-center gap-1.5 text-[.78rem] font-semibold px-3.5 py-2 rounded-lg border transition-all hover:opacity-70" style={{...bdr,...txt}}>
            {copied?<><CheckIcon/> Copied!</>:<><ShareIcon/> Share</>}
          </button>
          {/* Pinterest CTA */}
          <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[.78rem] font-bold px-4 py-2 rounded-full transition-all hover:-translate-y-px hover:opacity-90"
            style={{background:"#E60023",color:"#fff"}}>
            <PinIcon size={13}/> Follow
          </a>
          {/* Hamburger */}
          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
            {[open?"rotate-45 translate-y-2":"",open?"opacity-0":"",open?"-rotate-45 -translate-y-2":""].map((cls,k)=>(
              <span key={k} className={`block w-5 h-0.5 transition-all duration-300 ${cls}`} style={{background:dark?"#FAF8F4":"#1A1612"}}/>
            ))}
          </button>
        </div>
      </div>
      {open&&(
        <div className="lg:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t"
          style={{borderColor:dark?"rgba(255,255,255,.06)":"rgba(26,22,18,.08)",background:dark?"#0F0E0D":"#FAF8F4"}}>
          <Link to="/blog" onClick={()=>setOpen(false)} className="text-[.88rem] font-semibold py-1" style={{color:dark?"rgba(250,248,244,.7)":"#3D3530"}}>← All Posts</Link>
          <div className="flex items-center gap-3">
            {[["A−",decFont],[" A+",incFont]].map(([l,fn])=>(
              <button key={l} onClick={fn} className="text-xs font-bold px-3 py-1.5 rounded border" style={{...txt,...bdr}}>{l}</button>
            ))}
            <button onClick={toggleRM} className="text-xs font-bold px-3 py-1.5 rounded border" style={{color:readingMode?"#E60023":txt.color,borderColor:readingMode?"#E60023":bdr.borderColor}}>
              {readingMode?"Exit Focus":"Focus"}
            </button>
          </div>
          <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full w-fit"
            style={{background:"#E60023",color:"#fff"}}>
            <PinIcon size={12}/> Follow on Pinterest
          </a>
        </div>
      )}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════
//  BREADCRUMB
// ═══════════════════════════════════════════════════════
const Breadcrumb = ({ category, title, dark }) => (
  <nav className="max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium flex-wrap"
    style={{color:dark?"rgba(250,248,244,.4)":"#9C8E84"}} aria-label="Breadcrumb">
    <Link to="/" className="hover:text-[#E60023] transition-colors">Home</Link><span>›</span>
    <a href="/#blog" className="hover:text-[#E60023] transition-colors">Blog</a>
    {category&&<><span>›</span><Link to={`/category/${category.toLowerCase().replace(/\s+/g,"-")}`} className="hover:text-[#E60023] transition-colors capitalize">{category}</Link></>}
    <span>›</span>
    <span className="truncate max-w-[180px]" style={{color:dark?"rgba(250,248,244,.7)":"#3D3530"}}>{title}</span>
  </nav>
);

// ═══════════════════════════════════════════════════════
//  ARTICLE HEADER
// ═══════════════════════════════════════════════════════
const ArticleHeader = ({ fm, readTime, dark, onBk, bookmarked, finishTime, streak, views }) => {
  const [cp,setCp]=useState(false);
  const share=async()=>{
    if(navigator.share){try{await navigator.share({title:fm.title,url:window.location.href});}catch(_){}}
    else{await navigator.clipboard.writeText(window.location.href);setCp(true);setTimeout(()=>setCp(false),2200);}
  };
  const init=(fm.author||SITE.name).split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return (
    <header className="max-w-[1280px] mx-auto px-6 pt-7" style={{animation:"fadeUp .65s ease forwards"}}>
      {fm.category&&(
        <Link to={`/category/${fm.category.toLowerCase().replace(/\s+/g,"-")}`}
          className="inline-block text-[.7rem] font-bold tracking-[.1em] uppercase px-3 py-1.5 rounded-full mb-5 transition-all"
          style={{background:"#E600230F",color:"#E60023",border:"1px solid #E6002322"}}>
          {fm.category}
        </Link>
      )}
      <h1 className="font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.022em] mb-5 max-w-[840px]"
        style={{fontSize:"clamp(2.1rem,4.5vw,3.1rem)",color:dark?"#FAF8F4":"#1A1612"}}>
        {fm.title}
      </h1>
      {(fm.excerpt||fm.description)&&(
        <p className="text-[1.1rem] leading-[1.8] mb-7 pb-7 max-w-[840px]"
          style={{color:dark?"rgba(250,248,244,.5)":"#7A6E64",borderBottom:`1px solid ${dark?"rgba(255,255,255,.07)":"#EAE4DC"}`}}>
          {fm.excerpt||fm.description}
        </p>
      )}
      <div className="w-[90%] flex items-center justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{background:"#1A1612",color:"#FAF8F4",border:`2px solid ${dark?"rgba(255,255,255,.12)":"#EAE4DC"}`}}>
            {init}
          </div>
          <div>
            <div className="text-[.88rem] font-semibold" style={{color:dark?"#FAF8F4":"#1A1612"}}>{fm.author||SITE.name}</div>
            <div className="flex items-center gap-2 text-[.73rem] flex-wrap" style={{color:dark?"rgba(250,248,244,.4)":"#9C8E84"}}>
              {fm.date&&<time dateTime={fm.date}>{formatDate(fm.date)}</time>}
              {fm.date&&readTime&&<span>·</span>}
              {readTime&&<span>{readTime} min read</span>}
              {views&&<><span>·</span><span>{views.toLocaleString()} views</span></>}
              {finishTime&&(
                <span className="inline-flex items-center gap-1 text-[.68rem] font-semibold px-2 py-0.5 rounded-full"
                  style={{background:dark?"rgba(255,255,255,.07)":"#F0EBE3",color:dark?"rgba(250,248,244,.5)":"#7A6E64"}}>
                  ⏱ Finish by {finishTime}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {streak>1&&(
            <div className="flex items-center gap-1.5 text-[.72rem] font-semibold px-3 py-1.5 rounded-full"
              style={{background:dark?"rgba(255,180,0,.12)":"#FFFBEC",color:"#B97A00",border:"1px solid rgba(245,199,80,.3)"}}>
              🔥 {streak}-day streak
            </div>
          )}
          <button onClick={onBk} title={bookmarked?"Remove bookmark":"Bookmark"}
            className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all hover:opacity-60"
            style={{borderColor:dark?"rgba(255,255,255,.1)":"rgba(26,22,18,.12)",color:bookmarked?"#E60023":(dark?"rgba(250,248,244,.5)":"#7A6E64")}}>
            <BkIcon f={bookmarked}/>
          </button>
        </div>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════
//  HERO IMAGE
// ═══════════════════════════════════════════════════════
const HeroImage = ({ src, alt }) => {
  if(!src) return null;
  return (
    <div className="max-w-[1280px] mx-auto px-6 mb-14">
      <div className="rounded-2xl overflow-hidden" style={{aspectRatio:"16/9",maxHeight:"640px"}}>
        <img src={src} alt={alt||"Article hero"} className="w-full h-full object-cover" loading="eager"/>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  SELECTION TOOLBAR
// ═══════════════════════════════════════════════════════
const SelectionToolbar = ({ tip, onClose, onHighlight }) => {
  const [cp,setCp]=useState(false);
  const [hl,setHl]=useState(false);
  if(!tip) return null;
  const copy=async()=>{ await navigator.clipboard.writeText(tip.text); setCp(true); setTimeout(()=>{setCp(false);onClose();},1500); };
  const highlight=()=>{ if(onHighlight) onHighlight(tip.text); setHl(true); setTimeout(()=>{setHl(false);onClose();},1000); };
  return (
    <div data-sel-toolbar className="fixed z-[200] flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-2xl"
      style={{top:tip.y,left:Math.max(8,tip.x-80),background:"#1A1612",border:"1px solid rgba(255,255,255,.12)",transform:"translateX(-50%)"}}>
      <button onClick={copy} className="flex items-center gap-1.5 text-[.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{color:cp?"#4CAF50":"#FAF8F4"}}>
        {cp?<><CheckIcon/> Copied</>:<><CopyIcon/> Copy</>}
      </button>
      <div className="w-px h-4 bg-white/15"/>
      <button onClick={highlight} className="flex items-center gap-1.5 text-[.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{color:hl?"#FFD700":"#FAF8F4"}}>
        {hl?"✓ Saved":"🖊 Highlight"}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  SMART TOC
// ═══════════════════════════════════════════════════════
const SmartTOC = ({ items, activeId, secPct, overall, dark }) => {
  const listRef=useRef(null);
  const done=items.filter(t=>(secPct[t.id]||0)>=95).length;
  const scroll=useCallback(id=>{
    const el=document.getElementById(id); if(!el) return;
    window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-96,behavior:"smooth"});
  },[]);
  useEffect(()=>{
    if(!activeId||!listRef.current) return;
    const ae=listRef.current.querySelector(`[data-id="${activeId}"]`);
    if(ae) ae.scrollIntoView({behavior:"smooth",block:"nearest"});
  },[activeId]);

  if(!items.length) return <p className="text-sm" style={{color:dark?"rgba(250,248,244,.4)":"#9C8E84"}}>No sections found.</p>;

  return (
    <div>
      {/* Progress ring */}
      <div className="flex items-center gap-3 mb-5 pb-4" style={{borderBottom:`1px solid ${dark?"rgba(255,255,255,.06)":"#EAE4DC"}`}}>
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke={dark?"rgba(255,255,255,.08)":"#EAE4DC"} strokeWidth="3.5"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E60023" strokeWidth="3.5"
              strokeDasharray={`${2*Math.PI*16}`}
              strokeDashoffset={`${2*Math.PI*16*(1-overall/100)}`}
              strokeLinecap="round" style={{transition:"stroke-dashoffset .3s"}}/>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[.5rem] font-bold" style={{color:dark?"#FAF8F4":"#1A1612"}}>
            {Math.round(overall)}%
          </span>
        </div>
        <div>
          <div className="text-[.75rem] font-bold" style={{color:dark?"#FAF8F4":"#1A1612"}}>Reading progress</div>
          <div className="text-[.68rem]" style={{color:dark?"rgba(250,248,244,.4)":"#9C8E84"}}>{done}/{items.length} sections done</div>
        </div>
      </div>
      <ul ref={listRef} className="space-y-0.5 list-none" role="navigation" aria-label="Article sections">
        {items.map((item,idx)=>{
          const isActive=activeId===item.id;
          const pct=Math.round(secPct[item.id]||0);
          const isDone=pct>=95;
          return (
            <li key={item.id} data-id={item.id}>
              <button onClick={()=>scroll(item.id)}
                className="w-full text-left flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200 relative"
                style={{background:isActive?(dark?"rgba(255,255,255,.05)":"#F4EFE6"):"transparent",border:isActive?`1px solid ${dark?"rgba(255,255,255,.07)":"#E4DDD4"}`:"1px solid transparent"}}
                aria-current={isActive?"true":undefined}>
                {isActive&&<div className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-[#E60023]"/>}
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[.6rem] font-bold transition-all duration-200"
                  style={{background:isDone?"#22543D":isActive?"#E60023":(dark?"rgba(255,255,255,.08)":"#EDEAE4"),color:isDone||isActive?"#fff":(dark?"rgba(250,248,244,.5)":"#7A6E64")}}>
                  {isDone?"✓":idx+1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[.8rem] font-medium leading-snug"
                    style={{color:isActive?(dark?"#FAF8F4":"#1A1612"):isDone?(dark?"rgba(250,248,244,.35)":"#AAA09A"):(dark?"rgba(250,248,244,.6)":"#5A5046")}}>
                    {item.label}
                  </div>
                  {pct>0&&(
                    <div className="mt-1.5 h-[2px] rounded-full overflow-hidden" style={{background:dark?"rgba(255,255,255,.07)":"#EAE4DC"}}>
                      <div className="h-full rounded-full transition-[width] duration-300"
                        style={{width:`${pct}%`,background:isDone?"#22543D":"linear-gradient(90deg,#E60023,#FF6B81)"}}/>
                    </div>
                  )}
                </div>
                <span className="text-[.62rem] font-bold flex-shrink-0 mt-0.5"
                  style={{color:isDone?"#22543D":isActive?"#E60023":(dark?"rgba(250,248,244,.3)":"#AAA09A")}}>
                  {isDone?"Done":pct>0?`${pct}%`:""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 pt-4 flex items-center justify-between text-[.68rem]"
        style={{borderTop:`1px solid ${dark?"rgba(255,255,255,.06)":"#EAE4DC"}`,color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>
        <span>{items.length} sections</span>
        {done===items.length?<span style={{color:"#22543D",fontWeight:700}}>✓ Fully read!</span>:<span>~{Math.max(1,Math.round(8*(1-overall/100)))} min left</span>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  SIDEBAR CARD WRAPPER
// ═══════════════════════════════════════════════════════
const SCard = ({ header, children, dark, delay=0 }) => {
  const ref=useFadeIn(delay);
  return (
    <div ref={ref} className="rounded-2xl overflow-hidden mb-4"
      style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${dark?"rgba(255,255,255,.07)":"#EAE4DC"}`}}>
      <div className="px-5 py-3 text-[.65rem] font-bold tracking-[.13em] uppercase"
        style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84",borderBottom:`1px solid ${dark?"rgba(255,255,255,.06)":"#EAE4DC"}`}}>
        {header}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  AUTHOR CARD
// ═══════════════════════════════════════════════════════
const AuthorCard = ({ author, dark }) => {
  const name=author||SITE.name;
  return (
    <>
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-['DM_Serif_Display',serif] mb-3" style={{background:"#1A1612",color:"#FAF8F4"}}>
        {name[0]?.toUpperCase()}
      </div>
      <div className="font-['DM_Serif_Display',serif] text-[1rem] mb-1" style={{color:dark?"#FAF8F4":"#1A1612"}}>{name}</div>
      <p className="text-[.8rem] leading-relaxed mb-4" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}>
        A 22-year-old developer building a startup in Hubballi, India. Writing about life, growth, and the unglamorous work of building something from nothing.
      </p>
      <div className="flex gap-2 flex-wrap">
        <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all hover:opacity-70"
          style={{color:dark?"rgba(250,248,244,.7)":"#3D3530",borderColor:dark?"rgba(255,255,255,.1)":"#DDD7CE",background:dark?"rgba(255,255,255,.04)":"#F5F1EB"}}>
          <PinIcon size={11}/> Pinterest
        </a>
        <a href={`mailto:${SITE.email}`}
          className="inline-flex items-center gap-1.5 text-[.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all hover:opacity-70"
          style={{color:dark?"rgba(250,248,244,.7)":"#3D3530",borderColor:dark?"rgba(255,255,255,.1)":"#DDD7CE",background:dark?"rgba(255,255,255,.04)":"#F5F1EB"}}>
          <I d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={11}/> Email
        </a>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════
//  KEY TAKEAWAYS
// ═══════════════════════════════════════════════════════
const KeyTakeaways = ({ items, dark }) => {
  if(!items?.length) return null;
  return (
    <div className="rounded-2xl p-6 mb-8" style={{background:dark?"rgba(230,0,35,.06)":"#FFF5F6",border:"1.5px solid rgba(230,0,35,.2)"}}>
      <div className="flex items-center gap-2 mb-4">
        <span style={{fontSize:"1.1rem"}}>🎯</span>
        <span className="font-['DM_Serif_Display',serif] text-[1.05rem]" style={{color:dark?"#FAF8F4":"#1A1612"}}>Key Takeaways</span>
      </div>
      <ul className="space-y-2.5 list-none m-0 p-0">
        {items.map((t,i)=>(
          <li key={i} className="flex items-start gap-3 text-[.87rem] leading-relaxed" style={{color:dark?"rgba(250,248,244,.78)":"#3D3530"}}>
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[.6rem] font-bold mt-0.5" style={{background:"#E60023",color:"#fff"}}>{i+1}</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  REACTION BAR
// ═══════════════════════════════════════════════════════
const ReactionBar = ({ slug, dark, border }) => {
  const {counts,myVotes,react}=useReactions(slug);
  return (
    <div className="mt-10 pt-8 flex flex-col gap-3" style={{borderTop:`1px solid ${border}`}}>
      <p className="text-[.72rem] font-bold uppercase tracking-[.07em]" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>Did you find this helpful?</p>
      <div className="flex items-center gap-2 flex-wrap">
        {REACTIONS.map(emoji=>(
          <button key={emoji} onClick={()=>react(emoji)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-all hover:-translate-y-px"
            style={{background:myVotes[emoji]?(dark?"rgba(230,0,35,.15)":"#FFF0F1"):(dark?"rgba(255,255,255,.04)":"#F5F1EB"),borderColor:myVotes[emoji]?"rgba(230,0,35,.35)":(dark?"rgba(255,255,255,.09)":"#DDD7CE"),transform:myVotes[emoji]?"scale(1.05)":"scale(1)"}}
            title={REACTION_LBL[emoji]} aria-label={`React with ${REACTION_LBL[emoji]}`} aria-pressed={!!myVotes[emoji]}>
            <span>{emoji}</span>
            {(counts[emoji]||0)>0&&<span className="text-[.72rem] font-semibold" style={{color:dark?"rgba(250,248,244,.55)":"#7A6E64"}}>{counts[emoji]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  FAQ SECTION
// ═══════════════════════════════════════════════════════
const FAQSection = ({ faqs, dark, border }) => {
  const [open,setOpen]=useState(null);
  if(!faqs?.length) return null;
  return (
    <div className="mt-12 pt-8" style={{borderTop:`1px solid ${border}`}}>
      <p className="text-[.72rem] font-bold tracking-[.12em] uppercase mb-2" style={{color:"#E60023"}}>FAQ</p>
      <h2 className="font-['DM_Serif_Display',serif] text-[1.6rem] mb-6" style={{color:dark?"#FAF8F4":"#1A1612"}}>Frequently Asked Questions</h2>
      <div className="space-y-2" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq,i)=>(
          <div key={i} className="rounded-xl overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
            style={{border:`1px solid ${border}`}}>
            <button onClick={()=>setOpen(open===i?null:i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
              style={{background:open===i?(dark?"rgba(255,255,255,.04)":"#F9F6F1"):"transparent"}}
              aria-expanded={open===i}>
              <span className="text-[.88rem] font-semibold pr-4" itemProp="name" style={{color:dark?"#FAF8F4":"#1A1612"}}>{faq.q}</span>
              <span className="flex-shrink-0 text-lg transition-transform duration-200" style={{transform:open===i?"rotate(45deg)":"none",color:dark?"rgba(250,248,244,.4)":"#9C8E84"}}>+</span>
            </button>
            {open===i&&(
              <div className="px-5 pb-5 text-[.85rem] leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                style={{color:dark?"rgba(250,248,244,.65)":"#5A5046"}}>
                <span itemProp="text">{faq.a}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  AI SUMMARY CARD  (Groq via env var)
// ═══════════════════════════════════════════════════════
const AISummaryCard = ({ content, dark, border }) => {
  const [state,setState]=useState("idle");
  const [summary,setSummary]=useState("");
  const generate=async()=>{
    if(state==="loading"||!content) return;
    setState("loading");
    const GROQ_KEY = typeof import.meta !== "undefined" ? import.meta.env?.VITE_GROQ_API_KEY : "";
    try {
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${GROQ_KEY}`},
        body:JSON.stringify({model:"llama-3.1-8b-instant",max_tokens:300,messages:[{role:"user",content:`Summarize this article in exactly 3 concise bullet points. Each bullet should be one sentence capturing a key insight. Return ONLY 3 bullets using "•" as the bullet character. No preamble.\n\n${content.slice(0,6000)}`}]})
      });
      const d=await res.json();
      setSummary(d.choices?.[0]?.message?.content||"");
      setState("done");
    } catch { setState("error"); }
  };
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${border}`}}>
      <div className="px-5 py-3 flex items-center justify-between" style={{borderBottom:`1px solid ${border}`}}>
        <span className="text-[.65rem] font-bold tracking-[.13em] uppercase" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>✦ AI Summary</span>
        {state==="idle"&&<button onClick={generate} className="text-[.68rem] font-bold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity" style={{background:"#E60023",color:"#fff"}}>Generate</button>}
        {state==="done"&&<button onClick={()=>{setState("idle");setSummary("");}} className="text-[.68rem] opacity-50 hover:opacity-100 transition-opacity" style={{color:dark?"#FAF8F4":"#1A1612"}}>Dismiss</button>}
      </div>
      <div className="p-5">
        {state==="idle"&&<p className="text-[.8rem] leading-relaxed" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}>Get a 3-bullet AI summary of this article.</p>}
        {state==="loading"&&<div className="flex items-center gap-2 text-[.8rem]" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}><span className="inline-block w-3.5 h-3.5 border-2 rounded-full border-t-transparent animate-spin" style={{borderColor:"#E60023",borderTopColor:"transparent"}}/>Summarizing…</div>}
        {state==="done"&&<div className="space-y-2.5">{summary.split("\n").filter(l=>l.trim()).map((l,i)=><p key={i} className="text-[.82rem] leading-relaxed" style={{color:dark?"rgba(250,248,244,.75)":"#3D3530"}}>{l}</p>)}</div>}
        {state==="error"&&<p className="text-[.8rem]" style={{color:"#E60023"}}>Failed. <button onClick={generate} className="underline">Retry</button></p>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  HIGHLIGHTS PANEL
// ═══════════════════════════════════════════════════════
const HighlightsPanel = ({ slug, dark, border }) => {
  const {hl,remove}=useHighlights(slug);
  if(!hl.length) return null;
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${border}`}}>
      <div className="px-5 py-3" style={{borderBottom:`1px solid ${border}`}}>
        <span className="text-[.65rem] font-bold tracking-[.13em] uppercase" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>✎ Highlights ({hl.length})</span>
      </div>
      <div className="p-4 space-y-3">
        {hl.map(h=>(
          <div key={h.id} className="group flex items-start gap-2">
            <div className="w-0.5 rounded-full flex-shrink-0 mt-1 self-stretch" style={{background:"#E60023",minHeight:"1.2rem"}}/>
            <p className="text-[.78rem] leading-relaxed flex-1 italic" style={{color:dark?"rgba(250,248,244,.7)":"#3D3530"}}>"{h.text.slice(0,120)}{h.text.length>120?"…":""}"</p>
            <button onClick={()=>remove(h.id)} className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-xs transition-opacity flex-shrink-0 mt-0.5" style={{color:dark?"#FAF8F4":"#1A1612"}} aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  AFFILIATE PRODUCT CARD
// ═══════════════════════════════════════════════════════
const ProductCard = ({ product, dark }) => (
  <a href={product.link||"#"} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5"
    style={{background:dark?"rgba(255,255,255,.04)":"#FFFFFF",borderColor:dark?"rgba(255,255,255,.08)":"#EAE4DC"}}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:dark?"rgba(255,255,255,.07)":"#F5F1EB"}}>🛒</div>
    <div className="flex-1 min-w-0">
      <div className="text-[.88rem] font-semibold leading-snug mb-0.5 truncate" style={{color:dark?"#FAF8F4":"#1A1612"}}>{product.name}</div>
      <div className="flex items-center gap-2 flex-wrap">
        {product.rating&&<span className="text-[.72rem] font-bold text-amber-500">★ {product.rating}</span>}
        {product.price&&<span className="text-[.75rem] font-semibold" style={{color:"#E60023"}}>{product.price}</span>}
        {String(product.link||"").includes("amzn")&&<span className="text-[.6rem] font-bold px-1.5 py-0.5 rounded" style={{background:"#FF9900",color:"#000"}}>amazon</span>}
      </div>
    </div>
    <div className="flex-shrink-0 text-[.72rem] font-bold px-3 py-1.5 rounded-full" style={{background:"#E60023",color:"#fff"}}>Buy →</div>
  </a>
);

// ═══════════════════════════════════════════════════════
//  ARTICLE TAGS
// ═══════════════════════════════════════════════════════
const ArticleTags = ({ tags, dark }) => {
  const t=normalizeTags(tags);
  if(!t.length) return null;
  return (
    <div className="mt-12 pt-8 flex items-center gap-2.5 flex-wrap" style={{borderTop:`1px solid ${dark?"rgba(255,255,255,.07)":"#EAE4DC"}`}}>
      <span className="text-[.72rem] font-bold uppercase tracking-[.07em]" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>Tags:</span>
      {t.map(tag=>(
        <Link key={tag} to={`/tags/${tag.toLowerCase().replace(/\s+/g,"-")}`}
          className="inline-block text-[.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all hover:opacity-70"
          style={{background:dark?"rgba(255,255,255,.05)":"#F5F1EB",color:dark?"rgba(250,248,244,.7)":"#3D3530",borderColor:dark?"rgba(255,255,255,.09)":"#DDD7CE"}}>
          {tag}
        </Link>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  FLOATING SHARE BAR (left side)
// ═══════════════════════════════════════════════════════
const FloatingShare = ({ title, dark }) => {
  const [cp,setCp]=useState(false);
  const [igCp,setIgCp]=useState(false);
  const url=window.location.href;
  const enc=encodeURIComponent;
  const copyLink=async()=>{ await navigator.clipboard.writeText(url); setCp(true); setTimeout(()=>setCp(false),2000); };
  const shareNative=async()=>{ if(navigator.share){try{await navigator.share({title,url});}catch(_){}}else{copyLink();} };
  const btns=[
    {lbl:"Share",    col:dark?"#FAF8F4":"#1A1612",      fn:shareNative,   icon:<ShareIcon/>},
    {lbl:cp?"Copied!":"Copy",  col:cp?"#22543D":(dark?"#FAF8F4":"#1A1612"), fn:copyLink, icon:cp?<CheckIcon/>:<CopyIcon/>},
    {lbl:"WhatsApp",col:"#25D366",fn:()=>window.open(`https://wa.me/?text=${enc(title+" "+url)}`, "_blank","noopener"),
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>},
    {lbl:"Telegram", col:"#26A5E4",fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,"_blank","noopener"),
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>},
    {lbl:"LinkedIn",  col:"#0A66C2",fn:()=>window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,"_blank","noopener"),
      icon:<svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
  ];
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 hidden lg:flex" data-floating-share style={{animation:"fadeUp .6s ease forwards"}}>
      {btns.map(btn=>(
        <button key={btn.lbl} onClick={btn.fn} title={btn.lbl}
          className="group relative w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all hover:scale-110 hover:-translate-x-1"
          style={{background:dark?"rgba(255,255,255,.06)":"#FFFFFF",border:`1px solid ${dark?"rgba(255,255,255,.1)":"#EAE4DC"}`,color:btn.col}}
          aria-label={btn.lbl}>
          {btn.icon}
          <span className="absolute left-12 px-2.5 py-1 rounded-lg text-[.7rem] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
            style={{background:dark?"#FAF8F4":"#1A1612",color:dark?"#1A1612":"#FAF8F4"}}>
            {btn.lbl}
          </span>
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  PINTEREST SECTION (shown when post has pinterest field)
// ═══════════════════════════════════════════════════════
const PinterestSection = ({ url, boardUrl, dark, border }) => {
  if(!url&&!boardUrl) return null;
  return (
    <div className="mt-10 pt-8" style={{borderTop:`1px solid ${border}`}}>
      <div className="rounded-2xl p-5" style={{background:dark?"rgba(230,0,35,.06)":"#FFF5F6",border:"1.5px solid rgba(230,0,35,.2)"}}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#E60023"}}>
            <PinIcon size={16} color="#fff"/>
          </div>
          <div>
            <div className="text-[.85rem] font-bold" style={{color:dark?"#FAF8F4":"#1A1612"}}>Save to Pinterest</div>
            <div className="text-[.72rem]" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}>Share this post with your followers</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {url&&(
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[.78rem] font-bold px-4 py-2 rounded-full transition-all hover:opacity-90 hover:-translate-y-px"
              style={{background:"#E60023",color:"#fff"}}>
              <PinIcon size={12}/> Save this Pin
            </a>
          )}
          {boardUrl&&(
            <a href={boardUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[.78rem] font-semibold px-4 py-2 rounded-full border transition-all hover:opacity-70"
              style={{borderColor:"rgba(230,0,35,.3)",color:"#E60023"}}>
              <PinIcon size={12}/> View Board
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  MORE POSTS LIST ITEM
// ═══════════════════════════════════════════════════════
const MorePostItem = ({ post, dark, isLast }) => (
  <Link to={`/blog/${post.slug}`}
    className="flex gap-3 items-start py-3 transition-opacity hover:opacity-70"
    style={{borderBottom:isLast?"none":`1px solid ${dark?"rgba(255,255,255,.06)":"#EAE4DC"}`}}>
    <div className="w-12 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
      style={{background:dark?"rgba(255,255,255,.06)":"#F5F1EB",border:`1px solid ${dark?"rgba(255,255,255,.08)":"#E5DFDA"}`}}>
      {post.emoji||"📄"}
    </div>
    <div>
      <div className="text-[.65rem] font-bold uppercase tracking-[.07em] mb-0.5" style={{color:"#E60023"}}>{post.tag||post.category}</div>
      <div className="text-[.78rem] font-semibold leading-snug" style={{color:dark?"rgba(250,248,244,.75)":"#1A1612"}}>{post.title}</div>
    </div>
  </Link>
);

// ═══════════════════════════════════════════════════════
//  RELATED CARD
// ═══════════════════════════════════════════════════════
const RelatedCard = ({ post, delay, dark }) => {
  const ref=useFadeIn(delay);
  return (
    <Link ref={ref} to={`/blog/${post.slug}`}
      className="rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
      style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${dark?"rgba(255,255,255,.07)":"#EAE4DC"}`}}>
      <div className="overflow-hidden" style={{aspectRatio:"16/9",background:dark?"#1a1a1a":"#f5f1eb"}}>
        <img src={post.image||"/fallback.jpg"} alt={post.title} loading="lazy"
          onError={e=>{e.currentTarget.src="/fallback.jpg";}}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"/>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[.65rem] font-bold uppercase tracking-[.09em] mb-2" style={{color:"#E60023"}}>{post.tag||post.category}</div>
        <h3 className="font-['DM_Serif_Display',serif] text-[1rem] leading-snug flex-1 mb-3" style={{color:dark?"#FAF8F4":"#1A1612"}}>{post.title}</h3>
        <div className="text-[.72rem] font-medium" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>{post.meta||post.date}</div>
      </div>
    </Link>
  );
};

// ═══════════════════════════════════════════════════════
//  PREV / NEXT NAV
// ═══════════════════════════════════════════════════════
const PrevNextNav = ({ morePosts, dark }) => {
  if(!morePosts?.length) return null;
  const [prev,next]=[morePosts[0]||null,morePosts[1]||null];
  const border=dark?"rgba(255,255,255,.07)":"#EAE4DC";
  return (
    <div className="max-w-[1280px] mx-auto px-6 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10" style={{borderTop:`1px solid ${border}`}}>
        {prev&&(
          <Link to={`/blog/${prev.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl border transition-all hover:-translate-y-1"
            style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",borderColor:border}}>
            <span className="text-[.68rem] font-bold uppercase tracking-widest" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>← Older Post</span>
            <span className="font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors" style={{color:dark?"#FAF8F4":"#1A1612"}}>{prev.title}</span>
          </Link>
        )}
        {next&&(
          <Link to={`/blog/${next.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl border transition-all hover:-translate-y-1 sm:text-right sm:items-end"
            style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",borderColor:border}}>
            <span className="text-[.68rem] font-bold uppercase tracking-widest" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>Newer Post →</span>
            <span className="font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors" style={{color:dark?"#FAF8F4":"#1A1612"}}>{next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  COMMENT SECTION
// ═══════════════════════════════════════════════════════
const CommentSection = ({ slug, dark }) => {
  const border=dark?"rgba(255,255,255,.07)":"#EAE4DC";
  const [comments,setComments]=useState([]);
  const [name,setName]=useState("");
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(false);
  const [error,setError]=useState("");

  const fetchComments=useCallback(async()=>{
    setLoading(true);
    try {
      const res=await fetch(`${SUPABASE_URL}/rest/v1/comments?slug=eq.${encodeURIComponent(slug)}&approved=eq.true&order=created_at.desc`,
        {headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`}});
      const data=await res.json();
      setComments(Array.isArray(data)?data:[]);
    } catch { setComments([]); }
    finally { setLoading(false); }
  },[slug]);

  useEffect(()=>{fetchComments();},[fetchComments]);

  const submit=async e=>{
    e.preventDefault();
    if(!name.trim()||!msg.trim()) return;
    setSubmitting(true);setError("");
    try {
      const res=await fetch(`${SUPABASE_URL}/rest/v1/comments`,{method:"POST",headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({slug,name:name.trim(),message:msg.trim()})});
      if(!res.ok) throw new Error();
      setDone(true);setName("");setMsg("");
      setTimeout(()=>{setDone(false);fetchComments();},2000);
    } catch { setError("Failed to post. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp={width:"100%",padding:"10px 14px",borderRadius:"10px",border:`1.5px solid ${dark?"rgba(255,255,255,.1)":"#DDD7CE"}`,background:dark?"rgba(255,255,255,.05)":"#FAF8F4",color:dark?"#FAF8F4":"#1A1612",fontSize:"0.88rem",outline:"none",fontFamily:"Outfit, sans-serif",boxSizing:"border-box"};

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16" style={{borderTop:`1px solid ${border}`}}>
      <div className="max-w-[760px] mx-auto">
        <p className="text-[.72rem] font-bold tracking-[.12em] uppercase mb-2" style={{color:"#E60023"}}>Discussion</p>
        <h2 className="font-['DM_Serif_Display',serif] text-[1.9rem] mb-10" style={{color:dark?"#FAF8F4":"#1A1612"}}>
          {loading?"Comments":`${comments.length} Comment${comments.length!==1?"s":""}`}
        </h2>
        <div className="rounded-2xl p-6 mb-10" style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${border}`}}>
          <div className="text-[.85rem] font-semibold mb-4" style={{color:dark?"#FAF8F4":"#1A1612"}}>Leave a comment</div>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required maxLength={60} style={inp}/>
            <textarea placeholder="Write your comment…" value={msg} onChange={e=>setMsg(e.target.value)} required maxLength={1000} rows={4} style={{...inp,resize:"vertical",lineHeight:1.6}}/>
            {error&&<p className="text-[.78rem]" style={{color:"#E60023"}}>{error}</p>}
            <button type="submit" disabled={submitting||!name.trim()||!msg.trim()}
              className="self-start px-6 py-2.5 rounded-xl text-[.82rem] font-bold transition-all hover:opacity-80 disabled:opacity-40"
              style={{background:done?"#22543D":"#1A1612",color:"#FAF8F4",cursor:submitting?"wait":"pointer"}}>
              {done?"✓ Posted!":submitting?"Posting…":"Post Comment"}
            </button>
          </form>
        </div>
        {loading?(
          <div className="space-y-4">{[1,2].map(i=><div key={i} className="animate-pulse rounded-2xl p-5 h-24" style={{background:dark?"rgba(255,255,255,.04)":"#F5F1EB"}}/>)}</div>
        ):comments.length===0?(
          <div className="text-center py-14 rounded-2xl" style={{background:dark?"rgba(255,255,255,.02)":"#F9F6F1",border:`1px dashed ${border}`}}>
            <div className="text-3xl mb-3">💬</div>
            <p className="text-[.88rem]" style={{color:dark?"rgba(250,248,244,.4)":"#9C8E84"}}>No comments yet. Be the first!</p>
          </div>
        ):(
          <div className="space-y-4">
            {comments.map(c=>(
              <div key={c.id} className="rounded-2xl p-5" style={{background:dark?"rgba(255,255,255,.03)":"#FFFFFF",border:`1px solid ${border}`}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:"#1A1612",color:"#FAF8F4"}}>{c.name[0]?.toUpperCase()}</div>
                  <div>
                    <div className="text-[.85rem] font-semibold" style={{color:dark?"#FAF8F4":"#1A1612"}}>{c.name}</div>
                    <div className="text-[.72rem]" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>{new Date(c.created_at).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}</div>
                  </div>
                </div>
                <p className="text-[.88rem] leading-relaxed" style={{color:dark?"rgba(250,248,244,.7)":"#3D3530"}}>{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════
//  SCROLL TO TOP FAB
// ═══════════════════════════════════════════════════════
const ScrollToTop = ({ show }) => (
  <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
    className="fixed bottom-8 right-8 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 z-50"
    style={{background:"#1A1612",color:"#FAF8F4",opacity:show?1:0,pointerEvents:show?"auto":"none",transform:show?"translateY(0)":"translateY(12px)",transition:"all .3s"}}
    aria-label="Scroll to top">
    <ArrowUpIcon/>
  </button>
);

// ═══════════════════════════════════════════════════════
//  LOADING SKELETON
// ═══════════════════════════════════════════════════════
const Skeleton = ({ dark }) => (
  <div className="min-h-screen pt-28" style={{background:dark?"#0F0E0D":"#FAF8F4"}}>
    <div className="max-w-[760px] mx-auto px-6 space-y-4 animate-pulse">
      {[32,72,48,"full","5/6","full",56].map((w,i)=>(
        <div key={i} className={`h-${typeof w==="number"?w:w==="full"?"3":"3"} rounded-${typeof w==="number"?"xl":"full"} w-${typeof w==="string"?w:"1/2"}`}
          style={{height:typeof w==="number"?w+"px":"12px",width:typeof w==="string"&&w!=="full"?w:"100%",background:dark?"rgba(255,255,255,.07)":"#EAE4DC"}}/>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
//  ERROR STATE
// ═══════════════════════════════════════════════════════
const ErrorState = ({ slug, dark }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center" style={{background:dark?"#0F0E0D":"#FAF8F4"}}>
    <div className="text-6xl">📄</div>
    <h1 className="font-['DM_Serif_Display',serif] text-3xl" style={{color:dark?"#FAF8F4":"#1A1612"}}>Post not found</h1>
    <p className="text-[.88rem] max-w-sm" style={{color:dark?"rgba(250,248,244,.5)":"#7A6E64"}}>
      Could not load <code className="px-2 py-0.5 rounded text-sm" style={{background:dark?"rgba(255,255,255,.07)":"#F0EBE3"}}>/blogs/{slug}.md</code>
    </p>
    <button onClick={()=>window.location.href="/"} className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full hover:opacity-80 transition-opacity" style={{background:"#1A1612",color:"#FAF8F4"}}>
      ← Back to Blog
    </button>
  </div>
);

// ═══════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════
const Footer = () => (
  <footer className="relative z-10 overflow-hidden" style={{background:"#0F0E0D"}}>
    <div className="h-px w-full" style={{background:"linear-gradient(90deg,transparent,#E60023,transparent)"}}/>
    <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-10">
      <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12" style={{borderBottom:"1px solid rgba(250,248,244,.07)"}}>
        <div className="max-w-[320px]">
          <Link to="/" className="font-['DM_Serif_Display',serif] text-[2rem] mb-3 inline-block" style={{color:"#FAF8F4",textDecoration:"none"}}>
            Veeresh<span style={{color:"#E60023"}}>.</span>
          </Link>
          <p className="text-[.82rem] leading-relaxed mb-6" style={{color:"rgba(250,248,244,.4)"}}>
            Writing about life, growth, and building from zero. Based in Hubballi, India.
          </p>
          <div className="flex items-center gap-3">
            <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90"
              style={{background:"#E60023",color:"#fff"}} aria-label="Pinterest">
              <PinIcon size={15}/>
            </a>
            <a href={`mailto:${SITE.email}`}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90"
              style={{background:"rgba(255,255,255,.08)",color:"#fff"}} aria-label="Email">
              <I d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={15}/>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
          {[
            {title:"Explore",links:[{label:"All Posts",to:"/blog"},{label:"Life Lessons",to:"/category/life-lessons"},{label:"Developer Journey",to:"/category/developer-journey"},{label:"Pinterest Boards",href:SITE.pinterestUrl,ext:true}]},
            {title:"Topics",links:[{label:"Personal Growth",to:"/category/personal-growth"},{label:"Psychology",to:"/category/psychology"},{label:"Startup Life",to:"/category/startup-life"},{label:"Finance",to:"/category/finance"}]},
            {title:"Connect",links:[{label:"About Me",to:"/about"},{label:"Contact",href:`mailto:${SITE.email}`},{label:"Privacy Policy",to:"/privacy-policy"},{label:"Terms",to:"/terms"}]},
          ].map(col=>(
            <div key={col.title}>
              <div className="text-[.65rem] font-bold tracking-[.15em] uppercase mb-4" style={{color:"#E60023"}}>{col.title}</div>
              <ul className="space-y-2.5 list-none m-0 p-0">
                {col.links.map(l=>(
                  <li key={l.label}>
                    {l.ext||l.href?(
                      <a href={l.href||l.to} target={l.ext?"_blank":undefined} rel={l.ext?"noopener noreferrer":undefined}
                        className="text-[.8rem] transition-all hover:opacity-100 hover:translate-x-1 inline-block"
                        style={{color:"rgba(250,248,244,.45)",textDecoration:"none"}}>
                        {l.label}
                      </a>
                    ):(
                      <Link to={l.to} className="text-[.8rem] transition-all hover:opacity-100 hover:translate-x-1 inline-block" style={{color:"rgba(250,248,244,.45)",textDecoration:"none"}}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Pinterest CTA strip */}
      <div className="py-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{borderBottom:"1px solid rgba(250,248,244,.07)"}}>
        <div>
          <div className="font-['DM_Serif_Display',serif] text-[1.1rem] mb-1" style={{color:"#FAF8F4"}}>Follow on Pinterest</div>
          <p className="text-[.78rem]" style={{color:"rgba(250,248,244,.4)"}}>Get visual inspiration and curated finds every day.</p>
        </div>
        <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-[.82rem] px-6 py-3 rounded-full transition-all hover:opacity-90 hover:-translate-y-px flex-shrink-0"
          style={{background:"#E60023",color:"#fff"}}>
          <PinIcon size={14}/> Follow on Pinterest
        </a>
      </div>
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[.72rem]" style={{color:"rgba(250,248,244,.25)"}}>
          <span>© {new Date().getFullYear()} Veeresh Bashetti.</span>
          <span className="w-1 h-1 rounded-full inline-block" style={{background:"rgba(250,248,244,.2)"}}/>
          <span>All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[.72rem]" style={{color:"rgba(250,248,244,.2)"}}>
          <span>Made with</span><span style={{color:"#E60023"}}>♥</span><span>in Hubballi, India</span>
        </div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════
export default function ReadBlog() {
  const { slug } = useParams();
  const [content,setContent]=useState("");
  const [fm,setFm]=useState({});
  const [tocItems,setTocItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);
  const [bookmarked,setBookmarked]=useState(false);
  const [morePosts,setMorePosts]=useState([]);

  const [dark,toggleDark]=useDarkMode();
  const [fontSize,incFont,decFont]=useFontSize();
  const [readingMode,toggleRM]=useReadingMode();
  const progress=useReadingProgress();
  const {activeId,secPct}=useActiveTOC(tocItems);
  const showTop=useScrollToTop();
  const [selTip,setSelTip]=useSelectionToolbar();
  const streak=useReadingStreak();
  const {hl:highlights,save:saveHl}=useHighlights(slug);
  const readTime=useMemo(()=>content?estimateReadTime(content):null,[content]);
  const finishTime=useFinishTime(readTime,progress);
  const views=useViewCount(slug);

  const layoutRef=useRef(null);
  const sidebarRef=useRef(null);
  useSyncedSidebarScroll(sidebarRef,layoutRef);
  useSEO(fm,slug,content,morePosts);

  // Load post
  useEffect(()=>{
    if(!slug) return;
    setLoading(true);setError(false);
    window.scrollTo({top:0,behavior:"instant"});
    (async()=>{
      try {
        const res=await fetch(`/blogs/${slug}.md`);
        if(!res.ok) throw new Error("NOT_FOUND");
        const ct=res.headers.get("content-type")||"";
        if(ct.includes("text/html")) throw new Error("NOT_FOUND");
        const raw=await res.text();
        if(raw.trimStart().startsWith("<!doctype")||raw.trimStart().startsWith("<html")) throw new Error("NOT_FOUND");
        const {data,content:body}=parseFrontmatter(raw);
        setFm(data);setContent(body);setTocItems(buildTOC(body));
        const bks=JSON.parse(localStorage.getItem("bookmarks")||"[]");
        setBookmarked(bks.includes(slug));
        try {
          const mr=await fetch("/blogs/manifest.json");
          if(!mr.ok){setMorePosts([]);return;}
          const mct=mr.headers.get("content-type")||"";
          if(mct.includes("text/html")){setMorePosts([]);return;}
          const mj=await mr.json();
          setMorePosts((mj.posts||[]).filter(p=>p.slug&&p.slug!==slug).slice(0,6));
        } catch { setMorePosts([]); }
      } catch { setError(true); }
      finally { setLoading(false); }
    })();
  },[slug]);

  const toggleBookmark=useCallback(()=>{
    const stored=JSON.parse(localStorage.getItem("bookmarks")||"[]");
    const next=bookmarked?stored.filter(s=>s!==slug):[...stored,slug];
    localStorage.setItem("bookmarks",JSON.stringify(next));
    setBookmarked(!bookmarked);
  },[bookmarked,slug]);

  if(loading) return <Skeleton dark={dark}/>;
  if(error)   return <ErrorState slug={slug} dark={dark}/>;

  const bg    = dark?"#0F0E0D":"#FAF8F4";
  const border= dark?"rgba(255,255,255,.07)":"#EAE4DC";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ttsPulse { 0%,100%{opacity:1} 50%{opacity:.5} }

        html{scroll-behavior:smooth;}
        html,body{min-height:100%;background:${bg};}
        body{font-family:'Outfit',sans-serif;color:${dark?"#FAF8F4":"#1A1612"};overflow-x:hidden;transition:background .3s,color .3s;}
        ::selection{background:#E6002326;color:${dark?"#FAF8F4":"#1A1612"};}

        /* Reading mode */
        [data-rm="on"] [data-floating-share],[data-rm="on"] .ad-wrapper{display:none!important;}
        [data-rm="on"] aside{display:none!important;}
        [data-rm="on"] #main-content{max-width:680px!important;margin:0 auto!important;}
        [data-rm="on"] .prose{font-size:18px!important;line-height:2.1!important;}

        /* Prose */
        .prose{font-size:${fontSize}px;line-height:1.85;color:${dark?"rgba(250,248,244,.78)":"#3D3530"};}
        .prose p{margin-bottom:1.55rem;font-weight:300;}
        .prose h1,.prose h2{font-family:'DM Serif Display',serif;font-size:1.8rem;line-height:1.12;color:${dark?"#FAF8F4":"#1A1612"};margin:2.5rem 0 1rem;letter-spacing:-.015em;scroll-margin-top:96px;}
        .prose h2{font-size:1.65rem;border-bottom:1px solid ${border};padding-bottom:.5rem;}
        .prose h3{font-family:'DM Serif Display',serif;font-size:1.3rem;color:${dark?"#FAF8F4":"#1A1612"};margin:2rem 0 .75rem;scroll-margin-top:96px;}
        .prose h4{font-size:1rem;font-weight:700;color:${dark?"#FAF8F4":"#1A1612"};margin:1.5rem 0 .5rem;}
        .prose strong{color:${dark?"#FAF8F4":"#1A1612"};font-weight:700;}
        .prose em{font-style:italic;}
        .prose a{color:#E60023;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        .prose a:hover{opacity:.7;}
        .prose hr{border:none;border-top:1px solid ${border};margin:2.5rem 0;}
        .prose blockquote{margin:2rem 0;padding:1.4rem 1.75rem;border-left:3px solid #E60023;background:${dark?"rgba(230,0,35,.05)":"#FFF5F5"};border-radius:0 1rem 1rem 0;font-style:italic;color:${dark?"rgba(250,248,244,.65)":"#5A5046"};}
        .prose code{font-family:'Fira Code',monospace;background:${dark?"rgba(255,255,255,.07)":"#F0EBE3"};padding:.15em .45em;border-radius:5px;font-size:.87em;color:${dark?"#F2BFBE":"#1A1612"};}
        .prose pre{background:#1A1612;color:#FAF8F4;padding:1.5rem;border-radius:1rem;overflow-x:auto;margin:2rem 0;font-size:.87rem;line-height:1.6;}
        .prose pre code{background:transparent;padding:0;color:inherit;font-size:inherit;}
        .prose table{width:100%;margin:2rem 0;border-collapse:collapse;text-align:left;font-size:.9rem;}
        .prose th{font-weight:700;padding:.75rem 1rem;border-bottom:2px solid ${border};color:${dark?"#FAF8F4":"#1A1612"};}
        .prose td{padding:.75rem 1rem;border-bottom:1px solid ${border};color:${dark?"rgba(250,248,244,.7)":"#5A5046"};}
        .prose ol{counter-reset:step;list-style:none;margin:1.5rem 0;}
        .prose ol li{counter-increment:step;position:relative;padding-left:2.75rem;margin-bottom:1rem;}
        .prose ol li::before{content:counter(step);position:absolute;left:0;top:.05em;width:1.75rem;height:1.75rem;background:#1A1612;color:#FAF8F4;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;}
        .prose ul{list-style:none;margin:1.5rem 0;padding-left:0;}
        .prose ul li{padding-left:1.5rem;margin-bottom:.65rem;position:relative;font-weight:300;}
        .prose ul li::before{content:'—';position:absolute;left:0;color:#E60023;font-weight:700;}
        .prose img{width:100%;border-radius:1rem;margin:2rem 0;border:1px solid ${border};}
        .no-scrollbar{scrollbar-width:none;}
        .no-scrollbar::-webkit-scrollbar{display:none;}
        @media(max-width:1023px){aside{position:relative!important;top:0!important;max-height:none!important;overflow-y:visible!important;}}
      `}</style>

      <SelectionToolbar tip={selTip} onClose={()=>setSelTip(null)} onHighlight={saveHl}/>
      <ScrollToTop show={showTop}/>
      <FloatingShare title={fm.title} dark={dark}/>

      <div style={{background:bg,minHeight:"100vh"}}>
        <ProgressBar pct={progress}/>

        <Navbar dark={dark} toggleDark={toggleDark} incFont={incFont} decFont={decFont}
          readingMode={readingMode} toggleRM={toggleRM} content={content}/>

        <Breadcrumb category={fm.category} title={fm.title} dark={dark}/>

        <ArticleHeader fm={fm} readTime={readTime} dark={dark}
          onBk={toggleBookmark} bookmarked={bookmarked}
          finishTime={finishTime} streak={streak} views={views}/>

        <HeroImage src={fm.image} alt={fm.imageAlt||fm.title}/>

        {/* ── MAIN LAYOUT ── */}
        <div ref={layoutRef} className="max-w-[1280px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 items-start justify-between relative">

          {/* ARTICLE */}
          <main id="main-content" className="w-full lg:max-w-[calc(100%-356px)] min-w-0 flex-1">
            <article className="prose w-full" itemScope itemType="https://schema.org/BlogPosting">
              <meta itemProp="headline" content={fm.title}/>
              <meta itemProp="datePublished" content={fm.date}/>
              <meta itemProp="author" content={fm.author||SITE.name}/>

              {/* Key Takeaways — add takeaways: ["…","…"] to frontmatter */}
              <KeyTakeaways items={fm.takeaways} dark={dark}/>

              <AdUnit slot="4321098765" format="fluid" responsive="true" className="mb-6"/>

              <ReactMarkdown components={{
                h2:({children,...p})=>{ const id=slugToId(String(children).replace(/\s+/g," ").trim()); return <h2 id={id} {...p}>{children}</h2>; },
                h3:({children,...p})=>{ const id=slugToId(String(children).replace(/\s+/g," ").trim()); return <h3 id={id} {...p}>{children}</h3>; },
              }}>
                {content}
              </ReactMarkdown>

              <AdUnit slot="8765432109" format="auto" responsive="true" className="mt-8"/>

              {/* Pinterest save section — add pinterest: "https://pin.it/…" to frontmatter */}
              <PinterestSection url={fm.pinterest} boardUrl={fm.pinterestBoard} dark={dark} border={border}/>

              <ReactionBar slug={slug} dark={dark} border={border}/>
              <ArticleTags tags={fm.tags} dark={dark}/>

              {/* FAQ — add faqs: [{q:"…",a:"…"}] to frontmatter */}
              <FAQSection faqs={fm.faqs} dark={dark} border={border}/>
            </article>
          </main>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[300px] lg:shrink-0 z-20 self-start lg:sticky lg:top-[96px]" aria-label="Sidebar">
            <div ref={sidebarRef} className="no-scrollbar w-full pb-4">

              <SCard header="In This Post" dark={dark} delay={0}>
                <SmartTOC items={tocItems} activeId={activeId} secPct={secPct} overall={progress} dark={dark}/>
              </SCard>

              {/* Pinterest follow card */}
              <div className="rounded-2xl overflow-hidden mb-4" style={{background:"linear-gradient(135deg,#E60023,#ff6b6b)",border:"none"}}>
                <div className="p-5">
                  <PinIcon size={24} color="#fff"/>
                  <div className="font-['DM_Serif_Display',serif] text-[1.1rem] mt-3 mb-1" style={{color:"#fff"}}>Follow on Pinterest</div>
                  <p className="text-[.78rem] mb-4" style={{color:"rgba(255,255,255,.8)"}}>Get daily inspiration from Veeresh's boards.</p>
                  <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[.78rem] font-bold px-4 py-2 rounded-full transition-all hover:opacity-90 hover:-translate-y-px"
                    style={{background:"#fff",color:"#E60023"}}>
                    <PinIcon size={12}/> Follow
                  </a>
                </div>
              </div>

              <AISummaryCard content={content} dark={dark} border={border}/>
              <HighlightsPanel slug={slug} dark={dark} border={border}/>

              <SCard header="Sponsored" dark={dark} delay={40}>
                <AdUnit slot="2468101214" format="rectangle" responsive="false" style={{width:"100%",height:"250px"}}/>
              </SCard>

              {/* Affiliate products — add products: [{name,price,rating,link}] to frontmatter */}
              {Array.isArray(fm.products)&&fm.products.length>0&&(
                <SCard header="Products in This Post" dark={dark} delay={80}>
                  <div className="flex flex-col gap-3">
                    {fm.products.map((p,i)=><ProductCard key={i} product={p} dark={dark}/>)}
                  </div>
                  <p className="text-[.68rem] leading-relaxed mt-3 font-light" style={{color:dark?"rgba(250,248,244,.35)":"#9C8E84"}}>
                    🔗 Some links are affiliate links. You pay the same price — I earn a small commission. Thank you!
                  </p>
                </SCard>
              )}

              <SCard header="About the Author" dark={dark} delay={120}>
                <AuthorCard author={fm.author} dark={dark}/>
              </SCard>

              <SCard header="More Posts" dark={dark} delay={160}>
                {morePosts.length>0
                  ?morePosts.map((p,i)=><MorePostItem key={p.slug||i} post={p} dark={dark} isLast={i===morePosts.length-1}/>)
                  :<div className="text-[.8rem]" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}>No more posts yet.</div>}
              </SCard>
            </div>
          </aside>
        </div>

        {/* Mid-article ad */}
        <div className="max-w-[1280px] mx-auto px-6 mb-10">
          <AdUnit slot="1357911131" format="horizontal" responsive="true"/>
        </div>

        <PrevNextNav morePosts={morePosts} dark={dark}/>
        <CommentSection slug={slug} dark={dark}/>

        {/* Related posts */}
        <section className="max-w-[1280px] mx-auto px-6 pt-16 pb-24 border-t z-30 relative" style={{borderColor:border,background:bg}}>
          <div className="mb-8">
            <p className="text-[.72rem] font-bold tracking-[.12em] uppercase mb-2" style={{color:"#E60023"}}>Keep Reading</p>
            <h2 className="font-['DM_Serif_Display',serif] text-[1.9rem]" style={{color:dark?"#FAF8F4":"#1A1612"}}>You might also like</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {morePosts.length>0
              ?morePosts.map((p,i)=><RelatedCard key={p.slug||i} post={p} delay={i*80} dark={dark}/>)
              :<div className="text-sm" style={{color:dark?"rgba(250,248,244,.45)":"#7A6E64"}}>No related posts available.</div>}
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
}












// {
//       "slug": "toycills-vintage-toy-car-review",
//       "title": "Toycills Vintage 1:24 Die-Cast Car — Honest Review",
//       "tag": "Pinterest Picks",
//       "emoji": "🚗",
//       "gradient": "from-[#F5EFE6] to-[#E8DDD0]",
//       "meta": "5 min read · May 2026",
//       "type": "pinterest",
//       "image": "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/toycills-vintage-124-die-cast-car-review.png"
//     },
//     {
//       "slug": "redragon-k630-dragonborn-review",
//       "title": "Redragon K630 Dragonborn — Best Budget 60% Keyboard?",
//       "tag": "Pinterest Picks",
//       "emoji": "⌨️",
//       "gradient": "from-[#111827] to-[#1F2937]",
//       "meta": "7 min read · May 2026",
//       "type": "pinterest",
//       "image": "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/redragon-k630-dragonborn-review-banner.png"
//     },
//     {
//       "slug": "minimal-gaming-setup-ideas",
//       "title": "Minimal Gaming Setup Ideas That Look Expensive",
//       "tag": "Pinterest Picks",
//       "emoji": "🎮",
//       "gradient": "from-[#F8F5F1] to-[#EDE7DF]",
//       "meta": "6 min read · May 2026",
//       "type": "pinterest",
//       "image": "https://raw.githubusercontent.com/Veeresh36/bog_images/main/minimal-gaming-controller-setup-2026.png"
//     },