'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import experienceData from '../../data/experience.json';

const Experience: React.FC = () => {
  const { heading, subheading, items: experiences } = experienceData;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particlesByExperience = useMemo(
    () =>
      Array.from({ length: experiences.length }, () =>
        Array.from({ length: 8 }, () => ({
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          top: Math.random() * 100,
          left: Math.random() * 100,
          xOffset: (Math.random() - 0.5) * 40,
          yOffset: (Math.random() - 0.5) * 40,
          duration: Math.random() * 10 + 10,
        }))
      ),
    [experiences.length]
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    hover: {
      scale: 1.1,
      rotate: 10
    }
  };

  const techTagVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#EFF6FF",
      color: "#3B82F6",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10">
        <div className="w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10">
        <div className="w-96 h-96 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Animated Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {heading}
            </span>
          </h2>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {subheading}
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative" ref={ref}>
          {/* Animated Vertical Line */}
          <motion.div 
            className="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Experience Items */}
          <motion.div 
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {experiences.map((exp, index) => (
              <motion.div 
                key={index} 
                className="relative pl-12 md:pl-20 group"
                variants={itemVariants}
              >
                {/* Animated Timeline Icon */}
                <motion.div 
                  className={`absolute left-0 md:left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg z-10 ${exp.color.replace('from-', 'bg-gradient-to-br from-')}`}
                  variants={iconVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  whileHover="hover"
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  <span className="text-white">{exp.icon}</span>
                </motion.div>

                {/* Experience Card */}
                <motion.div 
                  className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 ${exp.color.replace('from-', 'border-')}`}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                      {exp.title}
                    </h3>
                    <motion.span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                      whileHover={{ scale: 1.05 }}
                    >
                      {exp.period}
                    </motion.span>
                  </div>

                  {/* Company */}
                  <motion.h4 
                    className={`text-lg font-semibold mb-4 bg-clip-text text-transparent ${exp.color}`}
                    whileHover={{ x: 5 }}
                  >
                    {exp.company}
                  </motion.h4>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <motion.span 
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        variants={techTagVariants}
                        whileHover="hover"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Particles Background */}
                <div className="absolute -z-10 -inset-4 overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  {mounted && particlesByExperience[index].map((particle, i) => (
                    <motion.div
                      key={i}
                      className={`absolute rounded-full ${i % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}
                      style={{
                        width: particle.width + 'px',
                        height: particle.height + 'px',
                        top: particle.top + '%',
                        left: particle.left + '%',
                      }}
                      animate={{
                        y: [0, particle.yOffset],
                        x: [0, particle.xOffset],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;