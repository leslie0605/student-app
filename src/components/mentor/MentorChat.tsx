
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from '@/types/inventory';

// Define a unique key for mentor chat messages in localStorage
const MENTOR_CHAT_STORAGE_KEY = 'mentor_chat_messages';

// OpenAI API client setup
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

const MentorChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem(MENTOR_CHAT_STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add initial welcome message if no saved messages
      const welcomeMessage: ChatMessage = {
        id: '0',
        sender: 'mentor',
        message: "Hello! I'm Dr. Morgan, your PhD mentor. How can I help with your graduate school applications today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(MENTOR_CHAT_STORAGE_KEY, JSON.stringify([welcomeMessage]));
    }

    // Generate a thread ID if none exists
    const savedThreadId = localStorage.getItem('mentor_thread_id');
    if (savedThreadId) {
      setThreadId(savedThreadId);
    } else {
      // In a real implementation, we would call the backend to create a thread
      const newThreadId = Math.random().toString(36).substring(2);
      setThreadId(newThreadId);
      localStorage.setItem('mentor_thread_id', newThreadId);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(MENTOR_CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Create and add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call your backend endpoint
      // For now, we'll simulate with a timeout and predefined responses
      const mentorMessage = await getMentorResponse(userMessage.message);
      
      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Error getting mentor response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to simulate getting mentor response
  // In a real app, this would call your backend API
  const getMentorResponse = async (userMessage: string): Promise<ChatMessage> => {
    // This is where you would integrate with your OpenAI backend
    // For now, we'll return a simple response after a delay
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Predefined PhD mentor responses based on keywords
    const responses = [
      "That's a great question about graduate school applications. The key is to start early and organize your materials well.",
      "When writing your statement of purpose, focus on your research interests and how they align with the program's strengths.",
      "For recommendation letters, give your recommenders at least 4-6 weeks notice and provide them with your CV and target programs.",
      "Most competitive PhD programs look for research experience. Highlight any publications, presentations, or research projects.",
      "It's a good idea to reach out to potential advisors before applying to discuss your research interests and fit.",
      "Your CV should highlight your academic achievements, research experience, and any teaching or leadership roles."
    ];
    
    // Choose a somewhat relevant response based on the user message
    let responseText = responses[Math.floor(Math.random() * responses.length)];
    
    if (userMessage.toLowerCase().includes('recommendation') || userMessage.toLowerCase().includes('letter')) {
      responseText = responses[2];
    } else if (userMessage.toLowerCase().includes('statement') || userMessage.toLowerCase().includes('sop')) {
      responseText = responses[1];
    } else if (userMessage.toLowerCase().includes('cv') || userMessage.toLowerCase().includes('resume')) {
      responseText = responses[5];
    }
    
    return {
      id: (Date.now() + 1).toString(),
      sender: 'mentor',
      message: responseText,
      timestamp: new Date().toISOString()
    };
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <Card className="border-0 shadow-none mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <span>PhD Mentor Chat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No messages yet. Ask your PhD mentor a question!</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                    <Avatar className={`h-8 w-8 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                      <AvatarFallback>
                        {msg.sender === 'user' ? 'ME' : 'PhD'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`rounded-lg px-4 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground mt-1 ${
                        msg.sender === 'user' ? 'text-right block' : ''
                      }`}>
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Textarea
            placeholder="Ask your PhD mentor a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isProcessing || !message.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MentorChat;
