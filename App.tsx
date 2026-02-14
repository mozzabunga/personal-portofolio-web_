
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Linkedin, MapPin, 
  ChevronRight, Briefcase, 
  Terminal, Camera, RefreshCw,
  Settings, Plus, Trash2, Code, Save, X, Zap, FileJson, AlertCircle, Share2, Check, Image as ImageIcon
} from 'lucide-react';
import { portfolioData } from './data/portfolioData';
import ThreeBackground from './components/ThreeBackground';
import Chatbot from './components/Chatbot';
import { Experience, Project, PortfolioData, SkillGroup } from './types';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="p-3 bg-zinc-900/50 border border-blue-500/20 rounded-xl text-blue-400">
      <Icon size={24} />
    </div>
    <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tighter">
      {children}
    </h2>
    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent ml-4"></div>
  </div>
);

const App: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string>(portfolioData.profileImage);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [localExperience, setLocalExperience] = useState<Experience[]>([]);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [localSkills, setLocalSkills] = useState<SkillGroup[]>([]);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isVisitorMode, setIsVisitorMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allExperience = [...localExperience, ...portfolioData.experience];
  const allProjects = [...localProjects, ...portfolioData.projects];
  const allSkills = [...localSkills, ...portfolioData.skills];

  useEffect(() => {
    // Check if HR view is active
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'hr') {
      setIsVisitorMode(true);
    }

    // Load session overrides
    const savedImage = localStorage.getItem('mozza_profile_img');
    if (savedImage) setHeroImage(savedImage);

    const savedExp = localStorage.getItem('mozza_custom_experience');
    if (savedExp) setLocalExperience(JSON.parse(savedExp));

    const savedProj = localStorage.getItem('mozza_custom_projects');
    if (savedProj) setLocalProjects(JSON.parse(savedProj));

    const savedSkills = localStorage.getItem('mozza_custom_skills');
    if (savedSkills) setLocalSkills(JSON.parse(savedSkills));
  }, []);

  const handleShareToHR = () => {
    const hrUrl = `${window.location.origin}${window.location.pathname}?view=hr`;
    navigator.clipboard.writeText(hrUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setHeroImage(base64String);
        localStorage.setItem('mozza_profile_img', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setHeroImage(portfolioData.profileImage);
    localStorage.removeItem('mozza_profile_img');
  };

  const clearLocalData = () => {
    if (window.confirm("This will clear your local session. Ensure you have downloaded your updated 'portfolioData.ts' first!")) {
      setLocalExperience([]);
      setLocalProjects([]);
      setLocalSkills([]);
      localStorage.removeItem('mozza_custom_experience');
      localStorage.removeItem('mozza_custom_projects');
      localStorage.removeItem('mozza_custom_skills');
      setIsAdminOpen(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative bg-[#050505] text-zinc-200 selection:bg-blue-500/30">
      <ThreeBackground isConsoleOpen={isAdminOpen} />
      
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center gap-3 font-black text-xs uppercase tracking-widest border border-blue-400/30"
          >
            <Check size={18} /> Professional Link Copied
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 p-6 glass border-b border-white/5 flex justify-between items-center">
        <div 
          className="text-xl font-black text-white tracking-widest cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          MT <span className="text-blue-500 italic group-hover:text-blue-400 transition-colors">.07</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
          <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
          <button onClick={() => scrollToSection('experience')} className="hover:text-white transition-colors">Experience</button>
          <button onClick={() => scrollToSection('skills')} className="hover:text-white transition-colors">Skills</button>
          <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">Projects</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Work Together</button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShareToHR}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase rounded-xl hover:border-blue-500/50 transition-all shadow-xl group"
          >
            <Share2 size={14} className="group-hover:text-blue-400" /> Share to HR
          </button>
          
          {!isVisitorMode && (
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="p-3 bg-zinc-900/50 rounded-xl text-zinc-500 hover:text-blue-400 transition-colors border border-white/5 hover:border-blue-500/20 group"
              title="Open System Console"
            >
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          )}

          <a 
            href={`mailto:${portfolioData.contact.email}`}
            className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
          >
            Hire Me
          </a>
        </div>
      </nav>

      <header className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div className="relative group cursor-pointer" whileHover="hover" initial="initial">
            <motion.div className="w-72 h-72 md:w-[450px] md:h-[450px] relative flex-shrink-0">
              <div className="absolute inset-0 rounded-[3rem] border-2 border-blue-500/20 -rotate-3 scale-105"></div>
              <div className="absolute inset-0 rounded-[3rem] border-2 border-purple-500/10 rotate-2 scale-105"></div>
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-2xl relative z-10 bg-zinc-900">
                <motion.img 
                  src={heroImage} 
                  className="w-full h-full object-cover block"
                  variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'; }}
                />
                {!isVisitorMode && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-12 gap-6 z-20">
                    <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl active:scale-90"><Camera size={24} /></button>
                    <button onClick={(e) => { e.stopPropagation(); resetImage(); }} className="p-4 bg-zinc-800 text-white rounded-2xl active:scale-90"><RefreshCw size={24} /></button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div className="absolute inset-0 bg-blue-500/10 blur-[120px] -z-10 rounded-full scale-125"></div>
            </motion.div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <FadeIn>
              <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.85] tracking-tighter mb-6">
                {portfolioData.name.split(' ')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-600">
                  {portfolioData.name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-zinc-400 font-medium mb-12 max-w-2xl leading-tight opacity-90">
                {portfolioData.headline}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <button onClick={() => scrollToSection('experience')} className="px-12 py-5 bg-white text-black font-black uppercase text-sm rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 group active:scale-95">
                  Explore Work <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href={`mailto:${portfolioData.contact.email}`} className="px-12 py-5 bg-zinc-900/80 text-white font-black uppercase text-sm rounded-2xl border border-white/10 hover:border-blue-500 transition-all flex items-center gap-3 backdrop-blur-md active:scale-95">
                  Get In Touch <Mail size={20} />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </header>

      <main className="px-6 max-w-7xl mx-auto space-y-40 py-20 relative z-10">
        <section id="about" className="scroll-mt-32">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <Terminal size={14} /> Professional Identity
                </div>
                <p className="text-2xl md:text-3xl text-zinc-300 leading-snug font-light italic border-l-4 border-blue-500 pl-8 py-2">
                  "{portfolioData.summary}"
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 glass rounded-3xl border border-white/5 shadow-xl group hover:border-blue-500/30 transition-all">
                    <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Credential</p>
                    <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">BNSP Certified</p>
                  </div>
                  <div className="p-8 glass rounded-3xl border border-white/5 shadow-xl group hover:border-blue-500/30 transition-all">
                    <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Industry focus</p>
                    <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">Manufaktur / AI</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(portfolioData.contact).map(([key, val], idx) => (
                  <div key={idx} className="flex items-center gap-5 p-7 glass rounded-3xl hover:bg-zinc-800/50 transition-all border border-white/5 group">
                    <div className="text-blue-500 group-hover:scale-110 transition-transform">
                      {key === 'email' && <Mail size={24} />}
                      {key === 'phone' && <Phone size={24} />}
                      {key === 'linkedin' && <Linkedin size={24} />}
                      {key === 'location' && <MapPin size={24} />}
                    </div>
                    <div className="overflow-hidden text-xs font-mono text-zinc-400 truncate tracking-tighter">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="experience" className="scroll-mt-32">
          <SectionHeading icon={Briefcase}>Professional Background</SectionHeading>
          <div className="space-y-16">
            {allExperience.map((exp, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group relative pl-8 md:pl-20 border-l-2 border-zinc-800 hover:border-blue-500 transition-all duration-500">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:bg-blue-500 group-hover:scale-125 transition-all"></div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-8">
                    <div className="flex-1">
                      <h4 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{exp.role}</h4>
                      <div className="flex items-center gap-3 mt-3">
                         <p className="text-blue-500 font-black text-xs uppercase tracking-widest">{exp.company}</p>
                         <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                         <p className="text-zinc-500 font-bold text-xs uppercase">{exp.type}</p>
                      </div>
                    </div>
                    {exp.image && (
                      <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 glass p-3 flex items-center justify-center shrink-0 shadow-2xl group-hover:border-blue-500/30 transition-all">
                        <img src={exp.image} alt={exp.company} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-1">{exp.period}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-6">
                    {exp.achievements.map((achievement, aIdx) => (
                      <li key={aIdx} className="text-sm text-zinc-400 flex gap-4 p-6 glass rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all hover:translate-y-[-2px]">
                        <ChevronRight size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-32">
          <SectionHeading icon={Zap}>Capability Index</SectionHeading>
          <div className="grid md:grid-cols-3 gap-8">
            {allSkills.map((skillGroup, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glass rounded-[3rem] border border-white/5 h-full hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col">
                  {skillGroup.image && (
                    <div className="w-full h-44 relative overflow-hidden">
                      <img src={skillGroup.image} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-70 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="p-10 flex-1 relative z-10">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-8">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-3">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span key={sIdx} className="px-4 py-2.5 bg-zinc-900/40 text-zinc-300 text-[10px] font-black uppercase rounded-xl border border-white/5 hover:border-blue-500/40 transition-all cursor-default shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-32">
          <SectionHeading icon={Code}>Practical Portfolio</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12">
            {allProjects.map((project, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glass rounded-[3rem] border border-white/5 hover:border-blue-500/30 transition-all group h-full overflow-hidden flex flex-col shadow-2xl relative">
                  {project.image && (
                    <div className="w-full h-72 overflow-hidden relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="p-12 flex-1 relative">
                    <div className="flex justify-between items-start mb-8">
                      <h4 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight leading-none">{project.title}</h4>
                      <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-full uppercase tracking-widest">{project.year}</span>
                    </div>
                    <p className="text-base text-zinc-400 mb-12 leading-relaxed italic opacity-80">"{project.description}"</p>
                    <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-white/5">
                      {project.stack.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">#{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24 border-t border-white/5">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto space-y-16">
              <div className="space-y-4">
                <h2 className="text-8xl md:text-[180px] font-black text-white tracking-tighter leading-none uppercase select-none opacity-90 transition-all hover:text-blue-600">WORK TOGETHER.</h2>
                <p className="text-zinc-500 text-sm uppercase font-black tracking-[0.5em]">Ready for new professional challenges</p>
              </div>
              <div className="flex justify-center gap-10">
                <a href={`mailto:${portfolioData.contact.email}`} className="w-24 h-24 rounded-[2.5rem] glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-90 shadow-2xl group">
                   <Mail size={40} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={`https://${portfolioData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-[2.5rem] glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-90 shadow-2xl group">
                   <Linkedin size={40} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <div className="pt-20">
                 <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[1.2em]">© {new Date().getFullYear()} MOZZA BUNGA TARMUJI • KARAWANG INDONESIA</p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <Chatbot />

      <AnimatePresence>
        {isAdminOpen && !isVisitorMode && (
          <AdminConsole 
            onClose={() => setIsAdminOpen(false)}
            onAddProject={(p: Project) => { setLocalProjects([p, ...localProjects]); localStorage.setItem('mozza_custom_projects', JSON.stringify([p, ...localProjects])); }}
            onAddExperience={(e: Experience) => { setLocalExperience([e, ...localExperience]); localStorage.setItem('mozza_custom_experience', JSON.stringify([e, ...localExperience])); }}
            onAddSkill={(s: SkillGroup) => { setLocalSkills([s, ...localSkills]); localStorage.setItem('mozza_custom_skills', JSON.stringify([s, ...localSkills])); }}
            onClearSession={clearLocalData}
            localProjects={localProjects}
            localExperience={localExperience}
            localSkills={localSkills}
            onDeleteProject={(i: number) => { const updated = localProjects.filter((_, idx) => idx !== i); setLocalProjects(updated); localStorage.setItem('mozza_custom_projects', JSON.stringify(updated)); }}
            onDeleteExperience={(i: number) => { const updated = localExperience.filter((_, idx) => idx !== i); setLocalExperience(updated); localStorage.setItem('mozza_custom_experience', JSON.stringify(updated)); }}
            onDeleteSkill={(i: number) => { const updated = localSkills.filter((_, idx) => idx !== i); setLocalSkills(updated); localStorage.setItem('mozza_custom_skills', JSON.stringify(updated)); }}
            allExperience={allExperience}
            allProjects={allProjects}
            allSkills={allSkills}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminConsole = ({ 
  onClose, onAddProject, onAddExperience, onAddSkill, onClearSession,
  localProjects, localExperience, localSkills, onDeleteProject, onDeleteExperience, onDeleteSkill,
  allExperience, allProjects, allSkills 
}: any) => {
  const [activeTab, setActiveTab] = useState<'project' | 'experience' | 'skill' | 'export'>('project');
  const [projectForm, setProjectForm] = useState<Project>({ title: '', description: '', year: '2025', stack: [], image: '' });
  const [expForm, setExpForm] = useState<Experience>({ role: '', company: '', period: '', location: '', type: 'Professional', achievements: [], image: '' });
  const [skillForm, setSkillForm] = useState<SkillGroup>({ category: '', items: [], image: '' });
  const [newAchievement, setNewAchievement] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newSkillItem, setNewSkillItem] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any, currentForm: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter({ ...currentForm, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const downloadFile = () => {
    const fullData: PortfolioData = { ...portfolioData, experience: allExperience, projects: allProjects, skills: allSkills };
    const content = `import { PortfolioData } from '../types';\n\nexport const portfolioData: PortfolioData = ${JSON.stringify(fullData, null, 2)};`;
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl p-4 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest">Master Control Interface // ACTIVE</p>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">CORE.MANAGER</h2>
          </div>
          <button onClick={onClose} className="p-5 bg-zinc-900 rounded-3xl hover:bg-zinc-800 transition-all border border-white/5 text-zinc-400 hover:text-white active:scale-90 shadow-2xl"><X size={28} /></button>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          {['project', 'experience', 'skill', 'export'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-zinc-900/50 text-zinc-500 border border-white/5 hover:border-blue-500/20'}`}
            >
              {tab === 'export' ? 'PUBLISH DATA' : `+ ADD ${tab}`}
            </button>
          ))}
        </div>

        <div className="glass p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          
          {activeTab === 'project' && (
            <div className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <input value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" placeholder="Project Title" />
                  <input value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" placeholder="Year (e.g. 2025)" />
                </div>
                <div className="h-52 border-2 border-dashed border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                  {projectForm.image ? (
                    <><img src={projectForm.image} className="absolute inset-0 w-full h-full object-cover opacity-60" /><button onClick={() => setProjectForm({...projectForm, image: ''})} className="relative z-10 p-3 bg-red-600 rounded-2xl text-white shadow-xl hover:bg-red-500 transition-colors"><Trash2 size={20} /></button></>
                  ) : (
                    <><ImageIcon className="text-zinc-600 group-hover:text-blue-500" size={40} /><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProjectForm, projectForm)} className="absolute inset-0 opacity-0 cursor-pointer" /><p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Click to upload visual</p></>
                  )}
                </div>
              </div>
              <textarea value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white h-40 outline-none resize-none focus:border-blue-500 transition-all" placeholder="Project summary and impact..." />
              <input value={newStack} onChange={e => setNewStack(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newStack.trim()) { setProjectForm({...projectForm, stack: [...projectForm.stack, newStack.trim()]}); setNewStack(''); } }} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500 transition-all" placeholder="Tech Stack (Press Enter to add tags)" />
              <button onClick={() => { onAddProject(projectForm); onClose(); }} className="w-full py-6 bg-white text-black font-black uppercase text-sm rounded-3xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">Deploy Project Entry</button>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <input value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" placeholder="Job Role" />
                  <input value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" placeholder="Company Name" />
                </div>
                <div className="h-52 border-2 border-dashed border-white/10 rounded-[2.5rem] p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
                  {expForm.image ? (
                    <><img src={expForm.image} className="w-24 h-24 object-contain relative z-10" /><button onClick={() => setExpForm({...expForm, image: ''})} className="relative z-10 p-3 bg-red-600 rounded-2xl text-white mt-4 shadow-xl"><Trash2 size={18} /></button></>
                  ) : (
                    <><ImageIcon size={40} className="text-zinc-600 group-hover:text-blue-500" /><input type="file" onChange={(e) => handleFileUpload(e, setExpForm, expForm)} className="absolute inset-0 opacity-0" /><p className="text-[10px] uppercase font-black text-zinc-500 mt-4 tracking-widest">Upload Company Logo</p></>
                  )}
                </div>
              </div>
              <input value={newAchievement} onChange={e => setNewAchievement(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newAchievement.trim()) { setExpForm({...expForm, achievements: [...expForm.achievements, newAchievement.trim()]}); setNewAchievement(''); } }} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" placeholder="Add Key Achievement (Press Enter)" />
              <button onClick={() => { onAddExperience(expForm); onClose(); }} className="w-full py-6 bg-white text-black font-black uppercase text-sm rounded-3xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">Register Experience</button>
            </div>
          )}

          {activeTab === 'skill' && (
            <div className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <input value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" placeholder="Category Name" />
                <div className="h-24 border-2 border-dashed border-white/10 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30">
                  {skillForm.image ? (
                    <div className="flex items-center gap-6"><img src={skillForm.image} className="w-12 h-12 object-contain" /><button onClick={() => setSkillForm({...skillForm, image: ''})} className="p-2.5 bg-red-600 rounded-xl text-white shadow-lg"><Trash2 size={14} /></button></div>
                  ) : (
                    <><input type="file" onChange={(e) => handleFileUpload(e, setSkillForm, skillForm)} className="absolute inset-0 opacity-0" /><p className="text-[10px] uppercase font-black text-zinc-500">Upload Visual Icon</p></>
                  )}
                </div>
              </div>
              <input value={newSkillItem} onChange={e => setNewSkillItem(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newSkillItem.trim()) { setSkillForm({...skillForm, items: [...skillForm.items, newSkillItem.trim()]}); setNewSkillItem(''); } }} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" placeholder="Add Skill Item (Press Enter)" />
              <button onClick={() => { onAddSkill(skillForm); onClose(); }} className="w-full py-6 bg-white text-black font-black uppercase text-sm rounded-3xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">Commit Skill Matrix</button>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-12 relative z-10 text-center py-8">
              <div className="p-12 bg-blue-600/10 border border-blue-500/20 rounded-[3.5rem] inline-block w-full">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  <FileJson size={40} className="text-white" />
                </div>
                <h4 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter leading-none">SYSTEM SYNC REQUIRED</h4>
                <p className="text-zinc-500 text-sm mb-12 max-w-lg mx-auto leading-relaxed">
                  To save your visual uploads and profile updates permanently, download the generated file and replace <strong>data/portfolioData.ts</strong> in your source folder.
                </p>
                <button 
                  onClick={downloadFile} 
                  className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs hover:bg-blue-500 transition-all shadow-2xl flex items-center gap-3 mx-auto active:scale-95"
                >
                  <FileJson size={20} /> Generate portfolioData.ts
                </button>
              </div>
              <button onClick={onClearSession} className="text-zinc-700 font-black uppercase text-[10px] tracking-[0.5em] hover:text-red-500 transition-all pt-8">TERMINATE SESSION HISTORY</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default App;
