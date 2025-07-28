import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  websiteId: string;
  currentContent: any;
}

export default function AIChat({ websiteId, currentContent }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I can help you modify your website. Try saying things like \"change the header color to blue\" or \"add a testimonials section\".",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const modifyMutation = useMutation({
    mutationFn: async (instruction: string) => {
      const response = await apiRequest("POST", "/api/ai/modify-website", {
        websiteId,
        instruction,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add AI response message
      const aiMessage: Message = {
        id: Date.now().toString() + "_ai",
        type: "ai",
        content: data.message || "I've made the changes to your website. You should see the updates reflected in the preview.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Invalidate website query to refresh the editor
      queryClient.invalidateQueries({ queryKey: ["/api/websites", websiteId] });
      
      toast({
        title: "Success",
        description: "Website updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString() + "_ai_error",
        type: "ai",
        content: "I'm sorry, I couldn't process that request. Could you try rephrasing your instruction?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to modify website",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    const message = inputValue.trim();
    if (!message) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Send to AI
    modifyMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Bot className="h-5 w-5 text-blue-500 mr-2" />
        AI Assistant
      </h3>
      
      <ScrollArea className="flex-1 h-64 mb-4" ref={scrollRef}>
        <div className="space-y-3 autosite-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.type === "user" ? "ml-8" : ""}`}>
              <div className={`rounded-lg p-3 text-sm ${
                message.type === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white border border-slate-200"
              }`}>
                <div className="flex items-center mb-1">
                  {message.type === "user" ? (
                    <User className="h-3 w-3 mr-1" />
                  ) : (
                    <Bot className="h-3 w-3 mr-1 text-blue-500" />
                  )}
                  <span className="font-medium text-xs">
                    {message.type === "user" ? "You" : "AI Assistant"}
                  </span>
                </div>
                <div className={message.type === "user" ? "text-white" : "text-slate-600"}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {modifyMutation.isPending && (
            <div className="ai-message">
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm">
                <div className="flex items-center mb-1">
                  <Bot className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="font-medium text-xs">AI Assistant</span>
                </div>
                <div className="text-slate-600 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500 mr-2"></div>
                  Processing your request...
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me what to change..."
          className="flex-1 text-sm"
          disabled={modifyMutation.isPending}
        />
        <Button 
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || modifyMutation.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
