// Service API pour l'intégration Laravel backend
// Structure préparée pour la communication avec l'API Laravel

import { ApiResponse, AuthTokens, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseUrl: string;
  private tokens: AuthTokens | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.tokens = this.loadTokens();
  }

  private loadTokens(): AuthTokens | null {
    const tokens = localStorage.getItem('auth_tokens');
    return tokens ? JSON.parse(tokens) : null;
  }

  private saveTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem('auth_tokens');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearTokens();
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || 'Une erreur est survenue',
        errors: error.errors,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {};
    if (this.tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: any; tokens: AuthTokens }>> {
    // Fallback to local auth for demo
    const { login } = await import('../utils/auth');
    const result = login(credentials.email, credentials.password);
    
    if (result.success) {
      const mockTokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 3600000,
      };
      this.saveTokens(mockTokens);
      return {
        success: true,
        data: { user: result.user, tokens: mockTokens },
      };
    }

    return { success: false, message: result.message };
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: any; tokens: AuthTokens }>> {
    const { register } = await import('../utils/auth');
    const result = register(data);

    if (result.success) {
      const mockTokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 3600000,
      };
      this.saveTokens(mockTokens);
      return {
        success: true,
        data: { user: result.user, tokens: mockTokens },
      };
    }

    return { success: false, message: result.message };
  }

  async logout(): Promise<void> {
    this.clearTokens();
    const { logout } = await import('../utils/auth');
    logout();
  }

  // Medical Records
  async getMedicalRecords(patientId?: number): Promise<ApiResponse<any[]>> {
    if (patientId) {
      return this.get(`/medical-records?patient_id=${patientId}`);
    }
    return this.get('/medical-records');
  }

  async createMedicalRecord(data: any): Promise<ApiResponse<any>> {
    return this.post('/medical-records', data);
  }

  // Health Indicators
  async getHealthIndicators(patientId: number): Promise<ApiResponse<any[]>> {
    return this.get(`/health-indicators?patient_id=${patientId}`);
  }

  async createHealthIndicator(data: any): Promise<ApiResponse<any>> {
    return this.post('/health-indicators', data);
  }

  // Prescriptions
  async getPrescriptions(patientId?: number): Promise<ApiResponse<any[]>> {
    if (patientId) {
      return this.get(`/prescriptions?patient_id=${patientId}`);
    }
    return this.get('/prescriptions');
  }

  async getPrescriptionByQrCode(qrCode: string): Promise<ApiResponse<any>> {
    return this.get(`/prescriptions/qr/${qrCode}`);
  }

  async dispensePrescription(prescriptionId: number): Promise<ApiResponse<any>> {
    return this.post(`/prescriptions/${prescriptionId}/dispense`, {});
  }

  // Voice Messages
  async uploadVoiceMessage(formData: FormData): Promise<ApiResponse<any>> {
    return this.upload('/voice-messages', formData);
  }

  async transcribeVoiceMessage(messageId: number): Promise<ApiResponse<any>> {
    return this.post(`/voice-messages/${messageId}/transcribe`, {});
  }

  // Dashboard Stats
  async getAdminStats(): Promise<ApiResponse<any>> {
    return this.get('/admin/stats');
  }

  async getDoctorStats(doctorId: number): Promise<ApiResponse<any>> {
    return this.get(`/doctors/${doctorId}/stats`);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.tokens?.accessToken;
  }
}

export const api = new ApiService();
export default api;

