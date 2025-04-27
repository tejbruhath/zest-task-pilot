
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Send, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type SuggestedPrompt = {
  id: string;
  text: string;
};

const suggestedPrompts: SuggestedPrompt[] = [
  { id: '1', text: 'Organize my workflow' },
  { id: '2', text: 'Show me important events' },
  { id: '3', text: 'Summarize my tasks' },
  { id: '4', text: 'Create a plan for the week' },
  { id: '5', text: 'Find productive time slots' }
];

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hi there! I'm your AI assistant. How can I help you with your tasks and workflows today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call Perplexity API through a Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: input }
      });
      
      if (error) throw error;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="h-[calc(100vh-10rem)]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span>AI Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100vh-15rem)]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2 ${
                    message.sender === 'ai' ? 'items-start' : 'items-start flex-row-reverse'
                  }`}
                >
                  <Avatar className={message.sender === 'ai' ? 'bg-purple-100' : 'bg-blue-100'}>
                    <AvatarFallback>
                      {message.sender === 'ai' ? (
                        <Sparkles className="h-4 w-4 text-purple-500" />
                      ) : (
                        <User className="h-4 w-4 text-blue-500" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'ai'
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length < 3 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptClick(prompt.text)}
                  >
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
