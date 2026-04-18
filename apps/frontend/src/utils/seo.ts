// SEO helper functions for dynamic meta tags.

const SITE_URL = "https://grind.org.in";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
  robots?: string;
  structuredData?: Record<string, unknown>;
}

const upsertMetaTag = (
  selector: string,
  content: string,
  attribute: "name" | "property" = "name",
) => {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(
      attribute,
      selector
        .replace(/meta\[name="/, "")
        .replace(/"\]/, "")
        .replace(/meta\[property="/, "")
        .replace(/"\]/, ""),
    );
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", href);
};

const upsertStructuredData = (structuredData?: Record<string, unknown>) => {
  if (!structuredData) {
    return;
  }

  let script = document.querySelector(
    'script[type="application/ld+json"][data-page]',
  ) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-page", "true");
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(structuredData);
};

export const updateSEO = (config: SEOConfig) => {
  document.title = config.title;

  upsertMetaTag('meta[name="description"]', config.description);

  if (config.keywords) {
    upsertMetaTag('meta[name="keywords"]', config.keywords);
  }

  upsertMetaTag(
    'meta[property="og:title"]',
    config.ogTitle || config.title,
    "property",
  );
  upsertMetaTag(
    'meta[property="og:description"]',
    config.ogDescription || config.description,
    "property",
  );
  upsertMetaTag(
    'meta[property="og:url"]',
    config.ogUrl || config.canonical || window.location.href,
    "property",
  );
  upsertMetaTag('meta[property="og:type"]', "website", "property");

  if (config.ogImage) {
    upsertMetaTag('meta[property="og:image"]', config.ogImage, "property");
    upsertMetaTag('meta[name="twitter:image"]', config.ogImage);
  }

  upsertMetaTag(
    'meta[name="twitter:card"]',
    config.twitterCard || "summary_large_image",
  );
  upsertMetaTag('meta[name="twitter:title"]', config.ogTitle || config.title);
  upsertMetaTag(
    'meta[name="twitter:description"]',
    config.ogDescription || config.description,
  );

  upsertMetaTag(
    'meta[name="robots"]',
    config.robots || "index, follow, max-image-preview:large",
  );

  upsertCanonical(config.canonical || window.location.href);
  upsertStructuredData(config.structuredData);
};

export const seoConfigs = {
  home: {
    title: "Grind | Coding Practice, Online Compiler, and Interview Prep",
    description:
      "Grind helps developers improve coding skills with practice problems, an online compiler, and structured interview preparation.",
    keywords:
      "grind, coding practice, online compiler, interview preparation, data structures and algorithms, coding platform",
    ogTitle: "Grind | Improve Your Coding Skills",
    ogDescription:
      "Practice coding problems, run code online, and prepare for interviews in one developer-focused platform.",
    ogImage: "https://grind.org.in/og-image.png",
    canonical: "https://grind.org.in/",
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Grind",
      url: "https://grind.org.in/",
      description:
        "Coding practice platform with online compiler and interview preparation.",
    },
  } as SEOConfig,
  auth: {
    title: "Login or Sign Up | Grind",
    description:
      "Log in or create your Grind account to start practicing coding problems and improving interview skills.",
    canonical: "https://grind.org.in/auth",
    robots: "index, follow",
  } as SEOConfig,
  about: {
    title: "About Grind | Coding Platform for Developers",
    description:
      "Learn about Grind, our mission, and how we help developers build stronger coding and interview skills.",
    canonical: "https://grind.org.in/about",
    robots: "index, follow",
  } as SEOConfig,
  contact: {
    title: "Contact Grind | Support and Help",
    description:
      "Contact Grind for support, partnerships, and product questions.",
    canonical: "https://grind.org.in/contact-us",
    robots: "index, follow",
  } as SEOConfig,
  terms: {
    title: "Terms and Conditions | Grind",
    description:
      "Read Grind terms and conditions for using our coding platform and services.",
    canonical: "https://grind.org.in/terms-and-conditions",
    robots: "index, follow",
  } as SEOConfig,
  privacy: {
    title: "Privacy Policy | Grind",
    description:
      "Read Grind privacy policy to understand how data is collected, used, and protected.",
    canonical: "https://grind.org.in/privacy-policy",
    robots: "index, follow",
  } as SEOConfig,
  cancellation: {
    title: "Cancellation and Refund Policy | Grind",
    description:
      "Review cancellation and refund policy details for Grind premium services.",
    canonical: "https://grind.org.in/cancellation-policy",
    robots: "index, follow",
  } as SEOConfig,
  shipping: {
    title: "Shipping Policy | Grind",
    description: "Review Grind shipping policy and service delivery timelines.",
    canonical: "https://grind.org.in/shipping-policy",
    robots: "index, follow",
  } as SEOConfig,
  pricing: {
    title: "Pricing | Grind Premium Plans",
    description:
      "Compare Grind pricing plans and unlock premium coding tools and resources.",
    canonical: "https://grind.org.in/pricing",
    robots: "index, follow",
  } as SEOConfig,
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
    robots: "index, follow",
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
    robots: "index, follow",
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
    robots: "noindex, nofollow",
  },
  dsaNotes: {
    title: "Data Structures & Algorithms Notes | Grind",
    description:
      "Comprehensive DSA notes covering arrays, strings, trees, graphs, dynamic programming, and more. Learn with examples and complexity analysis.",
    keywords:
      "dsa notes, data structures, algorithms, programming notes, interview prep, coding notes, algorithm tutorials",
    ogTitle: "Complete DSA Notes - Grind",
    canonical: "https://grind.org.in/dsa-notes",
    robots: "noindex, nofollow",
  },
  faangQuestions: {
    title: "FAANG Interview Questions - Google, Amazon, Microsoft | Grind",
    description:
      "Premium collection of interview questions asked at FAANG companies. Real interview problems from Google, Amazon, Microsoft, Facebook, and Apple.",
    keywords:
      "faang questions, google interview, amazon interview, microsoft interview, facebook interview, apple interview, coding interview questions",
    ogTitle: "FAANG Interview Questions - Grind",
    canonical: "https://grind.org.in/premium-questions",
    robots: "noindex, nofollow",
  },
  resume: {
    title: "Resume Builder for Developers | Grind",
    description:
      "Build professional developer resumes with ATS-friendly templates. Highlight your coding projects, skills, and experience perfectly.",
    keywords:
      "resume builder, developer resume, ats resume, tech resume, programmer resume, software engineer resume",
    ogTitle: "Developer Resume Builder - Grind",
    canonical: "https://grind.org.in/resume",
    robots: "noindex, nofollow",
  },
  resumeAnalysis: {
    title: "AI Resume Analysis & Feedback | Grind",
    description:
      "Get AI-powered resume analysis with detailed feedback on formatting, keywords, ATS compatibility, and improvement suggestions.",
    keywords:
      "resume analysis, ats checker, resume feedback, resume review, ai resume analyzer",
    ogTitle: "AI Resume Analyzer - Grind",
    canonical: "https://grind.org.in/resume-analysis",
    robots: "noindex, nofollow",
  },
  notFound: {
    title: "Page Not Found | Grind",
    description: "The page you are looking for does not exist on Grind.",
    canonical: "https://grind.org.in/",
    robots: "noindex, nofollow",
  } as SEOConfig,
  fallback: {
    title: "Grind | Coding Practice Platform",
    description:
      "Grind helps developers improve coding skills with practice and interview preparation.",
    canonical: "https://grind.org.in/",
    robots: "noindex, nofollow",
  } as SEOConfig,
};

const normalizePath = (pathname: string) => {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
};

const withPathCanonical = (config: SEOConfig, pathname: string): SEOConfig => ({
  ...config,
  canonical: `${SITE_URL}${pathname === "/" ? "/" : pathname}`,
  ogUrl: `${SITE_URL}${pathname === "/" ? "/" : pathname}`,
});

export const resolveSEOConfig = (pathname: string): SEOConfig => {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") return seoConfigs.home;
  if (normalizedPath === "/auth") return seoConfigs.auth;
  if (normalizedPath === "/about") return seoConfigs.about;
  if (normalizedPath === "/contact-us") return seoConfigs.contact;
  if (normalizedPath === "/terms-and-conditions") return seoConfigs.terms;
  if (normalizedPath === "/privacy-policy") return seoConfigs.privacy;
  if (normalizedPath === "/cancellation-policy") return seoConfigs.cancellation;
  if (normalizedPath === "/shipping-policy") return seoConfigs.shipping;
  if (normalizedPath === "/pricing") return seoConfigs.pricing;
  if (normalizedPath === "/compiler") return seoConfigs.compiler;
  if (normalizedPath === "/problems") return seoConfigs.problems;
  if (normalizedPath === "/404") return seoConfigs.notFound;

  if (normalizedPath.startsWith("/problem/")) {
    return withPathCanonical(
      {
        title: "Coding Problem | Grind",
        description:
          "Solve coding challenges and improve your problem-solving skills on Grind.",
        robots: "noindex, nofollow",
      },
      normalizedPath,
    );
  }

  if (normalizedPath.startsWith("/contest")) {
    return withPathCanonical(
      {
        title: "Coding Contests | Grind",
        description:
          "Join coding contests on Grind and test your speed and problem-solving skills.",
        robots: "noindex, nofollow",
      },
      normalizedPath,
    );
  }

  if (
    normalizedPath.startsWith("/grind-ai") ||
    normalizedPath === "/you" ||
    normalizedPath === "/settings" ||
    normalizedPath === "/verify"
  ) {
    return withPathCanonical(
      {
        title: "Grind",
        description: "Developer tools and coding practice platform.",
        robots: "noindex, nofollow",
      },
      normalizedPath,
    );
  }

  return seoConfigs.fallback;
};
