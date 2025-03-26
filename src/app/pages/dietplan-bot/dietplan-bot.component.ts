import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dietplan-bot',
  imports: [FormsModule,CommonModule],
  templateUrl: './dietplan-bot.component.html',
  styleUrl: './dietplan-bot.component.css'
})
export class DietplanBotComponent {
  messages: { text: string; type: 'user' | 'bot' | 'separator'; isTyping?: boolean }[] = [];
  userInput: string = '';
  loading: boolean = false;
  showWelcome: boolean = true;
  showGuidelines: boolean = true;
  apiUrl: string = 'https://api.example.com/chatbot';

  constructor(private http: HttpClient) {
    setTimeout(() => this.showWelcome = false, 8000);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    if (this.showGuidelines) {
      this.showGuidelines = false; // Remove guidelines after first query
    } else {
      this.messages.push({ text: '-----', type: 'separator' }); // Add separator after first query
    }

    this.messages.push({ text: this.userInput, type: 'user' });
    let userQuestion = this.userInput;
    this.userInput = '';

    this.loading = true;

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
