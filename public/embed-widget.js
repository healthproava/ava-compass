(function() {
  // HealthProAssist Widget Embed Script
  // Usage: <script src="https://yoursite.com/embed-widget.js" data-widget="ava"></script>
  
  function loadWidget() {
    const script = document.querySelector('script[data-widget="ava"]');
    if (!script) return;
    
    // Create widget container
    const container = document.createElement('div');
    container.id = 'healthproassist-widget';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    // Add widget iframe
    const iframe = document.createElement('iframe');
    iframe.src = window.location.origin + '/widget';
    iframe.style.cssText = `
      width: 400px;
      height: 600px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      background: white;
    `;
    
    container.appendChild(iframe);
    document.body.appendChild(container);
    
    // Handle postMessage communication
    window.addEventListener('message', function(event) {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'WIDGET_RESIZE') {
        iframe.style.width = event.data.width + 'px';
        iframe.style.height = event.data.height + 'px';
      }
    });
  }
  
  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();