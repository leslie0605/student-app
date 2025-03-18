
import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MentorChatButton = () => {
  useEffect(() => {
    // Add Voiceflow chat script to the document
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = `
      (function(d, t) {
          var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
          v.onload = function() {
            window.voiceflow.chat.load({
              verify: { projectID: '65b6596ba0bb9b38ed01d2dc' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production',
              voice: {
                url: "https://runtime-api.voiceflow.com"
              }
            });
          }
          v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Clean up function to remove script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  // The button now just triggers the Voiceflow chat
  return (
    <Button
      onClick={() => {
        // If Voiceflow chat is loaded, open it (it adds a global object)
        if (window.voiceflow && window.voiceflow.chat) {
          window.voiceflow.chat.open();
        }
      }}
      className="fixed bottom-4 right-4 shadow-lg rounded-full h-12 w-12 p-0 z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

// Add type declaration for window object to include Voiceflow chat
declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: any) => void;
        open: () => void;
      };
    };
  }
}

export default MentorChatButton;
