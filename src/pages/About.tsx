
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.6 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const featureVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto py-10 px-4 md:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 p-8 rounded-2xl shadow-lg mb-8"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-primary"
          variants={itemVariants}
        >
          About TaskMaster.ai
        </motion.h1>
        <motion.div 
          className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200"
          variants={itemVariants}
        >
          Made by: Tejbruhath, Barnam Das, and Sayan Patra
        </motion.div>
        <motion.div 
          className="font-semibold text-primary mb-6"
          variants={itemVariants}
        >
          A SEPM + Modern Web3 Project
        </motion.div>
      </motion.div>

      <motion.div 
        className="text-base space-y-6 text-gray-700 dark:text-gray-300"
        variants={itemVariants}
      >
        <motion.p 
          className="leading-relaxed bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <span className="font-semibold text-primary">TaskMaster.ai</span> is your intelligent, all-in-one
          productivity platform designed to help you organize, prioritize, and
          accomplish your goals with ease. Leveraging the power of AI and modern
          web technologies, TaskMaster.ai brings together personal and team task
          management, smart suggestions, and seamless collaboration in a
          beautiful, intuitive interface.
        </motion.p>
        
        <motion.div 
          className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 text-primary">Key Features</h2>
          <ul className="list-none space-y-4">
            {[
              { title: "AI-Powered Task Management", description: "Get smart deadline predictions, task prioritization, and actionable suggestions tailored to your workflow." },
              { title: "Customizable Workflows", description: "Organize tasks by projects, life areas, or teams for maximum flexibility." },
              { title: "Comprehensive Views", description: "Switch between list, calendar, and kanban views to manage your tasks your way." },
              { title: "Insightful Statistics", description: "Track your productivity with beautiful charts and performance metrics." },
              { title: "Team Collaboration", description: "Invite team members, assign tasks, and track progress together in real time." },
              { title: "Modern Web3 Integration", description: "Built with the latest web technologies for speed, security, and scalability." },
              { title: "Seamless Experience", description: "Enjoy a responsive, user-friendly design on both web and mobile (mobile coming soon!)." }
            ].map((feature, index) => (
              <motion.li 
                key={index}
                className="flex items-start gap-3 transform transition-all hover:translate-x-1 hover:text-primary"
                variants={featureVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-primary text-sm">✦</span>
                </div>
                <div>
                  <span className="font-semibold text-primary">{feature.title}:</span>{" "}
                  {feature.description}
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.p 
          className="leading-relaxed bg-gradient-to-r from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 p-6 rounded-lg shadow-sm"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          Whether you're a student, professional, or team leader, TaskMaster.ai
          empowers you to stay organized, boost productivity, and achieve
          more—every day.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default About;
