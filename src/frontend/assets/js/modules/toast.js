// Elegant and professional Toast notification system
export class Toast {
  static init() {
    if (document.getElementById('toast-container')) return;
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '24px';
    container.style.right = '24px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Inject Toast Styles if not already present
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.innerHTML = `
        .toast-item {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          max-width: 450px;
          padding: 16px;
          background: #ffffff;
          border-left: 5px solid #0f7d3a;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          color: #1e293b;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          transform: translateX(120%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
          pointer-events: auto;
          opacity: 0;
        }
        .toast-item.show {
          transform: translateX(0);
          opacity: 1;
        }
        .toast-item.success { border-left-color: #0f7d3a; }
        .toast-item.error { border-left-color: #dc2626; }
        .toast-item.warning { border-left-color: #d97706; }
        .toast-item.info { border-left-color: #2563eb; }
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-weight: bold;
          flex-shrink: 0;
        }
        .toast-item.success .toast-icon { background: #dcfce7; color: #15803d; }
        .toast-item.error .toast-icon { background: #fee2e2; color: #b91c1c; }
        .toast-item.warning .toast-icon { background: #fef3c7; color: #b45309; }
        .toast-item.info .toast-icon { background: #dbeafe; color: #1d4ed8; }
        .toast-content { flex-grow: 1; }
        .toast-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 16px;
          padding: 0 4px;
          margin: 0;
          line-height: 1;
        }
        .toast-close:hover { color: #64748b; }
      `;
      document.head.appendChild(style);
    }
  }

  static show(message, type = 'success', duration = 4000) {
    this.init();
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    
    let icon = '✓';
    if (type === 'error') icon = '✗';
    if (type === 'warning') icon = '⚠';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static success(msg, dur) { this.show(msg, 'success', dur); }
  static error(msg, dur) { this.show(msg, 'error', dur); }
  static warning(msg, dur) { this.show(msg, 'warning', dur); }
  static info(msg, dur) { this.show(msg, 'info', dur); }
}
