import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaMobile, 
  FaChartLine, 
  FaTools,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaJava,
  FaPython,
  FaGitAlt,
  FaFigma
} from 'react-icons/fa';
import { 
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiFlutter,
  SiIos,
  SiAndroid,
  SiStreamlit
} from 'react-icons/si';
import { IoCloudOutline } from 'react-icons/io5';
import { RiComputerLine } from 'react-icons/ri';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React", icon: <FaReact className="text-blue-500" /> },
        { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
        { name: "CSS3", icon: <FaCss3Alt className="text-blue-400" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
        { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> }
      ],
      icon: <RiComputerLine className="text-white" size={24} />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Backend Development", 
      skills: [
        { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
        { name: "Java", icon: <FaJava className="text-red-500" /> },
        { name: "Express.js", icon: <SiExpress className="text-gray-800" /> },
        { name: "REST APIs", icon: <FaDatabase className="text-purple-500" /> }
      ],
      icon: <FaNodeJs className="text-white" size={24} />,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Database & Cloud",
      skills: [
        { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-700" /> },
        { name: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
        { name: "Git", icon: <FaGitAlt className="text-orange-600" /> }
      ],
      icon: <IoCloudOutline className="text-white" size={24} />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Mobile Development",
      skills: [
        { name: "Flutter", icon: <SiFlutter className="text-blue-400" /> },
        { name: "Dart", icon: <SiFlutter className="text-blue-600" /> },
        { name: "iOS", icon: <SiIos className="text-gray-700" /> },
        { name: "Android", icon: <SiAndroid className="text-green-500" /> }
      ],
      icon: <FaMobile className="text-white" size={20} />,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Data & Analytics",
      skills: [
        { name: "Machine Learning", icon: <FaChartLine className="text-indigo-500" /> },
        { name: "Python", icon: <FaPython className="text-blue-600" /> },
        { name: "Data Analysis", icon: <FaChartLine className="text-green-500" /> },
        { name: "SVM", icon: <FaChartLine className="text-purple-500" /> },
        { name: "Streamlit", icon: <SiStreamlit className="text-red-500" /> },
        { name: "IoT", icon: <RiComputerLine className="text-blue-400" /> }
      ],
      icon: <FaChartLine className="text-white" size={20} />,
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "VS Code", icon: <FaTools className="text-blue-500" /> },
        { name: "Figma", icon: <FaFigma className="text-purple-500" /> },
        { name: "SEO", icon: <FaTools className="text-yellow-500" /> },
        { name: "Digital Marketing", icon: <FaTools className="text-pink-500" /> },
        { name: "Leadership", icon: <FaTools className="text-green-500" /> }
      ],
      icon: <FaTools className="text-white" size={20} />,
      gradient: "from-gray-600 to-gray-800"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Technical Skills
            </span>
          </h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Expertise across the full technology stack with a focus on modern, scalable solutions.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>
              
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-800">
                  {category.title}
                </h3>
              </div>
              
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-default border border-gray-200"
                  >
                    <div className="text-lg">
                      {skill.icon}
                    </div>
                    <span>{skill.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Animated Bottom Border */}
              <motion.div 
                className={`mt-6 h-1 bg-gradient-to-r ${category.gradient} rounded-full`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;