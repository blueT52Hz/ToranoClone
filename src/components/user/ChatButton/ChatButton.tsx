import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-shop-color-main text-white shadow-lg transition-all hover:bg-shop-color-hover"
          title="Chat với chúng tôi"
        >
          <MessageCircle size={24} />
        </button>
      </div>
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 z-50 h-[500px] w-[400px] overflow-hidden rounded-lg shadow-lg"
        >
          <iframe
            src="https://workflow.proptit.com/webhook/289f7a44-e1a7-4d46-b014-89e3e149f80c/chat"
            className="h-full w-full"
            title="Chat Support"
          />
        </div>
      )}
    </>
  );
};

export default ChatButton;
