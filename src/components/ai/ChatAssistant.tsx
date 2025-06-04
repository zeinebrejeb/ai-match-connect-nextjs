import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Send, MinusCircle, Users, Info} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatAssistantProps {
  onClose?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. I can help you with job matching, suggest improvements to your profile, and answer questions about the platform. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Sample responses based on keywords
    const processResponse = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      let assistantResponse = "";
      const lowercaseMessage = inputValue.toLowerCase();
      
      if (lowercaseMessage.includes("profile") && lowercaseMessage.includes("improve")) {
        assistantResponse = "Based on your profile, I suggest adding more specific skills like React.js instead of just JavaScript. Also, quantify your achievements in previous roles to stand out to recruiters. For instance, mention 'Increased conversions by 25%' rather than just 'Improved conversions'.";
      } else if (lowercaseMessage.includes("find") && (lowercaseMessage.includes("job") || lowercaseMessage.includes("jobs"))) {
        assistantResponse = "I noticed your profile indicates strength in full-stack development. Currently, there are 28 job openings matching your skills, with 5 high-match positions (90%+ compatibility). Would you like me to show you the top matches?";
      } else if (lowercaseMessage.includes("prepare") && lowercaseMessage.includes("interview")) {
        assistantResponse = "To prepare for your upcoming interview, I recommend researching the company's recent projects and technologies. Based on the job description, focus on demonstrating your experience with React, Node.js, and MongoDB. Would you like me to suggest some common technical questions for these technologies?";
      } else if (lowercaseMessage.includes("skills") && lowercaseMessage.includes("demand")) {
        assistantResponse = "Based on current market trends, the most in-demand skills for your profile type are:\n\n1. React.js and React Native\n2. TypeScript\n3. Node.js\n4. Cloud services (AWS/Azure)\n5. CI/CD pipelines\n\nAdding certifications in AWS or expanding your TypeScript experience would significantly increase your match rate with premium job listings.";
      } else {
        assistantResponse = "I understand you're asking about " + inputValue.split(" ").slice(0, 3).join(" ") + "... To provide the most helpful response, could you clarify what specific aspects you're interested in learning more about?";
      }

      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsProcessing(false);
    };

    processResponse();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md flex flex-col h-full max-h-[600px] shadow-xl">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-full">
              <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <CardTitle className="text-lg">AI Career Assistant</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <MinusCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 overflow-auto flex-grow">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-brand-100"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 mb-2">
          <Info className="h-3 w-3" />
          Try asking: `How can I improve my profile?` or `Find me relevant jobs`
        </div>
      </div>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-grow"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={inputValue.trim() === "" || isProcessing}
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

export default ChatAssistant;
