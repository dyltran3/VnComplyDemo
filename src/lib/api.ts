/**
 * VnComply Frontend API Utility
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("vncomply_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("vncomply_token", token);
    }
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("vncomply_token");
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }
    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      this.logout();
      // Optional: redirect to login if not on landing
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }

    return response.json();
  }

  // --- Auth ---
  async login(email: string, password: string) {
    const data = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(email: string, password: string) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // --- Scans ---
  async listScans() {
    return this.request("/api/scans");
  }

  async createScan(targetUrl: string, scanType: string = "full") {
    return this.request("/api/scans", {
      method: "POST",
      body: JSON.stringify({ target_url: targetUrl, scan_type: scanType }),
    });
  }

  async getScanStatus(scanId: string) {
    return this.request(`/api/scans/${scanId}/status`);
  }

  async getScanFindings(scanId: string) {
    return this.request(`/api/scans/${scanId}/findings`);
  }

  // --- Admin ---
  async getSystemMetrics() {
    return this.request("/api/admin/metrics");
  }

  async listLegalRules() {
    return this.request("/api/admin/rules");
  }

  async createLegalRule(rule: { law_ref: string, category: string, description: string, severity: string, remediation?: string }) {
    return this.request("/api/admin/rules", {
      method: "POST",
      body: JSON.stringify(rule),
    });
  }

  async deleteLegalRule(ruleId: string) {
    return this.request(`/api/admin/rules/${ruleId}`, {
      method: "DELETE",
    });
  }

  // --- Business ---
  async saveDPIA(data: any) {
    return this.request("/api/business/dpia", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async listDPIAs() {
    return this.request("/api/business/dpia");
  }

  async createSchedule(data: { target_url: string, frequency: string }) {
    return this.request("/api/business/schedules", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async listSchedules() {
    return this.request("/api/business/schedules");
  }

  // --- Logs ---
  async getAuditLogs() {
    return this.request("/api/admin/logs");
  }

  // Alias for clarity
  async listUserScans() {
    return this.listScans();
  }
}



export const api = new ApiClient();
