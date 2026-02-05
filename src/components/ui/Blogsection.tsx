"use client";

import { motion, Variants } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { ArrowUpRight, BookOpen, Clock, Tag } from "lucide-react";

// --- Types ---
interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

// --- Mock Data (Replace with your actual data source later) ---
const BLOG_POSTS: Post[] = [
  {
    id: "1",
    title: "The Age of Agentic AI: From Chatbots to Autonomous Agents",
    excerpt: "OpenAI's Operator and multi-step task automation signal a paradigm shift. AI agents now build 80% of enterprise databases—the future is autonomous.",
    date: "Feb 4, 2026",
    readTime: "6 min",
    category: "AI Trends",
    slug: "agentic-ai-era",
  },
  {
    id: "2",
    title: "Musk's Mega-Merger: SpaceX, Tesla & xAI Converge",
    excerpt: "In a stunning move, Elon Musk is merging three titans to create an AI-powered autonomous exploration powerhouse. What does this mean for the industry?",
    date: "Feb 3, 2026",
    readTime: "5 min",
    category: "Corporate",
    slug: "musk-merger",
  },
  {
    id: "3",
    title: "$300B Software Selloff: AI as an Existential Threat",
    excerpt: "Investor panic over AI tools replacing traditional software subscriptions triggers the biggest tech stock plunge of 2026. What's next for legacy software?",
    date: "Feb 2, 2026",
    readTime: "7 min",
    category: "Market",
    slug: "software-disruption",
  },
  {
    id: "4",
    title: "ElevenLabs Hits $11B Valuation: AI Voice Dominance",
    excerpt: "After raising $500M, voice AI startup ElevenLabs reaches unicorn status. Text-to-speech and audio synthesis are reshaping digital communication.",
    date: "Feb 1, 2026",
    readTime: "5 min",
    category: "AI Trends",
    slug: "elevenlabs-voice-ai",
  },
  {
    id: "5",
    title: "Deepfakes at Scale: 1.2M Children at Risk (UNICEF Report)",
    excerpt: "A joint report exposes 1.2 million children victimized by AI-generated explicit content. Urgent calls for legal action and technical safeguards emerge.",
    date: "Jan 31, 2026",
    readTime: "8 min",
    category: "Safety",
    slug: "deepfake-crisis",
  },
  {
    id: "6",
    title: "Snowflake x OpenAI: Building Enterprise Agents at Scale",
    excerpt: "A $200M partnership brings autonomous AI agents directly into the data cloud. Enterprises can now automate complex workflows end-to-end.",
    date: "Jan 29, 2026",
    readTime: "6 min",
    category: "Enterprise",
    slug: "snowflake-openai",
  },
  {
    id: "7",
    title: "NASA's Mars Rover: AI Takes Autonomous Control",
    excerpt: "Perseverance completes the first AI-planned drive on Mars. Autonomous systems are no longer just theoretical—they're working beyond Earth.",
    date: "Jan 27, 2026",
    readTime: "5 min",
    category: "Breakthrough",
    slug: "nasa-ai-mars",
  },
  {
    id: "8",
    title: "Medical AI Breakthrough: Detecting Hidden Diseases During Sleep",
    excerpt: "AI systems spot dangerous blood cells and diseases that human doctors miss, revolutionizing preventive healthcare and early diagnosis.",
    date: "Jan 25, 2026",
    readTime: "7 min",
    category: "Healthcare",
    slug: "medical-ai-detection",
  }
];

// --- Animations ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] } 
  },
};

export function BlogSection() {
  const hasPosts = BLOG_POSTS.length > 0;

  return (
    <section
      id="blog"
      className="relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.03),_transparent_50%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Transmissions
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Latest <span className="bg-gradient-to-r from-indigo-200 to-slate-400 bg-clip-text text-transparent">Signals.</span>
          </h2>
        </div>

        {hasPosts ? (
          /* BLOG GRID VIEW */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          >
            {BLOG_POSTS.map((post) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-indigo-500/30"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 text-xs font-medium text-indigo-400 mb-6">
                    <span className="flex items-center gap-1.5 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      <Tag className="h-3 w-3" /> {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 text-2xl font-semibold text-white group-hover:text-indigo-200 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="mb-8 text-slate-400 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.05] pt-6 mt-auto">
                  <span className="text-sm text-slate-500">{post.date}</span>
                  <a 
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-sm font-medium text-white group/link"
                  >
                    Decipher Signal
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                  </a>
                </div>
                
                {/* Subtle Hover Glow */}
                <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.article>
            ))}
          </motion.div>
        ) : (
          /* PLACEHOLDER / LOADING VIEW */
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
            className="relative flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.01] p-8 text-center backdrop-blur-sm md:p-16"
          >
            <div className="relative mb-8 h-64 w-64 md:h-80 md:w-80">
               <Globe className="absolute inset-0" />
               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,_#030308_70%)]" />
            </div>

            <h3 className="mb-4 text-2xl font-medium text-white md:text-3xl italic">
              Transmission Loading...
            </h3>
            
            <p className="max-w-md text-base text-slate-400 leading-relaxed mb-8">
              The satellite is still calibrating. Check back soon for thoughts on 
              Code, AI, and Engineering.
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              Return to Base
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}