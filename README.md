LIVE=https://www.bibek.tech/
# 🌐 Bibek Pathak — Portfolio  
Modern full-stack & data-driven portfolio built with **Next.js 16**, **TypeScript**, **Framer Motion**, and **TailwindCSS**.

This project showcases my work across **full-stack development**, **data/AI**, and **beautiful interactive UI engineering**.  
It includes custom animations, geometric hero design, project grids, certificate section, and a fully functional contact form with API routing.

---

## 🚀 Tech Stack

| Category | Technologies |
|---------|--------------|
| **Frontend** | Next.js 16 · React 19 · TypeScript · TailwindCSS · Framer Motion |
| **Backend** | Next.js Route Handlers · REST API |
| **Styling** | TailwindCSS · Custom Gradients · Glass UI · Shaders |
| **Deployment** | Vercel · GitHub Actions (Auto Deploy) |
| **Tools** | ESLint · Prettier · Lucide Icons |

---

## ✨ Features

### 🎨 Modern Landing + Hero Experience
- Smooth motion transitions  
- Floating geometric shapes  
- Gradient overlays + glass effect  

### 🛠 Project Showcase  
- Responsive project cards  
- Clean hover animations  
- Structured metadata for SEO  

### 🎓 Certificate Section  
- Minimal card layouts  
- Hover expansion & depth effects  
- Positioned above Contact section  

### 💬 Rich Contact Section  
- Functional contact form  
- `/api/contact` backend endpoint  
- Success + error states w/animations  

### 🌑 Dark Aesthetic  
- Consistent glassy dark UI  
- Neon gradients  
- Soft shadows & layered depth  

---

## 📁 Project Structure

```bash
src/
 ├── app/
 │   ├── api/contact/route.ts    # Contact form backend API
 │   ├── layout.tsx              # Metadata + root layout
 │   ├── page.tsx                # Homepage
 │
 ├── components/ui/
 │   ├── main-navbar.tsx
 │   ├── demo-hero-geometric.tsx
 │   ├── about-section.tsx
 │   ├── projects-section.tsx
 │   ├── certificates-section.tsx
 │   ├── contact-section.tsx
 │   └── tech-stack.tsx
 │
 ├── lib/utils.ts
 └── styles/globals.css
