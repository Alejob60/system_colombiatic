import { useState, useEffect, useRef } from 'react';
import { Fab, Box, Typography, IconButton, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import ServiceSelector from './ServiceSelector';

// Define the structure of a message
interface Message {
  author: 'user' | 'bot';
  type: 'text' | 'tool_request';
  content: any; // Can be a string or a tool component
  toolCallId?: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start chat session on component mount, ensuring it only runs once.
  const sessionStarted = useRef(false);
  useEffect(() => {
    if (sessionStarted.current || sessionId) return;
    sessionStarted.current = true;

    const startSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:7071/api/chat-start', { method: 'POST' });
        const data = await response.json();
        setSessionId(data.sessionId);
        // Send an initial message to the bot to get the conversation started
        sendMessage("Hola, acabo de llegar a la página.", data.sessionId);
      } catch (error) {
        console.error('Failed to start chat session:', error);
        setMessages([{ author: 'bot', type: 'text', content: 'Error al conectar con el asistente.' }]);
      } finally {
        setIsLoading(false);
      }
    };
    startSession();
  }, [sessionId]);

  const handleApiResponse = (data: any) => {
    if (data.type === 'tool_call') {
      const toolCall = data.toolCall;
      if (toolCall.function.name === 'show_service_list') {
        setMessages(prev => [...prev, { author: 'bot', type: 'tool_request', content: 'ServiceSelector', toolCallId: toolCall.id }]);
      } else if (toolCall.function.name === 'navigate_to_section') {
        const section = JSON.parse(toolCall.function.arguments).section;
        // Dispatch a custom event that the App component can listen to
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: section }));
        // We can optionally send a confirmation message back to the bot
        const toolResponse = { toolCallId: toolCall.id, response: `Navegué a la sección ${section}.` };
        sendMessage(`Confirmación: llevé al usuario a la sección ${section}.`, sessionId!, toolResponse);
      }
    } else {
      setMessages(prev => [...prev, { author: 'bot', type: 'text', content: data.content }]);
    }
  };

  const sendMessage = async (messageText: string, currentSessionId: string, toolResponse: any = null) => {
    if (!messageText.trim() || !currentSessionId) return;

    const requestBody: any = {
      message: messageText,
      sessionId: currentSessionId,
    };

    if (toolResponse) {
      requestBody.toolResponse = toolResponse;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:7071/api/chat-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      handleApiResponse(data);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { author: 'bot', type: 'text', content: 'No se pudo enviar tu mensaje.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(prev => [...prev, { author: 'user', type: 'text', content: userInput }]);
    sendMessage(userInput, sessionId!);
    setUserInput('');
  };

  const handleServiceSelection = (selectedServices: string[]) => {
    const message = `El cliente está interesado en: ${selectedServices.join(', ')}.`;
    // Find the toolCallId from the last message
    const lastMessage = messages[messages.length - 1];
    const toolCallId = lastMessage.toolCallId;

    // Visually disable the selector
    setMessages(prev => prev.filter(msg => msg.type !== 'tool_request'));
    setMessages(prev => [...prev, { author: 'user', type: 'text', content: `Seleccioné: ${selectedServices.join(', ')}` }]);
    
    // Send the selection to the bot as a tool response
    sendMessage(message, sessionId!, { toolCallId, response: message });
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 112,
            right: 32,
            width: { xs: 'calc(100% - 64px)', sm: 370 },
            height: { xs: 'calc(100% - 128px)', sm: 500 },
            maxHeight: '600px',
            zIndex: 1299,
            boxShadow: 8,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Asistente Virtual Misy</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1, display: 'flex', justifyContent: msg.author === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.type === 'text' && (
                  <Typography variant="body2" component="span" sx={{ bgcolor: msg.author === 'user' ? 'primary.main' : 'grey.200', color: msg.author === 'user' ? 'white' : 'black', p: 1.5, borderRadius: 2, maxWidth: '80%' }}>
                    {msg.content}
                  </Typography>
                )}
                {msg.type === 'tool_request' && msg.content === 'ServiceSelector' && (
                  <ServiceSelector onSubmit={handleServiceSelection} />
                )}
              </Box>
            ))}
            {isLoading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 1 }} />}
            <div ref={messagesEndRef} />
          </Box>

          <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 1, borderTop: '1px solid', borderColor: 'grey.300' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe tu mensaje..."
              size="small"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!sessionId || isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" color="primary" aria-label="send message" disabled={!userInput.trim() || isLoading}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatWidget;