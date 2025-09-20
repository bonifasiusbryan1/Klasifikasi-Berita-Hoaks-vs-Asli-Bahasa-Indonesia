function checkNews() {
    const text = document.getElementById('news-text').value;
    
    if (!text) {
        showNotification('Silakan masukkan teks berita terlebih dahulu', 'warning');
        return;
    }

    document.getElementById('result-content').innerHTML = `
        <div class="flex flex-col items-center justify-center py-8">
            <div class="w-16 h-16 border-4 border-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-300">Sedang menganalisis berita...</p>
        </div>
    `;

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayResult(data);
    })
    .catch(error => {
        document.getElementById('result-content').innerHTML = `
            <div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-xl p-6 mb-6 text-center">
                <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                <h3 class="text-xl font-bold text-red-300 mb-2">Terjadi Kesalahan</h3>
                <p class="text-red-200">${error.message || 'Gagal memproses permintaan'}</p>
            </div>
        `;
    });
}

function displayResult(data) {
    let resultHTML = '';
    
    if (data.error) {
        resultHTML = `
            <div class="bg-red-900 bg-opacity-50 border border-red-700 rounded-xl p-6 mb-6 text-center">
                <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                <h3 class="text-xl font-bold text-red-300 mb-2">Terjadi Kesalahan</h3>
                <p class="text-red-200">${data.error}</p>
            </div>
        `;
    } else {
        const confidencePercent = (data.confidence * 100).toFixed(2);
        
        if (data.prediction === 1) {
            resultHTML = `
                <div class="result-asli bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-6 mb-6">
                    <div class="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-green-400 text-4xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-green-300 mb-2">Berita Asli</h3>
                    <div class="w-full bg-gray-700 rounded-full h-4 mb-4">
                        <div class="bg-green-600 h-4 rounded-full" style="width: ${confidencePercent}%"></div>
                    </div>
                    <p class="text-green-300 mb-2">Tingkat kepercayaan: <span class="font-bold">${confidencePercent}%</span></p>
                    <p class="text-gray-300">Model kami mengindikasikan bahwa berita ini kemungkinan besar adalah asli.</p>
                </div>
            `;
        } else {
            resultHTML = `
                <div class="result-hoax bg-red-900 bg-opacity-30 border border-red-700 rounded-xl p-6 mb-6">
                    <div class="w-20 h-20 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-times-circle text-red-400 text-4xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-red-300 mb-2">Berita Hoax</h3>
                    <div class="w-full bg-gray-700 rounded-full h-4 mb-4">
                        <div class="bg-red-600 h-4 rounded-full" style="width: ${confidencePercent}%"></div>
                    </div>
                    <p class="text-red-300 mb-2">Tingkat kepercayaan: <span class="font-bold">${confidencePercent}%</span></p>
                    <p class="text-gray-300">Model kami mengindikasikan bahwa berita ini kemungkinan besar adalah hoax.</p>
                    <div class="mt-4 p-3 bg-red-800 bg-opacity-50 border border-red-700 rounded-lg">
                        <p class="text-red-200 flex items-start">
                            <i class="fas fa-exclamation-triangle mt-1 mr-2"></i>
                            <span>Hati-hati dalam menyebarkan informasi ini. Selalu verifikasi dari sumber terpercaya.</span>
                        </p>
                    </div>
                </div>
            `;
        }
    }
    
    document.getElementById('result-content').innerHTML = resultHTML;
}

function resetNews() {
    document.getElementById('news-text').value = '';
    
    document.getElementById('result-content').innerHTML = `
        <div class="placeholder-result">
            <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-newspaper text-gray-400 text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">Hasil Akan Tampil di Sini</h3>
            <p class="text-gray-400">Masukkan teks berita dan klik "Periksa Keaslian Berita" untuk memulai analisis</p>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transform transition-transform duration-300 ${
        type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
    }`;
    notification.textContent = message;
    notification.style.transform = 'translateX(100%)';
  
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('check-news-btn').addEventListener('click', checkNews);
    document.getElementById('reset-btn').addEventListener('click', resetNews);
    
    document.getElementById('news-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            checkNews();
        }
    });
});