/**
 * Scientific Nautilus Animation
 * 
 * A mathematically accurate rendering of nautilus and ammonite shells
 * based on the logarithmic spiral growth patterns found in nature,
 * with scientifically accurate septa (chamber walls).
 */

class NautilusAnimation {
  constructor(canvasId, options = {}) {
    // Element references
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with ID '${canvasId}' not found.`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Performance optimization for supported browsers
    });
    
    this.options = {
      shellCount: options.shellCount || 29990,
      minSize: options.minSize || 2.5,
      maxSize: options.maxSize || 10,
      primaryColor: options.primaryColor || '#1f4e6b',
      secondaryColor: options.secondaryColor || '#88b2cc',
      accentColor: options.accentColor || '#FF00FF',
      goldenRatio: 1.6180339887, // Phi 
      growth: options.growth || 0.18, // Growth factor for logarithmic spiral
      opacity: options.opacity || 0.5,
      backgroundColor: options.backgroundColor || 'transparent',
      responsive: options.responsive !== undefined ? options.responsive : true,
      pauseOnBlur: options.pauseOnBlur !== undefined ? options.pauseOnBlur : true,
      throttleFPS: options.throttleFPS || 30, // Target max FPS to save resources
      disableOnMobile: options.disableOnMobile !== undefined ? options.disableOnMobile : true,
      nautilusTurns: options.nautilusTurns || 2.5, // Number of turns in nautilus spiral
      ammoniteTurns: options.ammoniteTurns || 3.5, // Number of turns in ammonite spiral
      nautilusSeptaCount: options.nautilusSeptaCount || 12, // Number of septa in nautilus
      ammoniteSeptaCount: options.ammoniteSeptaCount || 24, // Number of septa in ammonite
      ammoniteRibbing: options.ammoniteRibbing !== undefined ? options.ammoniteRibbing : true, // External ribbing on ammonite
      nautilusSpeed: options.nautilusSpeed || 10.50, // Animation speed
      pointsPerTurn: options.pointsPerTurn || 40, // Resolution of spiral drawing
      rotateShells: options.rotateShells !== undefined ? options.rotateShells : true,
      shellOpeningAngle: options.shellOpeningAngle || Math.PI * 0.5 // Aperture/opening angle
    };
    
    // Shell properties
    this.shells = [];
    
    // Animation state
    this.animationId = null;
    this.isRunning = false;
    this.lastFrame = 0;
    this.resizeTimeout = null;
    this.isVisible = true;
    this.frameDelay = 1000 / this.options.throttleFPS;
    
    // Bind event handlers
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._onResize = this._onResize.bind(this);
    
    // Detect mobile devices
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Skip initialization if disabled on mobile
    if (this.isMobile && this.options.disableOnMobile) {
      console.info('Nautilus animation disabled on mobile device');
      return;
    }
    
    // Set up the canvas and initialize
    this._setupCanvas();
    this._createShells();
    this._addEventListeners();
    
    // Start animation
    this.start();
  }
  
  // Set up canvas dimensions with appropriate scaling
  _setupCanvas() {
    // Get display dimensions
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    
    // Set a reasonable max dimension for the canvas
    const maxDimension = Math.min(1920, Math.max(displayWidth, displayHeight));
    
    // Use a reduced pixel ratio for mobile
    const pixelRatio = this.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    
    // Calculate canvas dimensions
    const canvasWidth = this.isMobile ? displayWidth : Math.min(displayWidth, maxDimension);
    const canvasHeight = this.isMobile ? displayHeight : Math.min(displayHeight, maxDimension);
    
    // Set canvas dimensions (physical pixels)
    this.canvas.width = canvasWidth * pixelRatio;
    this.canvas.height = canvasHeight * pixelRatio;
    
    // Set display dimensions (CSS pixels)
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    
    // Scale the context
    this.ctx.scale(pixelRatio, pixelRatio);
    
    // Store dimensions for calculations
    this.width = canvasWidth;
    this.height = canvasHeight;
  }
  
  // Create initial shells
  _createShells() {
    this.shells = [];
    
    // Reduce shell count on mobile
    const count = this.isMobile ? Math.floor(this.options.shellCount / 2) : this.options.shellCount;
    
    for (let i = 0; i < count; i++) {
      this.shells.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: this._random(this.options.minSize, this.options.maxSize),
        isAmmonite: Math.random() > 0.4, // 60% chance of being ammonite
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.002,
        growth: this._random(0.85, 1.15) * this.options.growth,
        velocity: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2
        },
        colorStart: this._randomColor(),
        colorEnd: this._randomColor(),
        septaColor: this._randomColor(0.8),
        opacity: this._random(this.options.opacity * 0.7, this.options.opacity * 1.3),
        // Create offscreen buffer for performance
        buffer: null
      });
    }
  }
  
  // Generate a random color from the palette
  _randomColor(opacity = 1) {
    // Use the moss green to light pink gradient
    const startColor = '#5a7247'; // Moss green
    const endColor = '#f7cad0';   // Light pink
    const accentColor = '#47603a'; // Darker moss green
    
    const colors = [
      startColor,
      endColor,
      accentColor
    ];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Convert hex to rgba with opacity
    if (color.startsWith('#')) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return color;
  }
  
  // Generate a random number between min and max
  _random(min, max) {
    return min + Math.random() * (max - min);
  }
  
  // Add event listeners
  _addEventListeners() {
    if (this.options.responsive) {
      window.addEventListener('resize', this._onResize);
    }
    
    if (this.options.pauseOnBlur) {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
      
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(entries => {
          this.isVisible = entries[0].isIntersecting;
          if (this.isVisible) {
            if (!this.isRunning) this.start();
          } else {
            if (this.isRunning) this.stop();
          }
        });
        this.observer.observe(this.canvas);
      }
    }
  }
  
  // Handle visibility changes
  _onVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else if (this.isVisible) {
      this.start();
    }
  }
  
  // Handle window resize with debounce
  _onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this._setupCanvas();
      
      // Invalidate shell buffers and reposition shells
      this.shells.forEach(shell => {
        shell.buffer = null;
        shell.x = Math.min(Math.max(shell.size, shell.x), this.width - shell.size);
        shell.y = Math.min(Math.max(shell.size, shell.y), this.height - shell.size);
      });
    }, 200);
  }
  
  // Start animation
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrame = performance.now();
    this.animationId = requestAnimationFrame(this._animate.bind(this));
  }
  
  // Stop animation
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  // Main animation loop
  _animate(timestamp) {
    if (!this.isRunning) return;
    
    // Throttle FPS
    const elapsed = timestamp - this.lastFrame;
    
    if (elapsed > this.frameDelay) {
      this.lastFrame = timestamp - (elapsed % this.frameDelay);
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      // Draw background if specified
      if (this.options.backgroundColor !== 'transparent') {
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
      
      // Update and draw shells
      this._updateShells(elapsed);
      this._drawShells();
    }
    
    // Continue animation loop
    this.animationId = requestAnimationFrame(this._animate.bind(this));
  }
  
  // Update shell positions
  _updateShells(elapsed) {
    for (const shell of this.shells) {
      // Move shell
      shell.x += shell.velocity.x * (elapsed / 16); // Normalize to ~60fps
      shell.y += shell.velocity.y * (elapsed / 16);
      
      // Rotate shell if enabled
      if (this.options.rotateShells) {
        shell.angle += shell.rotation * (elapsed / 16);
      }
      
      // Boundary checks with gentle bounce
      if (shell.x < shell.size) {
        shell.x = shell.size;
        shell.velocity.x *= -0.8;
      } else if (shell.x > this.width - shell.size) {
        shell.x = this.width - shell.size;
        shell.velocity.x *= -0.8;
      }
      
      if (shell.y < shell.size) {
        shell.y = shell.size;
        shell.velocity.y *= -0.8;
      } else if (shell.y > this.height - shell.size) {
        shell.y = this.height - shell.size;
        shell.velocity.y *= -0.8;
      }
      
      // Slowly dampen velocity to prevent eternal bouncing
      shell.velocity.x *= 0.995;
      shell.velocity.y *= 0.995;
      
      // Add slight random movement
      if (Math.random() < 0.05) {
        shell.velocity.x += (Math.random() - 0.5) * 0.02;
        shell.velocity.y += (Math.random() - 0.5) * 0.02;
      }
    }
  }
  
  // Draw all shells
  _drawShells() {
    for (const shell of this.shells) {
      this.ctx.save();
      this.ctx.translate(shell.x, shell.y);
      this.ctx.rotate(shell.angle);
      this.ctx.globalAlpha = shell.opacity;
      
      // Draw the correct shell type
      if (shell.isAmmonite) {
        this._drawAmmonite(shell);
      } else {
        this._drawNautilus(shell);
      }
      
      this.ctx.restore();
    }
  }
  
  // Draw a nautilus shell
  _drawNautilus(shell) {
    const size = shell.size;
    const a = shell.growth; // Growth factor
    const turns = this.options.nautilusTurns;
    const pointsPerTurn = this.options.pointsPerTurn;
    const totalPoints = Math.ceil(pointsPerTurn * turns);
    const septaCount = this.options.nautilusSeptaCount;
    
    // The nautilus has a chamber that opens outward
    const openingAngle = this.options.shellOpeningAngle;
    
    // Generate spiral points
    const outerPoints = [];
    const innerPoints = [];
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / pointsPerTurn;
      const theta = 2 * Math.PI * t;
      
      // Skip points in the opening area
      if (t > turns - (openingAngle / (2 * Math.PI))) {
        continue;
      }
      
      // Calculate outer spiral points (logarithmic spiral)
      const r = size * Math.pow(Math.E, a * theta);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      outerPoints.push({ x, y, theta, r });
      
      // Calculate inner spiral points
      const innerR = r * 0.65; // Inner spiral is 65% of the outer
      const innerX = innerR * Math.cos(theta);
      const innerY = innerR * Math.sin(theta);
      innerPoints.push({ x: innerX, y: innerY, theta, r: innerR });
    }
    
    // Draw the outer shape with gradient
    this.ctx.beginPath();
    for (let i = 0; i < outerPoints.length; i++) {
      const point = outerPoints[i];
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    
    // Create a linear gradient based on shell size and angle
    const gradient = this.ctx.createLinearGradient(
      -size, -size, size, size
    );
    gradient.addColorStop(0, shell.colorStart);
    gradient.addColorStop(1, shell.colorEnd);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw the inner spiral
    this.ctx.beginPath();
    for (let i = 0; i < innerPoints.length; i++) {
      const point = innerPoints[i];
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    
    this.ctx.strokeStyle = shell.colorEnd;
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
    
    // Calculate septa (chamber walls) spacing
    const septaStep = Math.floor(outerPoints.length / septaCount);
    
    // Draw the septa (chamber walls) - connecting adjacent whorls
    this.ctx.strokeStyle = shell.septaColor;
    this.ctx.lineWidth = 0.8;
    
    for (let i = septaStep; i < outerPoints.length; i += septaStep) {
      if (i < outerPoints.length && i + septaStep < outerPoints.length) {
        const outerPoint = outerPoints[i];
        
        // Find the corresponding inner point
        const innerIndex = Math.min(i, innerPoints.length - 1);
        const innerPoint = innerPoints[innerIndex];
        
        // For realistic nautilus septa, we need to find the previous whorl point
        // Nautilus septa connect to the previous whorl, not to the center
        // Calculate where this septa meets the previous whorl
        
        // Calculate angle from current point (about one full revolution back)
        const prevWhorlAngle = outerPoint.theta - (2 * Math.PI);
        
        // Only draw if the previous whorl exists
        if (prevWhorlAngle > 0) {
          // Find the closest point on the outer spiral that matches the previous whorl
          let prevWhorlPoint = null;
          let minAngleDiff = Infinity;
          
          for (const point of outerPoints) {
            const angleDiff = Math.abs(point.theta - prevWhorlAngle);
            if (angleDiff < minAngleDiff) {
              minAngleDiff = angleDiff;
              prevWhorlPoint = point;
            }
          }
          
          if (prevWhorlPoint) {
            // Draw a curved septa from outer point to previous whorl
            // Use bezier curve for more natural looking septa
            
            // Calculate control points for a natural curve
            // Nautilus septa typically curve backward (adapertural)
            const angle = outerPoint.theta;
            
            // Calculate perpendicular direction for the control point
            const perpX = Math.cos(angle + Math.PI/2);
            const perpY = Math.sin(angle + Math.PI/2);
            
            // Calculate distance for control point offset
            const ctrlDistance = outerPoint.r * 0.3;
            
            // First control point - near the outer edge, curved backward
            const ctrl1X = outerPoint.x - perpX * ctrlDistance;
            const ctrl1Y = outerPoint.y - perpY * ctrlDistance;
            
            // Second control point - near the previous whorl
            const ctrl2X = prevWhorlPoint.x + (outerPoint.x - prevWhorlPoint.x) * 0.3;
            const ctrl2Y = prevWhorlPoint.y + (outerPoint.y - prevWhorlPoint.y) * 0.3;
            
            // Draw curved septa from outer point to previous whorl
            this.ctx.beginPath();
            this.ctx.moveTo(outerPoint.x, outerPoint.y);
            this.ctx.bezierCurveTo(
              ctrl1X, ctrl1Y,
              ctrl2X, ctrl2Y,
              prevWhorlPoint.x, prevWhorlPoint.y
            );
            this.ctx.stroke();
          }
        } else {
          // For the innermost whorls where no previous whorl exists
          // Connect to the inner spiral instead
          
          // Calculate control points for the curve
          // For innermost septa, they curve backward (toward the center)
          const controlX = (outerPoint.x + innerPoint.x) / 2 - 
                          (outerPoint.y - innerPoint.y) * 0.2;
          const controlY = (outerPoint.y + innerPoint.y) / 2 + 
                          (outerPoint.x - innerPoint.x) * 0.2;
          
          // Draw curved septa
          this.ctx.beginPath();
          this.ctx.moveTo(outerPoint.x, outerPoint.y);
          this.ctx.quadraticCurveTo(
            controlX, controlY,
            innerPoint.x, innerPoint.y
          );
          this.ctx.stroke();
        }
      }
    }
  }
  
  // Draw an ammonite shell
  _drawAmmonite(shell) {
    const size = shell.size;
    const a = shell.growth * 0.85; // Slightly tighter coiling for ammonites
    const turns = this.options.ammoniteTurns;
    const pointsPerTurn = this.options.pointsPerTurn;
    const totalPoints = Math.ceil(pointsPerTurn * turns);
    const septaCount = this.options.ammoniteSeptaCount;
    
    // Generate spiral points
    const outerPoints = [];
    const innerPoints = [];
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / pointsPerTurn;
      const theta = 2 * Math.PI * t;
      
      // Calculate outer spiral points (logarithmic spiral)
      const r = size * Math.pow(Math.E, a * theta);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      outerPoints.push({ x, y, theta, r });
      
      // Calculate inner spiral points (more consistent chamber width)
      const innerR = r - (size * 0.1); // Constant chamber width
      const innerX = innerR * Math.cos(theta);
      const innerY = innerR * Math.sin(theta);
      innerPoints.push({ x: innerX, y: innerY, theta, r: innerR });
    }
    
    // Draw the outer shape with gradient
    this.ctx.beginPath();
    for (let i = 0; i < outerPoints.length; i++) {
      const point = outerPoints[i];
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    
    // Connect back to the first inner point to close the shape
    for (let i = innerPoints.length - 1; i >= 0; i--) {
      const point = innerPoints[i];
      this.ctx.lineTo(point.x, point.y);
    }
    
    this.ctx.closePath();
    
    // Create a linear gradient based on shell size
    const gradient = this.ctx.createLinearGradient(
      -size, -size, size, size
    );
    gradient.addColorStop(0, shell.colorStart);
    gradient.addColorStop(1, shell.colorEnd);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw external ribbing (typical of many ammonite species)
    if (this.options.ammoniteRibbing) {
      this.ctx.beginPath();
      
      // Draw ribs with a step to avoid drawing too many
      const ribStep = Math.max(2, Math.floor(outerPoints.length / 60));
      
      for (let i = 0; i < outerPoints.length; i += ribStep) {
        if (i + ribStep < outerPoints.length) {
          const p1 = outerPoints[i];
          const p2 = outerPoints[i + ribStep];
          
          // Calculate a point slightly outside the spiral for the rib
          const dx = p1.x - 0;  // Vector from origin to point
          const dy = p1.y - 0;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const ribX = p1.x + (dx / dist) * (size * 0.03);
          const ribY = p1.y + (dy / dist) * (size * 0.03);
          
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.quadraticCurveTo(
            ribX, ribY,
            p2.x, p2.y
          );
        }
      }
      
      this.ctx.strokeStyle = shell.septaColor;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
    
    // Calculate septa (chamber walls) spacing
    const septaStep = Math.floor(outerPoints.length / septaCount);
    
    // Draw the septa (chamber walls) - connecting between adjacent whorls
    this.ctx.strokeStyle = shell.septaColor;
    this.ctx.lineWidth = 0.8;
    
    for (let i = septaStep; i < outerPoints.length; i += septaStep) {
      if (i < outerPoints.length) {
        const outerPoint = outerPoints[i];
        
        // For accurate ammonite septa, we need to connect to the previous whorl
        const prevWhorlAngle = outerPoint.theta - (2 * Math.PI);
        
        // Only draw if the previous whorl exists
        if (prevWhorlAngle > 0) {
          // Find the closest point on the outer spiral that matches the previous whorl
          let prevWhorlPoint = null;
          let minAngleDiff = Infinity;
          
          for (const point of outerPoints) {
            const angleDiff = Math.abs(point.theta - prevWhorlAngle);
            if (angleDiff < minAngleDiff) {
              minAngleDiff = angleDiff;
              prevWhorlPoint = point;
            }
          }
          
          if (prevWhorlPoint) {
            // Ammonite septa are more complex with multiple folds (fluted)
            // Create several control points to simulate these folds
            
            // Calculate midpoint between outer point and previous whorl
            const midX = (outerPoint.x + prevWhorlPoint.x) / 2;
            const midY = (outerPoint.y + prevWhorlPoint.y) / 2;
            
            // Calculate distance and angle between points
            const dx = prevWhorlPoint.x - outerPoint.x;
            const dy = prevWhorlPoint.y - outerPoint.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);
            
            // Calculate perpendicular direction for the flutes
            const perpX = Math.cos(angle + Math.PI/2);
            const perpY = Math.sin(angle + Math.PI/2);
            
            // Create fluted pattern with multiple control points
            // This creates the characteristic "wavy" ammonite suture pattern
            const fluteFactor = size * 0.08 * Math.sin(i * 0.2); // Variation in flute size
            
            // Draw the complex fluted septa
            this.ctx.beginPath();
            this.ctx.moveTo(outerPoint.x, outerPoint.y);
            
            // Create path with multiple segments to simulate fluted pattern
            const segments = 4; // Number of flutes
            let lastX = outerPoint.x;
            let lastY = outerPoint.y;
            
            for (let s = 1; s <= segments; s++) {
              // Position along the path from outer to previous whorl
              const t = s / segments;
              
              // Base point along straight line
              const baseX = outerPoint.x + dx * t;
              const baseY = outerPoint.y + dy * t;
              
              // Flute amplitude varies along the path (stronger in middle)
              const fluteAmp = fluteFactor * Math.sin(t * Math.PI);
              
              // Alternating flute direction
              const dir = s % 2 === 0 ? 1 : -1;
              
              // Control point offset perpendicular to path
              const ctrlX = baseX + perpX * fluteAmp * dir;
              const ctrlY = baseY + perpY * fluteAmp * dir;
              
              // End point of this segment
              const endX = baseX + dx * (1/segments);
              const endY = baseY + dy * (1/segments);
              
              // Draw quadratic curve segment for this flute
              this.ctx.quadraticCurveTo(ctrlX, ctrlY, s === segments ? prevWhorlPoint.x : endX, s === segments ? prevWhorlPoint.y : endY);
              
              lastX = endX;
              lastY = endY;
            }
            
            this.ctx.stroke();
          }
        } else {
          // For the innermost whorls where no previous whorl exists
          // Draw a simplified septa toward the center
          
          // Find the corresponding inner point
          // For ammonites, innermost septa point toward the center
          const angle = Math.atan2(outerPoint.y, outerPoint.x);
          const innerX = 0; // Center point (origin of spiral)
          const innerY = 0;
          
          // Calculate control points for the curve
          // For ammonite septa, they are highly curved and folded
          const length = Math.sqrt(outerPoint.x * outerPoint.x + outerPoint.y * outerPoint.y);
          const midLength = length * 0.5;
          
          // Calculate a wavy/folded path typical of ammonite suture patterns
          const midX = midLength * Math.cos(angle);
          const midY = midLength * Math.sin(angle);
          
          // Create slight variations in each septa
          const waveFactor = size * 0.05 * Math.sin(i * 0.2);
          const controlX1 = midX + waveFactor * Math.sin(angle);
          const controlY1 = midY - waveFactor * Math.cos(angle);
          
          // Draw complex folded septa
          this.ctx.beginPath();
          this.ctx.moveTo(outerPoint.x, outerPoint.y);
          
          // Use bezier curve for more complex folding pattern
          this.ctx.bezierCurveTo(
            // First control point - near outer edge
            outerPoint.x * 0.7, outerPoint.y * 0.7,
            // Second control point - creates the fold
            controlX1, controlY1,
            // End point - toward center but not reaching it
            innerX + innerPoints[0].x * 0.2, innerY + innerPoints[0].y * 0.2
          );
          
          this.ctx.stroke();
        }
      }
    }
  }
  
  // Public method to resize canvas
  resize() {
    this._setupCanvas();
    
    // Invalidate shell buffers
    this.shells.forEach(shell => {
      shell.buffer = null;
    });
  }
  
  // Public method to set shell count
  setShellCount(count) {
    // Limit max shells for performance
    const targetCount = Math.max(1, Math.min(12, count)); 
    
    // Add or remove shells as needed
    while (this.shells.length < targetCount) {
      this.shells.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: this._random(this.options.minSize, this.options.maxSize),
        isAmmonite: Math.random() > 0.4,
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.002,
        growth: this._random(0.85, 1.15) * this.options.growth,
        velocity: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2
        },
        colorStart: this._randomColor(),
        colorEnd: this._randomColor(),
        septaColor: this._randomColor(0.8),
        opacity: this._random(this.options.opacity * 0.7, this.options.opacity * 1.3),
        buffer: null
      });
    }
    
    while (this.shells.length > targetCount) {
      this.shells.pop();
    }
  }
  
  // Clean up event listeners and resources
  destroy() {
    this.stop();
    
    if (this.options.responsive) {
      window.removeEventListener('resize', this._onResize);
    }
    
    if (this.options.pauseOnBlur) {
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
      if (this.observer) {
        this.observer.disconnect();
      }
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Clear shell buffers
    this.shells.forEach(shell => {
      shell.buffer = null;
    });
    
    // Clear references
    this.shells = [];
  }
}

// Expose the library to the global scope with the same interface name as before
window.ShellAnimation = NautilusAnimation;