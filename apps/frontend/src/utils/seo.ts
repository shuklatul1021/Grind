
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
  structuredData?: object;
}

export const updateSEO = (config: SEOConfig) => {
  document.title = config.title;
  const updateMetaTag = (
    selector: string,
    content: string,
    attribute: "name" | "property" = "name"
  ) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(
        attribute,
        selector
          .replace(/meta\[name="/, "")
          .replace(/"\]/, "")
          .replace(/meta\[property="/, "")
          .replace(/"\]/, "")
      );
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  updateMetaTag('meta[name="description"]', config.description);
  if (config.keywords) {
    updateMetaTag('meta[name="keywords"]', config.keywords);
  }
  updateMetaTag(
    'meta[property="og:title"]',
    config.ogTitle || config.title,
    "property"
  );
  updateMetaTag(
    'meta[property="og:description"]',
    config.ogDescription || config.description,
    "property"
  );
  updateMetaTag(
    'meta[property="og:url"]',
    config.ogUrl || window.location.href,
    "property"
  );
  if (config.ogImage) {
    updateMetaTag('meta[property="og:image"]', config.ogImage, "property");
  }
  updateMetaTag('meta[property="og:type"]', "website", "property");
  updateMetaTag(
    'meta[name="twitter:card"]',
    config.twitterCard || "summary_large_image"
  );
  updateMetaTag('meta[name="twitter:title"]', config.ogTitle || config.title);
  updateMetaTag(
    'meta[name="twitter:description"]',
    config.ogDescription || config.description
  );
  if (config.ogImage) {
    updateMetaTag('meta[name="twitter:image"]', config.ogImage);
  }

  let canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", config.canonical || window.location.href);
  if (config.structuredData) {
    let script = document.querySelector(
      'script[type="application/ld+json"][data-page]'
    );
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-page", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(config.structuredData);
  }
};

export const seoConfigs = {
  compiler: {
    title: "Online Compiler - Run Code in Multiple Languages | Grind",
    description:
      "Free online compiler supporting Python, JavaScript, Java, C++, C, Go, Rust, and more. Write, compile, and run code instantly in your browser. Perfect for coding practice and learning.",
    keywords:
      "online compiler, code editor, python compiler, javascript compiler, java compiler, c++ compiler, run code online, programming practice, coding tool, grind compiler",
    ogTitle: "Online Multi-Language Compiler - Grind",
    ogDescription:
      "Write, compile and run code in 10+ programming languages instantly. Free online IDE with code history and real-time execution.",
    ogImage: "https://grind.org.in/compiler-preview.png",
    canonical: "https://grind.org.in/compiler",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Grind Online Compiler",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free online compiler supporting multiple programming languages including Python, JavaScript, Java, C++, Go, and Rust. Write, compile and execute code instantly.",
      featureList: [
        "Multi-language support",
        "Real-time code execution",
        "Code history tracking",
        "Syntax highlighting",
        "Dark mode support",
        "Download code",
        "Copy to clipboard",
      ],
      screenshot: "https://grind.org.in/compiler-screenshot.png",
      author: {
        "@type": "Organization",
        name: "Grind",
      },
    },
  },
  problems: {
    title: "Coding Problems & Practice Questions | Grind",
    description:
      "Solve 500+ coding problems and practice questions. Filter by difficulty, companies (Google, Amazon, Microsoft), and topics. Perfect for interview preparation.",
    keywords:
      "coding problems, practice questions, algorithm problems, data structures, interview preparation, leetcode alternative, coding practice, dsa problems",
    ogTitle: "500+ Coding Problems - Grind",
    ogDescription:
      "Master coding interviews with curated problems from top companies like Google, Amazon, and Microsoft.",
    canonical: "https://grind.org.in/problems",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Coding Problems Collection",
      description:
        "Comprehensive collection of coding problems for interview preparation",
      numberOfItems: "500+",
      author: {
        "@type": "Organization",
        name: "Grind",
      },
    },
  },
  workspace: {
    title: "Premium Coding Workspace - Advanced IDE | Grind",
    description:
      "Premium coding workspace with VS Code features, auto-completion, multi-language support, and advanced debugging. Best online IDE for serious developers.",
    keywords:
      "online ide, coding workspace, premium code editor, vs code online, advanced ide, coding environment, developer workspace",
    ogTitle: "Premium Coding Workspace - Grind",
    canonical: "https://grind.org.in/workspace",
  },
  dsaNotes: {
    title: "Data Structures & Algorithms Notes | Grind",
    description:
      "Comprehensive DSA notes covering arrays, strings, trees, graphs, dynamic programming, and more. Learn with examples and complexity analysis.",
    keywords:
      "dsa notes, data structures, algorithms, programming notes, interview prep, coding notes, algorithm tutorials",
    ogTitle: "Complete DSA Notes - Grind",
    canonical: "https://grind.org.in/dsa-notes",
  },
  faangQuestions: {
    title: "FAANG Interview Questions - Google, Amazon, Microsoft | Grind",
    description:
      "Premium collection of interview questions asked at FAANG companies. Real interview problems from Google, Amazon, Microsoft, Facebook, and Apple.",
    keywords:
      "faang questions, google interview, amazon interview, microsoft interview, facebook interview, apple interview, coding interview questions",
    ogTitle: "FAANG Interview Questions - Grind",
    canonical: "https://grind.org.in/premium-questions",
  },
  resume: {
    title: "Resume Builder for Developers | Grind",
    description:
      "Build professional developer resumes with ATS-friendly templates. Highlight your coding projects, skills, and experience perfectly.",
    keywords:
      "resume builder, developer resume, ats resume, tech resume, programmer resume, software engineer resume",
    ogTitle: "Developer Resume Builder - Grind",
    canonical: "https://grind.org.in/resume",
  },
  resumeAnalysis: {
    title: "AI Resume Analysis & Feedback | Grind",
    description:
      "Get AI-powered resume analysis with detailed feedback on formatting, keywords, ATS compatibility, and improvement suggestions.",
    keywords:
      "resume analysis, ats checker, resume feedback, resume review, ai resume analyzer",
    ogTitle: "AI Resume Analyzer - Grind",
    canonical: "https://grind.org.in/resume-analysis",
  },
};
