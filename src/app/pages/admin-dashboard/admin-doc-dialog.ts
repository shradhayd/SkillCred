import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AdminRow, AdminService } from '../../core/admin.service';
import { apiErrorMessage } from '../../core/booking.service';

export interface AdminDocDialogData {
  collection: string;
  label: string;
  id?: string; // missing = creating a new document
  doc: AdminRow;
}

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** Edit (or create) any document as JSON. Saved through the admin API, which logs every change. */
@Component({
  selector: 'app-admin-doc-dialog',
  imports: [FormsModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.id ? 'Edit' : 'New' }} {{ data.label }}</h2>
    <mat-dialog-content>
      @if (data.id) {
        <p class="meta">ID: <code>{{ data.id }}</code></p>
      }
      <textarea class="json-box" spellcheck="false" [(ngModel)]="text"></textarea>
      <p class="hint">Edit the JSON and save. Date/time fields are read-only and are not shown. Every change is written to the audit log.</p>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="btn-primary" [disabled]="saving" (click)="save()">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .json-box { width: 100%; min-width: 460px; height: 320px; font-family: monospace; font-size: 0.85rem;
      padding: 0.75rem; border: 1px solid var(--border, #e2e8f0); border-radius: 8px;
      background: var(--surface, #f7fafc); color: inherit; resize: vertical; box-sizing: border-box; }
    .meta { margin: 0 0 0.5rem; font-size: 0.85rem; }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin: 0.5rem 0 0; }
    .error { color: #e53e3e; font-size: 0.85rem; margin: 0.5rem 0 0; }
    @media (max-width: 600px) { .json-box { min-width: 0; } }
  `],
})
export class AdminDocDialog {
  data = inject<AdminDocDialogData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<AdminDocDialog>);
  private admin = inject(AdminService);

  protected text: string;
  protected error = '';
  protected saving = false;

  constructor() {
    const editable: AdminRow = {};
    for (const [key, value] of Object.entries(this.data.doc)) {
      if (key === 'id') continue;
      if (typeof value === 'string' && ISO.test(value)) continue; // timestamps are read-only
      editable[key] = value;
    }
    this.text = JSON.stringify(editable, null, 2);
  }

  async save(): Promise<void> {
    this.error = '';
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.text);
    } catch (e) {
      this.error = `Invalid JSON: ${(e as Error).message}`;
      return;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !Object.keys(parsed).length) {
      this.error = 'Enter a JSON object, like { "name": "value" }';
      return;
    }

    this.saving = true;
    try {
      const saved = await firstValueFrom(
        this.data.id
          ? this.admin.update(this.data.collection, this.data.id, parsed as AdminRow)
          : this.admin.create(this.data.collection, parsed as AdminRow)
      );
      this.ref.close(saved);
    } catch (err) {
      this.error = apiErrorMessage(err);
      this.saving = false;
    }
  }
}