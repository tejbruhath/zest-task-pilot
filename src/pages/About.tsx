import React from "react";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4">About TaskMaster.ai</h1>
      <div className="text-lg font-bold mb-2">
        Made by: Tejbruhath, Barnam Das, and Sayan Patra
      </div>
      <div className="font-semibold text-primary mb-6">
        A SEPM + Modern Web3 Project
      </div>
      <div className="text-base space-y-4">
        <p>
          <strong>TaskMaster.ai</strong> is your intelligent, all-in-one
          productivity platform designed to help you organize, prioritize, and
          accomplish your goals with ease. Leveraging the power of AI and modern
          web technologies, TaskMaster.ai brings together personal and team task
          management, smart suggestions, and seamless collaboration in a
          beautiful, intuitive interface.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>AI-Powered Task Management:</strong> Get smart deadline
            predictions, task prioritization, and actionable suggestions
            tailored to your workflow.
          </li>
          <li>
            <strong>Customizable Workflows:</strong> Organize tasks by projects,
            life areas, or teams for maximum flexibility.
          </li>
          <li>
            <strong>Comprehensive Views:</strong> Switch between list, calendar,
            and kanban views to manage your tasks your way.
          </li>
          <li>
            <strong>Insightful Statistics:</strong> Track your productivity with
            beautiful charts and performance metrics.
          </li>
          <li>
            <strong>Team Collaboration:</strong> Invite team members, assign
            tasks, and track progress together in real time.
          </li>
          <li>
            <strong>Modern Web3 Integration:</strong> Built with the latest web
            technologies for speed, security, and scalability.
          </li>
          <li>
            <strong>Seamless Experience:</strong> Enjoy a responsive,
            user-friendly design on both web and mobile (mobile coming soon!).
          </li>
        </ul>
        <p>
          Whether you're a student, professional, or team leader, TaskMaster.ai
          empowers you to stay organized, boost productivity, and achieve
          more—every day.
        </p>
      </div>
    </div>
  );
};

export default About;
