
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import MentorChat from './MentorChat';

const MentorChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg rounded-full h-12 w-12 p-0 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>PhD Mentor</SheetTitle>
            <SheetClose className="rounded-full p-2 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetHeader>
          <MentorChat />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MentorChatButton;
