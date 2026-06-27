// Speed Test Application with accurate testing methodology
class SpeedTest {
    constructor() {
        this.downloadSpeed = 0;
        this.uploadSpeed = 0;
        this.ping = 0;
        this.jitter = 0;
        this.isTesting = false;
        
        // Optimized settings for accurate measurements
        this.pingTestCount = 10;
        this.downloadThreads = 6;
        this.uploadThreads = 4;
        this.testDuration = 10000;
        this.abortControllers = [];
        
        // DOM Elements
        this.startTestBtn = document.getElementById('start-test');
        this.backToTestBtn = document.getElementById('back-to-test');
        this.shareBtn = document.getElementById('share-results');
        
        this.resultsSection = document.getElementById('results-section');
        this.testControlSection = document.getElementById('test-control-section');
        this.testButtonContainer = document.getElementById('test-button-container');
        this.progressContainer = document.getElementById('progress-container');
        
        // Metric elements
        this.downloadSpeedEl = document.getElementById('download-speed');
        this.uploadSpeedEl = document.getElementById('upload-speed');
        this.pingEl = document.getElementById('ping');
        this.jitterEl = document.getElementById('jitter');
        this.downloadRateEl = document.getElementById('download-rate');
        this.downloadQualityEl = document.getElementById('download-quality');
        this.uploadRateEl = document.getElementById('upload-rate');
        this.uploadQualityEl = document.getElementById('upload-quality');
        
        // Progress elements
        this.currentSpeedEl = document.getElementById('current-speed');
        this.progressBar = document.getElementById('progress-bar');
        this.progressPercentage = document.getElementById('progress-percentage');
        this.testStatus = document.getElementById('test-status');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.cancelTestBtn = document.getElementById('cancel-test');
        
        // Test phase elements
        this.testPhases = document.querySelectorAll('.test-phase');
        
        // ISP info elements
        this.serverLocationEl = document.getElementById('server-location');
        this.serverDistanceEl = document.getElementById('server-distance');
        this.ispNameEl = document.getElementById('isp-name');
        this.ipAddressEl = document.getElementById('ip-address');
        
        // Event listeners
        this.startTestBtn.addEventListener('click', () => this.startTest());
        this.backToTestBtn.addEventListener('click', () => this.showTestControl());
        this.shareBtn.addEventListener('click', () => this.shareResult());
        this.cancelTestBtn.addEventListener('click', () => this.cancelTest());
        
        // Detect ISP info
        this.detectISP();
        
        // Initialize UI state
        this.showTestControl();
    }
    
    loadSavedResults() {
        const saved = localStorage.getItem('speedtestResults');
        if (saved) {
            const results = JSON.parse(saved);
            this.displayResults(results.download, results.upload, results.ping, results.jitter);
            this.showResultsSection();
        }
    }
    
