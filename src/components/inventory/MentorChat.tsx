
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/inventory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { addChatMessage, getMentorResponse } from '@/services/inventoryService';
import { useToast } from '@/components/ui/use-toast';

interface MentorChatProps {
  toolId: string;
  messages: ChatMessage[];
  onNewMessage?: (message: ChatMessage) => void;
}

const MentorChat: React.FC<MentorChatProps> = ({ toolId, messages, onNewMessage }) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    try {
      // Add user message
      const userMessage = await addChatMessage(toolId, message, 'user');
      if (onNewMessage) onNewMessage(userMessage);
      setMessage('');
      
      // Get mentor response
      const mentorResponseText = await getMentorResponse(toolId, message);
      const mentorMessage = await addChatMessage(toolId, mentorResponseText, 'mentor');
      if (onNewMessage) onNewMessage(mentorMessage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
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

  const renderChatContent = () => (
    <>
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
    </>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Ask a PhD Mentor
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>PhD Mentor</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Card className="border-0 shadow-none">
            {renderChatContent()}
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MentorChat;
