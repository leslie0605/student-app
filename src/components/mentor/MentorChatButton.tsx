import React, { useEffect, useRef } from "react";

const MentorChatButton = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
              }).then(() => {
                window.voiceflow.chat.show(); 
              });
            }
            v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
            v.type = "text/javascript"; 
            s.parentNode.insertBefore(v, s);
        })(document, 'script');
      `;

      document.head.appendChild(script);
    } else {
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.show();
      }
    }

    return () => {
      // hide chat button when component unmounts
      if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.hide();
      }
    };
  }, []);

  return <div ref={chatContainerRef} id="chat-container"></div>;
};

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: any) => Promise<void>;
        open: () => void;
        hide: () => void;
        show: () => void;
      };
    };
  }
}

export default MentorChatButton;
