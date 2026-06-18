'use client';

import React from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaMobile,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiFlutter,
  SiIos,
  SiAndroid,
} from "react-icons/si";
import { IoCloudOutline } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import type { IconType } from "react-icons";
import skillsData from "../../data/skills.json";

const ICONS: Record<string, IconType> = {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaMobile,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaGitAlt,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiFlutter,
  SiIos,
  SiAndroid,
  IoCloudOutline,
  RiComputerLine,
};

const Skills = () => {
  const { heading, subheading, categories: skillCategories } = skillsData;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
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
              {heading}
            </span>
          </h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {subheading}
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {skillCategories.map((category, index) => {
            const CategoryIcon = ICONS[category.icon];
            return (
            <motion.div
              key={index}
              variants={item}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
              ></div>

              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <CategoryIcon className="text-white" size={category.iconSize} />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-800">
                  {category.title}
                </h3>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const SkillIcon = ICONS[skill.icon];
                  return (
                  <motion.div
                    key={skillIndex}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-default border border-gray-200"
                  >
                    <div className="text-lg"><SkillIcon className={skill.color} /></div>
                    <span>{skill.name}</span>
                  </motion.div>
                  );
                })}
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
