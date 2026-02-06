"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Sparkles } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  image?: string;
  author: string;
}

// --- Mock Data ---
const BLOG_POSTS: Post[] = [
  {
    id: "1",
    title: "The Age of Agentic AI: From Chatbots to Autonomous Agents",
    excerpt: "OpenAI's Operator and multi-step task automation signal a paradigm shift. AI agents now build 80% of enterprise databases—the future is autonomous.",
    date: "Feb 4, 2026",
    readTime: "6 min read",
    category: "AI Trends",
    slug: "agentic-ai-era",
    author: "Bibek"
  },
  {
    id: "2",
    title: "Musk's Mega-Merger: SpaceX, Tesla & xAI Converge",
    excerpt: "In a stunning move, Elon Musk is merging three titans to create an AI-powered autonomous exploration powerhouse. What does this mean for the industry?",
    date: "Feb 3, 2026",
    readTime: "5 min read",
    category: "Corporate",
    slug: "musk-merger",
    author: "Bibek"
  },
  {
    id: "3",
    title: "$300B Software Selloff: AI as an Existential Threat",
    excerpt: "Investor panic over AI tools replacing traditional software subscriptions triggers the biggest tech stock plunge of 2026. What's next for legacy software?",
    date: "Feb 2, 2026",
    readTime: "7 min read",
    category: "Market",
    slug: "software-disruption",
    author: "Bibek"
  },
  {
    id: "4",
    title: "ElevenLabs Hits $11B Valuation: AI Voice Dominance",
    excerpt: "After raising $500M, voice AI startup ElevenLabs reaches unicorn status. Text-to-speech and audio synthesis are reshaping digital communication.",
    date: "Feb 1, 2026",
    readTime: "5 min read",
    category: "AI Trends",
    slug: "elevenlabs-voice-ai",
    author: "Bibek"
  }
];

// --- Components ---

function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-all duration-300"
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-indigo-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            {post.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
          </div>
        </div>

        <h3 className="mb-3 text-xl font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
          {post.excerpt}
        </p>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/[0.08] pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{post.readTime}</span>
        </div>

        <a
          href={`/blog/${post.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-white group-hover:text-indigo-300 transition-colors"
        >
          Read Post
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
}

export function BlogSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="blog"
      ref={containerRef}
      className="relative w-full border-t border-white/[0.08] bg-[#030308] py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03),_transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-white/60 mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Insights
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Thoughts on <span className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">Software & AI.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-base text-slate-400 md:text-lg leading-relaxed"
          >
            Exploring the frontiers of agentic workflows, autonomous systems, and the future of human-computer interaction.
          </motion.p>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {BLOG_POSTS.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="/blog"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-indigo-50 hover:pl-5 hover:pr-7"
          >
            Read all articles
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
