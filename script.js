// Speed Test Application
class SpeedTest {
    constructor() {
        this.downloadSpeed = 0;
        this.uploadSpeed = 0;
        this.ping = 0;
        this.isTesting = false;
        
        // DOM Elements
        this.startBtn = document.getElementById('startBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.downloadValue = document.getElementById('downloadValue');
        this.uploadValue = document.getElementById('uploadValue');
        this.pingValue = document.getElementById('pingValue');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusMessage = document.getElementById('statusMessage');
        
        // Metric cards
        this.downloadCard = document.querySelector('.metric-card.download');
        this.pingCard = document.querySelector('.metric-card.ping');
        this.uploadCard = document.querySelector('.metric-card.upload');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startTest());
        this.retryBtn.addEventListener('click', () => this.startTest());
        this.shareBtn.addEventListener('click', () => this.shareResult());
        
        // Load saved results
        this.loadSavedResults();
    }
    
    loadSavedResults() {
        const saved = localStorage.getItem('speedtestResults');
        if (saved) {
            const results = JSON.parse(saved);
            this.displayResults(results.download, results.upload, results.ping);
            this.retryBtn.style.display = 'inline-block';
            this.shareBtn.style.display = 'inline-block';
        }
    }
    
    async startTest() {
        if (this.isTesting) return;
        
        this.isTesting = true;
        this.resetUI();
        
        try {
            // Test Ping
            this.updateStatus('Testing ping...');
            this.pingCard.classList.add('active');
            this.ping = await this.testPing();
            this.pingCard.classList.remove('active');
            this.pingValue.textContent = this.ping.toFixed(0);
            this.updateProgress(20);
            
            // Test Download
            this.updateStatus('Testing download speed...');
            this.downloadCard.classList.add('active');
            this.downloadSpeed = await this.testDownload();
            this.downloadCard.classList.remove('active');
            this.downloadValue.textContent = this.downloadSpeed.toFixed(2);
            this.updateProgress(60);
            
            // Test Upload
            this.updateStatus('Testing upload speed...');
            this.uploadCard.classList.add('active');
            this.uploadSpeed = await this.testUpload();
            this.uploadCard.classList.remove('active');
            this.uploadValue.textContent = this.uploadSpeed.toFixed(2);
            this.updateProgress(100);
            
            // Test complete
            this.updateStatus('Test complete!');
            this.showRetryButton();
            this.saveResults();
            
        } catch (error) {
            console.error('Speed test error:', error);
            this.updateStatus('Test failed. Please try again.');
            this.showRetryButton();
        }
        
        this.isTesting = false;
    }
    
    async testPing() {
        const pings = [];
        const iterations = 5;
        
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            try {
                await fetch('/api/ping', { 
                    method: 'GET',
                    cache: 'no-cache'
                });
                const end = performance.now();
                pings.push(end - start);
            } catch (error) {
                // Fallback to a public ping endpoint if local API fails
                await fetch('https://www.google.com/favicon.ico', { 
                    method: 'HEAD',
                    cache: 'no-cache',
                    mode: 'no-cors'
                });
                const end = performance.now();
                pings.push(end - start);
            }
        }
        