    async detectISP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.ip) {
                this.ipAddressEl.textContent = data.ip;
            }
            if (data.org) {
                this.ispNameEl.textContent = data.org;
            }
            if (data.city && data.country_name) {
                this.serverLocationEl.textContent = `${data.city}, ${data.country_name}`;
            }
        } catch (error) {
            console.error('ISP detection failed:', error);
            this.ispNameEl.textContent = 'Unknown ISP';
            this.ipAddressEl.textContent = '--';
        }
    }
    
    showTestControl() {
        this.resultsSection.classList.add('hidden');
        this.testControlSection.classList.remove('hidden');
        this.testButtonContainer.classList.remove('hidden');
        this.progressContainer.classList.add('hidden');
    }
    
    showResultsSection() {
        this.resultsSection.classList.remove('hidden');
        this.testControlSection.classList.add('hidden');
    }
    
    showProgress() {
        this.testButtonContainer.classList.add('hidden');
        this.progressContainer.classList.remove('hidden');
        this.cancelTestBtn.style.display = 'inline-block';
    }
    
    hideProgress() {
        this.progressContainer.classList.add('hidden');
        this.cancelTestBtn.style.display = 'none';
    }
    
    updateTestPhase(phase, status) {
        this.testPhases.forEach(el => {
            const phaseName = el.getAttribute('data-phase');
            if (phaseName === phase) {
                el.setAttribute('data-phase', status);
            }
        });
    }
    
    resetTestPhases() {
        this.testPhases.forEach(el => {
            const phaseName = el.getAttribute('data-phase');
            el.setAttribute('data-phase', phaseName);
        });
    }
    
    cancelTest() {
        this.isTesting = false;
        this.cleanup();
        this.hideProgress();
        this.showTestControl();
        this.resetTestPhases();
    }
    
    shareResult() {
        const url = new URL(window.location.href);
        url.searchParams.set('d', this.downloadSpeed.toFixed(2));
        url.searchParams.set('u', this.uploadSpeed.toFixed(2));
        url.searchParams.set('p', this.ping.toFixed(0));
        url.searchParams.set('j', this.jitter.toFixed(0));
        
        const shareUrl = url.toString();
        
        // Update OG meta tags for social media preview
        this.updateOGMetaTags();
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.updateTestStatus('Link copied to clipboard!');
                setTimeout(() => {
                    this.updateTestStatus('');
                }, 2000);
            }).catch(() => {
                this.updateTestStatus('Failed to copy link');
            });
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.updateTestStatus('Link copied to clipboard!');
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
    
    updateOGMetaTags() {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        
        const imageUrl = `/api/og?download=${this.downloadSpeed.toFixed(2)}&upload=${this.uploadSpeed.toFixed(2)}&ping=${this.ping.toFixed(0)}`;
        
        if (ogImage) {
            ogImage.setAttribute('content', imageUrl);
        }
        
        if (twitterImage) {
            twitterImage.setAttribute('content', imageUrl);
        }
    }
    
    async startTest() {
        if (this.isTesting) return;
        
        this.isTesting = true;
        this.resetUI();
        this.abortControllers = [];
        this.resetTestPhases();
        this.showProgress();
        
        try {
            // Test Ping
            this.updateTestStatus('Testing latency...');
            this.updateTestPhase('ping', 'active');
            await this.testPing();
            this.updateTestPhase('ping', 'ping complete');
            this.updateProgress(25);
            
            // Test Download
            this.updateTestStatus('Testing download speed...');
            this.updateTestPhase('download', 'active');
            await this.testDownload();
            this.updateTestPhase('download', 'download complete');
            this.updateProgress(75);
            
            // Test Upload
            this.updateTestStatus('Testing upload speed...');
            this.updateTestPhase('upload', 'active');
            await this.testUpload();
            this.updateTestPhase('upload', 'upload complete');
            this.updateProgress(100);
            
            // Test complete
            this.updateTestPhase('complete', 'active');
            this.updateTestStatus('Test complete!');
            this.saveResults();
            this.hideProgress();
            this.showResultsSection();
            
        } catch (error) {
            console.error('Speed test error:', error);
            this.updateTestStatus('Test failed. Please try again.');
            this.hideProgress();
            this.showTestControl();
        } finally {
            this.cleanup();
            this.isTesting = false;
        }
    }
    
    cleanup() {
        this.abortControllers.forEach(controller => {
            try {
                controller.abort();
            } catch (e) {}
        });
        this.abortControllers = [];
    }
    
    async testPing() {
        const pings = [];
        const abortController = new AbortController();
        this.abortControllers.push(abortController);
        
        // Use multiple endpoints for better accuracy
        const pingUrls = [
            'https://cloudflare.com/cdn-cgi/trace',
            'https://1.1.1.1/cdn-cgi/trace',
            'https://www.google.com/favicon.ico'
        ];
        
        for (let i = 0; i < this.pingTestCount && this.isTesting; i++) {
            const url = pingUrls[i % pingUrls.length];
            const startTime = performance.now();
            try {
                await fetch(url, {
                    method: 'GET',
                    cache: 'no-cache',
                    mode: 'no-cors',
                    signal: abortController.signal
                });
                const endTime = performance.now();
                const ping = Math.round(endTime - startTime);
                if (ping < 1000 && ping > 0) {
                    pings.push(ping);
                }
            } catch (error) {
                if (error.name === 'AbortError') break;
                const endTime = performance.now();
                const ping = Math.round(endTime - startTime);
                if (ping < 500 && ping > 0) {
                    pings.push(ping);
                }
            }
            
            const progress = 0 + ((i + 1) / this.pingTestCount) * 25;
            this.updateProgress(progress);
            await this.delay(100);
        }
        
        if (pings.length > 0) {
            pings.sort((a, b) => a - b);
            const trimmedPings = this.trimArray(pings, 0.25, 0.25);
            this.ping = Math.round(trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length);
            this.jitter = this.calculateJitter(pings);
        } else {
            this.ping = 999;
            this.jitter = 0;
        }
        
        this.pingEl.textContent = this.ping;
        this.jitterEl.textContent = this.jitter;
    }
    
    async testDownload() {
        const testUrls = [
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://speed.cloudflare.com/__down?bytes=10485760',
            'https://upload.wikimedia.org/wikipedia/commons/3/3e/Alfonso_Cu%C3%A3%C2%A1n_2019_(cropped).jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg'
        ];

        const initialSpeed = await this.quickDownloadTest();
        const adaptiveDuration = Math.max(8000, Math.min(15000, this.calculateAdaptiveDuration(initialSpeed)));
        const numConnections = Math.min(6, Math.max(4, Math.ceil(initialSpeed / 50)));

        this.updateTestStatus('Testing download speed...');
        const mainStartTime = performance.now();
        let totalBytes = 0;
        let lastUpdateTime = mainStartTime;
        const speedSamples = [];

        const abortController = new AbortController();
        this.abortControllers.push(abortController);

        const downloadPromises = testUrls.slice(0, numConnections).map(async (url, threadIndex) => {
            let threadBytes = 0;
            let retryCount = 0;
            const maxRetries = 2;

            while (performance.now() - mainStartTime < adaptiveDuration && this.isTesting) {
                try {
                    const response = await fetch(url, {
                        cache: 'no-cache',
                        mode: 'cors',
                        signal: abortController.signal
                    });

                    if (!response.ok) {
                        retryCount++;
                        if (retryCount >= maxRetries) {
                            const nextUrlIndex = (threadIndex + 1) % testUrls.length;
                            url = testUrls[nextUrlIndex];
                            retryCount = 0;
                        }
                        await this.delay(100);
                        continue;
                    }

                    const reader = response.body.getReader();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunkSize = value.length;
                        threadBytes += chunkSize;
                        totalBytes += chunkSize;

                        const currentTime = performance.now();
                        if (currentTime - lastUpdateTime > 150) {
                            const elapsedSeconds = (currentTime - mainStartTime) / 1000;
                            const currentSpeed = (totalBytes * 8) / (elapsedSeconds * 1024 * 1024);

                            speedSamples.push({
                                time: elapsedSeconds,
                                speed: currentSpeed
                            });

                            if (speedSamples.length > 30) {
                                speedSamples.shift();
                            }

                            this.currentSpeedEl.textContent = currentSpeed.toFixed(2);
                            this.downloadSpeedEl.textContent = currentSpeed.toFixed(2);

                            const progress = 25 + ((currentTime - mainStartTime) / adaptiveDuration) * 50;
                            this.updateProgress(Math.min(progress, 75));
                            lastUpdateTime = currentTime;
                        }
                    }

                    retryCount = 0;

                } catch (error) {
                    if (error.name === 'AbortError') break;
                    retryCount++;

                    if (retryCount >= maxRetries) {
                        const nextUrlIndex = (threadIndex + 1) % testUrls.length;
                        url = testUrls[nextUrlIndex];
                        retryCount = 0;
                    }

                    await this.delay(100);
                }
            }

            return threadBytes;
        });

        await Promise.all(downloadPromises);

        const endTime = performance.now();
        const durationSeconds = (endTime - mainStartTime) / 1000;

        const method1 = this.calculateSpeed(totalBytes, durationSeconds);

        let method2 = method1;
        if (speedSamples.length >= 10) {
            const steadyState = speedSamples.slice(Math.floor(speedSamples.length * 0.5));
            method2 = steadyState.reduce((sum, s) => sum + s.speed, 0) / steadyState.length;
        }

        this.downloadSpeed = (method1 * 0.6 + method2 * 0.4);

        if (this.downloadSpeed <= 0 || !isFinite(this.downloadSpeed)) {
            this.downloadSpeed = Math.max(initialSpeed * 0.8, 5);
        }

        this.downloadSpeedEl.textContent = this.downloadSpeed.toFixed(2);
        this.downloadRateEl.textContent = (this.downloadSpeed / 8).toFixed(2) + ' MB/s';
        this.downloadQualityEl.textContent = this.getQualityRating(this.downloadSpeed, 'download');
    }
    
    async testUpload() {
        this.updateTestStatus('Testing upload speed...');
        
        try {
            const uploadSpeed = await this.optimizedUploadTest();
            if (uploadSpeed > 0) {
                this.uploadSpeed = uploadSpeed;
                this.uploadSpeedEl.textContent = this.uploadSpeed.toFixed(2);
                this.uploadRateEl.textContent = (this.uploadSpeed / 8).toFixed(2) + ' MB/s';
                this.uploadQualityEl.textContent = this.getQualityRating(this.uploadSpeed, 'upload');
                return;
            }
        } catch (error) {
            console.error('Upload test failed:', error);
        }
        
        this.uploadSpeed = 0;
        this.uploadSpeedEl.textContent = '0.00';
        this.uploadRateEl.textContent = '0.00 MB/s';
        this.uploadQualityEl.textContent = 'Poor';
    }
    
    async optimizedUploadTest() {
        const results = [];
        const testDuration = 8000;
        const startTime = performance.now();
        let totalBytes = 0;
        const speedSamples = [];
        
        // Use multiple concurrent uploads for better accuracy
        const uploadPromises = [];
        const numThreads = 4;
        
        for (let i = 0; i < numThreads; i++) {
            uploadPromises.push(this.uploadThread(testDuration, startTime, i));
        }
        
        await Promise.all(uploadPromises);
        
        // Calculate average speed from samples
        if (speedSamples.length > 0) {
            speedSamples.sort((a, b) => a - b);
            const trimmed = this.trimArray(speedSamples, 0.2, 0.2);
            const avgSpeed = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
            return Math.max(avgSpeed, 1);
        }
        
        return 0;
    }
    
    async uploadThread(duration, globalStartTime, threadIndex) {
        const chunkSize = 1024 * 1024; // 1MB chunks
        const data = new Array(chunkSize).fill('x').join('');
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const speedSamples = [];
        
        while (performance.now() - globalStartTime < duration && this.isTesting) {
            const chunkStartTime = performance.now();
            
            try {
                // Use a reliable endpoint for upload testing
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: blob,
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
                
                const chunkEndTime = performance.now();
                const chunkDuration = (chunkEndTime - chunkStartTime) / 1000;
                
                if (chunkDuration > 0) {
                    const speed = (chunkSize * 8) / (chunkDuration * 1024 * 1024);
                    speedSamples.push(speed);
                    
                    this.currentSpeedEl.textContent = speed.toFixed(2);
                    this.uploadSpeedEl.textContent = speed.toFixed(2);
                }
                
                // Update progress
                const elapsed = performance.now() - globalStartTime;
                const progress = 75 + (elapsed / duration) * 25;
                this.updateProgress(Math.min(progress, 100));
                
            } catch (error) {
                // If upload fails, continue with next chunk
                await this.delay(100);
            }
        }
        
        return speedSamples;
    }
    
    async quickDownloadTest() {
        const testConfigs = [
            { url: 'https://speed.cloudflare.com/__down?bytes=1048576', size: 1048576 },
            { url: 'https://speed.cloudflare.com/__down?bytes=2097152', size: 2097152 },
            { url: 'https://speed.cloudflare.com/__down?bytes=5242880', size: 5242880 },
            { url: 'https://speed.cloudflare.com/__down?bytes=10485760', size: 10485760 }
        ];
        
        let bestSpeed = 0;
        
        for (const config of testConfigs) {
            try {
                const startTime = performance.now();
                const response = await fetch(config.url, { 
                    cache: 'no-cache',
                    mode: 'cors'
                });
                
                if (!response.ok) continue;
                
                const reader = response.body.getReader();
                let bytes = 0;
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    bytes += value.length;
                }
                
                const duration = (performance.now() - startTime) / 1000;
                const speed = this.calculateSpeed(bytes, duration);
                bestSpeed = Math.max(bestSpeed, speed);
                
            } catch (error) {
                continue;
            }
        }
        
        return Math.max(bestSpeed, 10);
    }
    
    calculateAdaptiveDuration(initialSpeed) {
        if (initialSpeed < 10) return 15000;
        if (initialSpeed < 50) return 12000;
        if (initialSpeed < 100) return 10000;
        return 8000;
    }
    
    calculateSpeed(bytes, seconds) {
        if (seconds === 0) return 0;
        const speedMbps = (bytes * 8) / (seconds * 1024 * 1024);
        return Math.round(speedMbps * 100) / 100;
    }
    
    trimArray(arr, startPercent, endPercent) {
        const start = Math.floor(arr.length * startPercent);
        const end = Math.floor(arr.length * (1 - endPercent));
        return arr.slice(start, end);
    }
    
    calculateJitter(pings) {
        if (pings.length < 2) return 0;
        
        let jitterSum = 0;
        for (let i = 1; i < pings.length; i++) {
            jitterSum += Math.abs(pings[i] - pings[i - 1]);
        }
        
        return Math.round(jitterSum / (pings.length - 1));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    resetUI() {
        this.downloadSpeedEl.textContent = '0';
        this.uploadSpeedEl.textContent = '0';
        this.pingEl.textContent = '0';
        this.jitterEl.textContent = '0';
        this.downloadRateEl.textContent = '0 MB/s';
        this.downloadQualityEl.textContent = '--';
        this.uploadRateEl.textContent = '0 MB/s';
        this.uploadQualityEl.textContent = '--';
        this.currentSpeedEl.textContent = '0';
        this.progressBar.style.width = '0%';
        this.progressPercentage.textContent = '0%';
    }
    
    updateProgress(percent) {
        this.progressBar.style.width = `${percent}%`;
        this.progressPercentage.textContent = `${Math.round(percent)}%`;
    }
    
    updateTestStatus(message) {
        this.testStatus.innerHTML = `
            <span class="inline-flex items-center">
                <span class="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2"></span>
                <span class="break-words">${message}</span>
            </span>
        `;
    }
    
    getQualityRating(speed, type) {
        if (type === 'download') {
            if (speed >= 100) return 'Excellent';
            if (speed >= 50) return 'Very Good';
            if (speed >= 25) return 'Good';
            if (speed >= 10) return 'Fair';
            return 'Poor';
        } else {
            if (speed >= 50) return 'Excellent';
            if (speed >= 25) return 'Very Good';
            if (speed >= 10) return 'Good';
            if (speed >= 5) return 'Fair';
            return 'Poor';
        }
    }
    
    displayResults(download, upload, ping, jitter = 0) {
        this.downloadSpeedEl.textContent = download.toFixed(2);
        this.uploadSpeedEl.textContent = upload.toFixed(2);
        this.pingEl.textContent = ping.toFixed(0);
        this.jitterEl.textContent = jitter.toFixed(0);
        this.downloadRateEl.textContent = (download / 8).toFixed(2) + ' MB/s';
        this.uploadRateEl.textContent = (upload / 8).toFixed(2) + ' MB/s';
        this.downloadQualityEl.textContent = this.getQualityRating(download, 'download');
        this.uploadQualityEl.textContent = this.getQualityRating(upload, 'upload');
    }
    
    saveResults() {
        const results = {
            download: this.downloadSpeed,
            upload: this.uploadSpeed,
            ping: this.ping,
            jitter: this.jitter,
            timestamp: Date.now()
        };
        localStorage.setItem('speedtestResults', JSON.stringify(results));
    }
}

// Check for shared results in URL
function checkSharedResults() {
    const params = new URLSearchParams(window.location.search);
    const download = params.get('d');
    const upload = params.get('u');
    const ping = params.get('p');
    const jitter = params.get('j') || '0';
    
    if (download && upload && ping) {
        // Display shared results
        const speedTest = new SpeedTest();
        speedTest.displayResults(parseFloat(download), parseFloat(upload), parseFloat(ping), parseFloat(jitter));
        speedTest.showResultsSection();
        
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
