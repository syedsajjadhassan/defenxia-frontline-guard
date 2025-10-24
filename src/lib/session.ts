// Session management for anonymous user isolation
export function getOrCreateSessionId(): string {
  const SESSION_KEY = 'security_app_session_id';
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a random session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

export function clearSession(): void {
  localStorage.removeItem('security_app_session_id');
}
