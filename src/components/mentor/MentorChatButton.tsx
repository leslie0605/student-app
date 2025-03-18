
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const MentorChatButton = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only add the script if it doesn't already exist
    if (!document.getElementById("voiceflow-script")) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "voiceflow-script";
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
    }

    // Clean up function to remove script when component unmounts
    return () => {
      const existingScript = document.getElementById("voiceflow-script");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div ref={chatContainerRef} id="chat-container">
      {/* Voiceflow will automatically inject its chat UI here */}
    </div>
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
