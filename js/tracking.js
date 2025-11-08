// Tracking page functionality
document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const trackingNumber = document.getElementById('trackingNumber').value;
            
            // Simulate tracking lookup
            if (trackingNumber.trim() !== '') {
                trackingResult.style.display = 'block';
                
                // Simulate different status based on tracking number
                if (trackingNumber.toLowerCase().includes('delivered')) {
                    updateTrackingStatus(100, 'Delivered');
                } else if (trackingNumber.toLowerCase().includes('transit')) {
                    updateTrackingStatus(75, 'In Transit');
                } else {
                    updateTrackingStatus(50, 'Processing');
                }
            } else {
                alert('Please enter a tracking number');
            }
        });
    }
    
    function updateTrackingStatus(percentage, status) {
        const progressBar = document.querySelector('.progress-bar');
        const statusText = document.querySelector('.status-text');
        
        progressBar.style.width = percentage + '%';
        progressBar.textContent = percentage + '% Complete';
        progressBar.setAttribute('aria-valuenow', percentage);
        
        if (statusText) {
            statusText.textContent = 'Status: ' + status;
        }
    }
});