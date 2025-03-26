import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule,CommonModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  messages: { text: string; type: 'user' | 'bot'; isTyping?: boolean }[] = [];
  userInput: string = '';
  loading: boolean = false;
  showWelcome: boolean = true;
  apiUrl: string = 'https://api.example.com/chatbot';


  constructor(private http: HttpClient) {
    // setTimeout(() => this.showWelcome = false, 15000);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user's message to the chat
    this.messages.push({ text: this.userInput, type: 'user' });
    let userQuestion = this.userInput;
    this.userInput = '';

    // Show loader while waiting for API response
    this.loading = true;

    // Call the backend API
    this.http.post<{ response: string }>(this.apiUrl, { question: userQuestion }).subscribe({
      next: (res) => {
        this.loading = false;
        this.displayTypingEffect(res.response);
      },
      error: () => {
        this.loading = false;
        this.displayTypingEffect("Sorry, something went wrong. Please try again.");
      }
    });
  }

  displayTypingEffect(responseText: string) {
    let botMessage: { text: string; type: 'bot'; isTyping: boolean } = { text: '', type: 'bot', isTyping: true };
    this.messages.push(botMessage);

    let index = 0;
    let interval = setInterval(() => {
      if (index < responseText.length) {
        botMessage.text += responseText[index];
        index++;
      } else {
        botMessage.isTyping = false;
        clearInterval(interval);
      }
    }, 50);
  }
}
