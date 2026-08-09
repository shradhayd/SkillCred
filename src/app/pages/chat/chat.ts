import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Navbar } from '../../shared/layout/navbar';
import { Footer } from '../../shared/layout/footer';
import { AuthService } from '../../core/auth.service';
import { CONVERSATIONS, CHAT_MESSAGES } from '../../shared/mock-data';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, Navbar, Footer],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  protected auth = inject(AuthService);
  protected conversations = CONVERSATIONS;
  protected activeId = 'c1';
  protected newMessage = '';
  protected showCodeEditor = false;
  protected codeLanguage = 'javascript';
  protected codeContent = '// Write your code here\nconsole.log("Hello SkillCred!");';

  protected get messages() {
    return CHAT_MESSAGES[this.activeId] || [];
  }

  protected get activeConversation() {
    return this.conversations.find(c => c.id === this.activeId);
  }

  selectConversation(id: string): void {
    this.activeId = id;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    const msgs = CHAT_MESSAGES[this.activeId];
    if (msgs) {
      msgs.push({
        id: 'm' + Date.now(),
        text: this.newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      });
    }
    this.newMessage = '';
  }

  toggleCodeEditor(): void {
    this.showCodeEditor = !this.showCodeEditor;
  }

  runCode(): void {
    // Mock output - no real execution
  }
}
