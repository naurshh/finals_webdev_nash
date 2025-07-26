// Dark mode toggle functionality - Global implementation
(function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // Add click animation
            darkModeToggle.classList.add('clicked');
            setTimeout(() => {
                darkModeToggle.classList.remove('clicked');
            }, 300);
            
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    function enableDarkMode() {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        localStorage.setItem('darkMode', 'enabled');
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('darkMode', 'disabled');
    }
})();

// Form validation and submission - Page-specific implementation
(function() {
    if (document.getElementById("contactForm")) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbxJjL7w9l2xNnHdRKT1Y5f7ipXic85L8aEGkrCEps1c02J4qVO-QbPP3rqIKqoorxrH2Q/exec";
        const form = document.getElementById("contactForm");
        const feedbackMsg = document.getElementById("feedback");

        function validateEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            // Clear previous feedback
            feedbackMsg.textContent = "";
            feedbackMsg.style.color = "";
            
            // Validate form fields
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            
            // Check if fields are empty
            if (!name || !email || !message) {
                feedbackMsg.textContent = "Please fill out all fields.";
                feedbackMsg.style.color = "red";
                return false;
            }
            
            // Validate email format
            if (!validateEmail(email)) {
                feedbackMsg.textContent = "Please enter a valid email address.";
                feedbackMsg.style.color = "red";
                return false;
            }
            
            // Show loading state
            feedbackMsg.textContent = "Sending your message...";
            feedbackMsg.style.color = "black";

            // Prepare form data
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);

            // Send data to Google Apps Script
            fetch(scriptURL, {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                if (data.result === "success") {
                    feedbackMsg.textContent = "";
                    createConfettiExplosion();
                    showSuccessPopup();
                    document.getElementById("confirmation").style.display = "block";
                    
                    // Ask if user wants to submit another response
                    setTimeout(() => {
                        const submitAnother = confirm("Would you like to submit another response?");
                        if (submitAnother) {
                            resetForm();
                        } else {
                            closeConfirmation();
                        }
                    }, 1500);
                } else {
                    throw new Error(data.message || "Unknown server error");
                }
            })
            .catch(error => {
                feedbackMsg.textContent = "Error: " + error.message;
                feedbackMsg.style.color = "red";
                console.error('Error:', error);
            });
        }

        form.addEventListener("submit", handleFormSubmit);

        function resetForm() {
            form.reset();
            feedbackMsg.textContent = "";
            document.getElementById("confirmation").style.display = "none";
            // Re-focus on the first field for better UX
            document.getElementById("name").focus();
        }

        function closeConfirmation() {
            document.getElementById("confirmation").style.display = "none";
            feedbackMsg.textContent = "Thank you for your message!";
        }

        // Confetti Explosion Functions
        function createConfettiExplosion() {
            const container = document.getElementById('confettiContainer');
            container.style.display = 'block';
            container.innerHTML = '';
            
            const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                          '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
                          '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'];
            
            // Create 300 confetti pieces for a massive explosion
            for (let i = 0; i < 300; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Random properties
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 15 + 5;
                const shape = Math.random() > 0.5 ? '50%' : '0';
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 2 + 2;
                const delay = Math.random() * 1;
                
                // Apply styles
                confetti.style.backgroundColor = color;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                confetti.style.borderRadius = shape;
                confetti.style.left = left + 'vw';
                confetti.style.top = -10 + 'px';
                confetti.style.animationDuration = animationDuration + 's';
                confetti.style.animationDelay = delay + 's';
                
                container.appendChild(confetti);
            }
            
            // Hide container after animation completes
            setTimeout(() => {
                container.style.display = 'none';
            }, 3000);
        }
        
        function showSuccessPopup() {
            const popup = document.getElementById('successPopup');
            popup.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        }
    }
})();
