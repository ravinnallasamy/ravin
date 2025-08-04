import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Gallery: React.FC = () => {
  const galleryProjects = [
    {
      src: "/images/IND.jpg",
      title: "Heart Patient Monitor App",
      description: "A Flutter-based mobile application to monitor and manage heart patients remotely.",
      githubUrl: "https://github.com/ravinnallasamy/Heart_patient_management_app"
    },
    {
      src: "/images/tumo.jpg", 
      title: "Brain Recovery Tracker",
      description: "Two Flutter & Dart apps designed to monitor post-treatment recovery of brain surgery patients.",
      githubUrl: "https://github.com/ravinnallasamy/brain_patient_management_app"
    },
    {
      src: "/images/Uzhavan.png",
      title: "Uzhavan – Agri Rental Platform",
      description: "A MERN-based web platform enabling farmers to rent agricultural equipment easily.",
      githubUrl: "https://github.com/ravinnallasamy/uzhavanrentals"
    }
  ];


  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Project <span className="font-semibold text-blue-600">Showcase</span>
          </h2>
          <p className="text-xl text-gray-600">
            Explore my featured projects with direct GitHub access.
          </p>
        </motion.div>

        {/* Interactive Gallery */}
        <div className="relative">
          <div className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide px-4">
            {galleryProjects.map((project, index) => (
              <motion.div 
                key={index}
                className="flex-none w-80"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group"
                >
                  {/* Image Container with enhanced effects */}
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 h-64">
                    {/* Regular img tag instead of Next.js Image */}
                    <img
                      src={project.src}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredIndex === index ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    {/* Animated Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <motion.h3 
                          className="text-xl font-semibold mb-2"
                          initial={{ y: 10 }}
                          animate={{ 
                            y: hoveredIndex === index ? 0 : 10 
                          }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-200 text-sm"
                          initial={{ y: 15 }}
                          animate={{ 
                            y: hoveredIndex === index ? 0 : 15 
                          }}
                        >
                          {project.description}
                        </motion.p>
                      </div>
                    </motion.div>

                    {/* GitHub Corner Ribbon */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 bg-blue-600 transform rotate-45 translate-y-4 translate-x-8 flex justify-center">
                        <svg 
                          className="w-5 h-5 text-white mt-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card Info with GitHub CTA */}
                  <div className="mt-4 px-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <span>View on GitHub</span>
                      <svg 
                        className="w-4 h-4 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Scroll Hint */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-full">
              <span>Drag or scroll to explore</span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed style tag */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Gallery;