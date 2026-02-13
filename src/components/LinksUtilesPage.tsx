import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AiTool {
  name: string;
  description: string;
  url: string;
  favicon: string;
  gradient: string;
}

const AI_TOOLS: AiTool[] = [
  {
    name: 'Google AI Studio',
    description: 'Generation d\'images et prompts avances avec Gemini Flash',
    url: 'https://aistudio.google.com/prompts/new_chat?model=gemini-2.5-flash-image&prompt=Photo%208K.%20',
    favicon: 'https://www.gstatic.com/aistudio/ai_studio_favicon_32x32.png',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Gemini',
    description: 'Assistant IA conversationnel de Google',
    url: 'https://gemini.google.com/app?hl=fr',
    favicon: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    name: 'ChatGPT',
    description: 'Assistant IA polyvalent d\'OpenAI',
    url: 'https://chatgpt.com/',
    favicon: 'https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Perplexity',
    description: 'Moteur de recherche intelligent avec sources',
    url: 'https://www.perplexity.ai/',
    favicon: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'AI Enhancer',
    description: 'Amelioration et upscaling d\'images par IA',
    url: 'https://aienhancer.ai/',
    favicon: 'https://www.google.com/s2/favicons?domain=aienhancer.ai&sz=64',
    gradient: 'from-rose-500 to-orange-400',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function LinksUtilesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuseau-accent to-fuseau-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Liens utiles IA</h1>
        </div>
        <p className="text-sm text-gray-500 ml-[52px]">
          Acces rapide aux outils IA du service marketing
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {AI_TOOLS.map((tool) => (
          <motion.a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg hover:border-gray-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 p-2 ring-1 ring-gray-100 transition-all duration-200 group-hover:ring-gray-200 group-hover:shadow-sm">
                <img
                  src={tool.favicon}
                  alt=""
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', ...tool.gradient.split(' '));
                      const span = document.createElement('span');
                      span.className = 'text-white font-bold text-lg';
                      span.textContent = tool.name.charAt(0);
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-300 transition-colors duration-200 group-hover:text-fuseau-accent" />
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>

            <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${tool.gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
