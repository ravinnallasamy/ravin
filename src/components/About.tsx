import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const autoScrollRef = useRef<ReturnType<typeof setInterval>>();

  const images = [
    '/images/img1.jpg',
    '/images/img2.jpg',
    '/images/img3.jpg',
    '/images/img1.jpg',
    '/images/img2.jpg'
  ];

  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [isAutoScrolling, images.length]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };


const handleDownloadResume = async () => {
  setIsDownloading(true);

  try {
    const response = await fetch('/resume-ravinnallasamy.pdf');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'RavinNallasamy-Resume.pdf'); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Resume downloaded successfully!', {
      position: "bottom-right",
      autoClose: 3000,
    });
  } catch (err) {
    toast.error('Failed to download resume.');
  } finally {
    setIsDownloading(false);
  }
};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-32 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl px-8 mx-auto">
        <motion.div 
          className="flex flex-col lg:flex-row gap-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Image Container */}
          <motion.div 
            className="w-full lg:w-1/2 flex-shrink-0"
            variants={itemVariants}
          >
            <div 
              className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => setIsAutoScrolling(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.img
                  src={images[currentImageIndex]}
                  alt="Project showcase"
                  className="h-full w-full object-cover rounded-lg"
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-4'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Container */}
          <motion.div 
            className="w-full lg:w-1/2 flex-shrink-0"
            variants={itemVariants}
          >
            <div className="h-full flex flex-col justify-between p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div>
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    About My Work
                  </span>
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 mb-6 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  I architect digital experiences that blend cutting-edge technology with intuitive design. With a foundation in computer science and a passion for innovation, I transform complex problems into elegant solutions.
                </motion.p>
                <motion.p 
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Clean code architecture and modern technologies for scalable solutions.
                </motion.p>
              </div>

              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {[
                  { value: "1+", label: "Years of experience" },
                  { value: "3+", label: "Projects" },
                  { value: "8.3", label: "CGPA" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ y: -5, scale: 1.03 }}
                  >
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      {stat.value}
                    </div>
                    <div className="text-md text-gray-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button 
  className="w-full mt-8 px-8 py-4 text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8 }}
  whileHover={{ 
    scale: 1.02,
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
  }}
  whileTap={{ scale: 0.98 }}
  onClick={handleDownloadResume}
  disabled={isDownloading}
>
  {isDownloading ? (
    'Downloading...'
  ) : (
    <>
      <FiDownload className="text-lg" />
      Download Resume
    </>
  )}
</motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;