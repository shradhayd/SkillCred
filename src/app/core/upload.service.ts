import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { apiErrorMessage } from './booking.service';

interface Signature {
  cloudName: string;
  apiKey: string;
  signature: string;
  params: Record<string, string | number>;
}

export const MAX_PHOTO_MB = 3;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Profile photo upload.
 * 1. Ask our backend for a signed permission (the Cloudinary secret stays on the server).
 * 2. Upload the file straight to Cloudinary.
 * 3. Return the image link, resized to a 400x400 face-aware square.
 */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private api = inject(ApiService);

  /** Throws Error(friendly message). */
  async uploadAvatar(file: File): Promise<string> {
    if (!ALLOWED.includes(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.');
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) throw new Error(`The image must be smaller than ${MAX_PHOTO_MB} MB.`);

    let sig: Signature;
    try {
      sig = await firstValueFrom(this.api.post<Signature>('/uploads/avatar-signature'));
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Could not start the upload. Please try again.'));
    }

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('signature', sig.signature);
    for (const [key, value] of Object.entries(sig.params)) form.append(key, String(value));

    let res: Response;
    try {
      res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: form });
    } catch {
      throw new Error('Network error while uploading. Please check your internet connection.');
    }

    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.secure_url) {
      throw new Error(body?.error?.message || 'Upload failed. Please try again.');
    }

    // Cache-busting version is part of secure_url. Add a face-aware 400x400 crop and automatic format/quality.
    return (body.secure_url as string).replace('/upload/', '/upload/c_fill,g_face,w_400,h_400,f_auto,q_auto/');
  }
}