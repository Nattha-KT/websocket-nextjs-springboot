package com.websocket.websocket.controller;

import com.websocket.websocket.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;

import java.util.Date;

public class ChatController {
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        chatMessage.setTimestamp(new Date());
        return chatMessage;
    }
}
