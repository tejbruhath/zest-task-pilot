
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, TrendingUp, List, Calendar, ChartBar, MessageSquare } from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Task Management',
    description: 'Smart deadline predictions and task prioritization based on your work patterns',
    icon: <TrendingUp className="h-12 w-12 text-primary" />
  },
  {
    title: 'Customizable Workflows',
    description: 'Organize tasks by life areas like Productivity, Fitness, and more',
    icon: <Calendar className="h-12 w-12 text-primary" />
  },
  {
    title: 'Comprehensive Task Views',
    description: 'List, calendar, and kanban views to manage your tasks however you prefer',
    icon: <List className="h-12 w-12 text-primary" />
  },
  {
    title: 'Insightful Statistics',
    description: 'Track your productivity with beautiful charts and performance metrics',
    icon: <ChartBar className="h-12 w-12 text-primary" />
  },
  {
    title: 'Team Collaboration',
    description: 'Invite team members, assign tasks, and track progress together',
    icon: <MessageSquare className="h-12 w-12 text-primary" />
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-primary text-2xl">Zest Tasks</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Accomplish more with 
            <span className="text-primary"> Zest Task Pilot</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            The AI-powered task planner that helps you prioritize, plan, and complete tasks across all areas of your life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000" 
                alt="Zest Task Pilot Dashboard" 
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-task-high"></div>
                <span>2 high priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-task-completed"></div>
                <span>5 completed today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features to Boost Your Productivity</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zest Task Pilot combines cutting-edge AI with intuitive design to give you the ultimate task management experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials or Benefits */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Zest Task Pilot?</h2>
          
          <div className="space-y-6">
            {[
              "Smart AI suggestions help you prioritize what matters most",
              "Separate workflows for different areas of your life",
              "Track your productivity with beautiful visualizations",
              "Collaborate with your team in real-time",
              "Available on web and mobile (coming soon)"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-1 bg-primary/10 rounded-full p-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register">
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 md:px-12 lg:px-24 bg-muted/30 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="font-bold text-xl">Zest Tasks</span>
            <p className="text-sm text-muted-foreground mt-2">© 2025 Zest Task Pilot. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