        // Calculate average and remove outliers
        pings.sort((a, b) => a - b);
        const validPings = pings.slice(1, -1); // Remove min and max
        return validPings.reduce((sum, p) => sum + p, 0) / validPings.length;
    }
    
    async testDownload() {
        const fileSize = 10000000; // 10MB
        const url = `https://speed.cloudflare.com/__down?bytes=${fileSize}&t=${Date.now()}`;
        
        const start = performance.now();
        let loadedBytes = 0;
        
        try {
            const response = await fetch(url);
            const reader = response.body.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                loadedBytes += value.length;
                const elapsed = (performance.now() - start) / 1000;
                const currentSpeed = (loadedBytes * 8 / elapsed) / 1000000; // Mbps
                this.downloadValue.textContent = currentSpeed.toFixed(2);
            }
            
            const end = performance.now();
            const totalTime = (end - start) / 1000;
            const speedMbps = (fileSize * 8 / totalTime) / 1000000;
            
            return speedMbps;
        } catch (error) {
            console.error('Download test error:', error);
            // Fallback: use a smaller file
            return await this.testDownloadFallback();
        }
    }
    
    async testDownloadFallback() {
        const fileSize = 1000000; // 1MB fallback
        const url = `https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg?t=${Date.now()}`;
        
        const start = performance.now();
        
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const end = performance.now();
            
            const totalTime = (end - start) / 1000;
            const speedMbps = (blob.size * 8 / totalTime) / 1000000;
            
            return speedMbps;
        } catch (error) {
            return 0;
        }
    }
    
    async testUpload() {
        const dataSize = 10000000; // 10MB
        const data = new Blob([new Array(dataSize).fill('a').join('')], { type: 'text/plain' });
        
        const start = performance.now();
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            
            const end = performance.now();
            const totalTime = (end - start) / 1000;
            const speedMbps = (dataSize * 8 / totalTime) / 1000000;
            
            return speedMbps;
        } catch (error) {
            console.error('Upload test error:', error);
            // Fallback: simulate upload test
            return await this.testUploadFallback();
        }
    }
    
    async testUploadFallback() {
        const dataSize = 1000000; // 1MB fallback
        const data = new Blob([new Array(dataSize).fill('a').join('')], { type: 'text/plain' });
        
        const start = performance.now();
        
        try {
            // Use httpbin for upload test fallback
            const response = await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            
            const end = performance.now();
            const totalTime = (end - start) / 1000;
            const speedMbps = (dataSize * 8 / totalTime) / 1000000;
            
            return speedMbps;
        } catch (error) {
            return 0;
        }
    }
    
    resetUI() {
        this.downloadValue.textContent = '0.00';
        this.uploadValue.textContent = '0.00';
        this.pingValue.textContent = '0';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = 'Starting test...';
        this.startBtn.style.display = 'none';
        this.retryBtn.style.display = 'none';
        this.shareBtn.style.display = 'none';
    }
    
    updateProgress(percent) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = `${percent}% complete`;
    }
    
    updateStatus(message) {
        this.statusMessage.textContent = message;
    }
    
    showRetryButton() {
        this.retryBtn.style.display = 'inline-block';
        this.shareBtn.style.display = 'inline-block';
    }
    
    displayResults(download, upload, ping) {
        this.downloadValue.textContent = download.toFixed(2);
        this.uploadValue.textContent = upload.toFixed(2);
        this.pingValue.textContent = ping.toFixed(0);
    }
    
    saveResults() {
        const results = {
            download: this.downloadSpeed,
            upload: this.uploadSpeed,
            ping: this.ping,
            timestamp: Date.now()
        };
        localStorage.setItem('speedtestResults', JSON.stringify(results));
    }
    
    shareResult() {
        const url = new URL(window.location.href);
        url.searchParams.set('d', this.downloadSpeed.toFixed(2));
        url.searchParams.set('u', this.uploadSpeed.toFixed(2));
        url.searchParams.set('p', this.ping.toFixed(0));
        
        const shareUrl = url.toString();
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.updateStatus('Link copied to clipboard!');
            }).catch(() => {
                this.updateStatus('Failed to copy link');
            });
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.updateStatus('Link copied to clipboard!');
        }
        
        // Also try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My Speed Test Results',
                text: `Download: ${this.downloadSpeed.toFixed(2)} Mbps, Upload: ${this.uploadSpeed.toFixed(2)} Mbps, Ping: ${this.ping.toFixed(0)} ms`,
                url: shareUrl
            }).catch(() => {
                // Share was cancelled or failed
            });
        }
    }
}

// Check for shared results in URL
function checkSharedResults() {
    const params = new URLSearchParams(window.location.search);
    const download = params.get('d');
    const upload = params.get('u');
    const ping = params.get('p');
    
    if (download && upload && ping) {
        // Display shared results
        document.getElementById('downloadValue').textContent = parseFloat(download).toFixed(2);
        document.getElementById('uploadValue').textContent = parseFloat(upload).toFixed(2);
        document.getElementById('pingValue').textContent = parseFloat(ping).toFixed(0);
        
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('retryBtn').style.display = 'inline-block';
        document.getElementById('shareBtn').style.display = 'inline-block';
        document.getElementById('progressText').textContent = 'Shared result';
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('statusMessage').textContent = 'Viewing shared speed test result';
        
        // Update OG image
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', `/api/og?download=${download}&upload=${upload}&ping=${ping}`);
        }
        
        return true;
    }
    return false;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSharedResults()) {
        new SpeedTest();
    }
});
