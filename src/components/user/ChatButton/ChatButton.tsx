import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
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
      <div
        ref={chatRef}
        className={`fixed bottom-24 right-0 z-50 h-[500px] w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 md:right-6 md:w-[400px] ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute right-0 top-0 z-10">
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-gray-300"
            title="Đóng chat"
          >
            <X size={16} />
          </button>
        </div>
        <iframe
          src="https://workflow.proptit.com/webhook/289f7a44-e1a7-4d46-b014-89e3e149f80c/chat"
          className="h-full w-full"
          title="Chat Support"
        />
      </div>
    </div>
  );
};

export default ChatButton;
