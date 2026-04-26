document.addEventListener('DOMContentLoaded', () => {
    // === 1. Cosmic Starfield Canvas ===
    const canvas = document.createElement('canvas');
    canvas.id = 'cosmic-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    const numStars = window.innerWidth < 768 ? 200 : 600;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 2 + 0.1,
            baseAlpha: Math.random() * 0.8 + 0.2,
            size: Math.random() * 1.2 + 0.3
        });
    }

    // === 2. Custom Animated Cursor Elements ===
    // The giant subtle nebula
    const blob = document.createElement('div');
    blob.classList.add('cursor-glow');
    document.body.appendChild(blob);

    // The sharp core dot
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    // The animated trailing ring
    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorRing);

    let ringX = width / 2;
    let ringY = height / 2;

    const updateTarget = (clientX, clientY) => {
        // Parallax target
        targetX = (clientX - width / 2) * 0.05;
        targetY = (clientY - height / 2) * 0.05;

        // Instant update for dot
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;

        // Smooth follow for the giant nebula
        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
    };

    let actualMouseX = width / 2;
    let actualMouseY = height / 2;

    document.addEventListener('mousemove', (e) => {
        actualMouseX = e.clientX;
        actualMouseY = e.clientY;
        updateTarget(e.clientX, e.clientY);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            actualMouseX = e.touches[0].clientX;
            actualMouseY = e.touches[0].clientY;
            updateTarget(actualMouseX, actualMouseY);
        }
    }, { passive: true });
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            actualMouseX = e.touches[0].clientX;
            actualMouseY = e.touches[0].clientY;
            updateTarget(actualMouseX, actualMouseY);
        }
    }, { passive: true });

    // Add hover states to all links
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        link.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    // === 3. Animation Loop ===
    function animate() {
        // Smoothly interpolate parallax target
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Smoothly interpolate the cursor ring physics
        ringX += (actualMouseX - ringX) * 0.15; 
        ringY += (actualMouseY - ringY) * 0.15;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        ctx.clearRect(0, 0, width, height);
        
        const gradient = ctx.createRadialGradient(width / 2 - mouseX * 2, height / 2 - mouseY * 2, 0, width / 2, height / 2, width);
        gradient.addColorStop(0, 'rgba(60, 20, 100, 0.3)');
        gradient.addColorStop(0.5, 'rgba(15, 10, 40, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'white';

        stars.forEach(star => {
            const offsetX = mouseX * star.z;
            const offsetY = mouseY * star.z;
            
            let drawX = star.x + offsetX;
            let drawY = star.y + offsetY;
            
            if (drawX < 0) drawX += width;
            if (drawX > width) drawX -= width;
            if (drawY < 0) drawY += height;
            if (drawY > height) drawY -= height;

            ctx.globalAlpha = star.baseAlpha;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    
    // === 4. Learnings Page Navigation ===
    const dayBtns = document.querySelectorAll('.day-btn');
    const dayPanes = document.querySelectorAll('.day-pane');

    if (dayBtns.length > 0 && dayPanes.length > 0) {
        dayBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                dayBtns.forEach(b => b.classList.remove('active'));
                dayPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding pane
                const targetId = btn.getAttribute('data-day');
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    animate();
});
