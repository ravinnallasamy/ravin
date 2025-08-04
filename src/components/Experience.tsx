import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Tech Innovations Inc.",
      period: "2023 - Present",
      description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting robust solutions.",
      technologies: ["React", "Node.js", "TypeScript", "AWS"],
      icon: "💼",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "IoT Protocols Intern",
      company: "Innovate Engineering Products",
      period: "2024",
      description: "Gained hands-on experience with real-time IoT protocols, developed monitoring systems, and worked on edge computing solutions.",
      technologies: ["IoT", "Python", "Edge Computing", "Protocols"],
      icon: "🔧",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "IoT Intern",
      company: "Krish-Tec, Coimbatore",
      period: "2023",
      description: "Explored IoT fundamentals and real-world applications. Built prototype systems and learned about sensor integration and data analytics.",
      technologies: ["IoT", "Sensors", "Arduino", "Data Analytics"],
      icon: "⚡",
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Bachelor of Information Technology",
      company: "Dr. N.G.P Institute of Technology",
      period: "2022 - Present",
      description: "Pursuing degree with focus on emerging technologies and engineering principles. CGPA: 8.3 with consistent academic excellence.",
      technologies: ["Computer Science", "Software Engineering", "Data Structures"],
      icon: "🎓",
      color: "from-red-500 to-pink-600"
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

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
              Experience & Education
            </span>
          </h2>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            My journey through technology, learning, and professional growth.
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
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute rounded-full ${i % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}
                      style={{
                        width: Math.random() * 10 + 5 + 'px',
                        height: Math.random() * 10 + 5 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                      }}
                      animate={{
                        y: [0, (Math.random() - 0.5) * 40],
                        x: [0, (Math.random() - 0.5) * 40],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: Math.random() * 10 + 10,
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