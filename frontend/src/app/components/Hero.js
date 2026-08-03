"use client";
import { FaLinkedinIn, FaGithub, FaTwitter, FaMediumM } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { motion } from 'framer-motion';

const iconMap = {
    linkedin: FaLinkedinIn,
    twitter: FaTwitter,
    medium: FaMediumM,
    github: FaGithub,
    email: HiOutlineMail,
};

const Hero = ({ content, projects = [], skills = [] }) => {
    const hero = content?.hero || {};
    const sections = content?.sections || {};
    const socialLinks = Array.isArray(hero.socialLinks) ? hero.socialLinks : [];

    return (
        <div id="home" className="w-full relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_38%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_35%),linear-gradient(180deg,_rgba(18,18,18,0.98),_rgba(18,18,18,1))]" />
            {socialLinks.length ? (
                <div className="fixed left-6 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col space-y-8 z-10">
                    {socialLinks.map((link) => {
                        const Icon = iconMap[link.icon];

                        if (!Icon) {
                            return null;
                        }

                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-gray-400 hover:text-purple-accent dark:hover:text-purple-light transition-colors duration-300"
                                aria-label={link.label}
                                target={link.target || '_self'}
                                rel={link.target === '_blank' ? 'noreferrer' : undefined}
                            >
                                <Icon size={24} />
                            </a>
                        );
                    })}
                </div>
            ) : null}
            
            <div className="section-container min-h-screen flex items-center">
                <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center w-full">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-sm tracking-widest text-purple-accent font-medium uppercase mb-1">{hero.preTitle}</p>
                            <h1 className="mb-2">{hero.name}</h1>
                            <h2 className="text-heading-3 text-gray-400 dark:text-gray-300 mb-4">{hero.title}</h2>
                            <p className="text-body-large text-gray-600 dark:text-gray-300 max-w-[90%] md:max-w-[80%]">
                                {hero.description}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                {Array.isArray(hero.ctas) ? hero.ctas.map((cta) => (
                                    <a key={cta.label} href={cta.href} className={cta.variant === 'outline' ? 'btn btn-outline' : 'btn btn-primary'}>
                                        {cta.label}
                                    </a>
                                )) : null}
                            </div>
                        </motion.div>
                        
                        {socialLinks.length ? (
                            <div className="flex items-center justify-start mt-10 space-x-6 md:hidden">
                                {socialLinks.map((link) => {
                                    const Icon = iconMap[link.icon];

                                    if (!Icon) {
                                        return null;
                                    }

                                    return (
                                        <a key={link.label} href={link.href} className="text-gray-400 hover:text-purple-accent dark:hover:text-purple-light transition-colors duration-300" aria-label={link.label} target={link.target || '_self'} rel={link.target === '_blank' ? 'noreferrer' : undefined}>
                                            <Icon size={22} />
                                        </a>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                    
                    {/* Right Column - Profile Image */}
                    <motion.div 
                        className="flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-accent to-purple-dark blur-[20px] opacity-20"></div>
                            <div className="relative w-full h-full rounded-full bg-gray-800 border-4 border-purple-accent overflow-hidden shadow-xl">
                                {hero.profileImage?.src ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={hero.profileImage.src} alt={hero.profileImage.alt || hero.name || 'Profile image'} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-700"></div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="section-container pt-0">
                <div className="grid gap-8 lg:grid-cols-2">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="card"
                    >
                        <p className="section-title">{sections.skills?.eyebrow}</p>
                        <h3>{sections.skills?.title}</h3>
                        {skills.length ? (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {skills.map((skill) => (
                                    <span key={skill.id} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="card"
                    >
                        <p className="section-title">{sections.projects?.eyebrow}</p>
                        <h3>{sections.projects?.title}</h3>
                        {projects.length ? (
                            <div className="space-y-4 mt-4">
                                {projects.map((project) => (
                                    <article key={project.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">{project.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                                            </div>
                                        </div>
                                        {Array.isArray(project.techStack) && project.techStack.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {project.techStack.map((tech) => (
                                                    <span key={tech} className="text-xs px-3 py-1 rounded-full bg-purple-accent/10 text-purple-accent dark:text-purple-light">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        ) : null}
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default Hero;