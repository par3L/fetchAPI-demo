// DOM MANIPULATION & EVENT HANDLING - DARK MODE TOGGLE
// file ini untuk mengatur ganti tema gelap/terang di website

// 1. DOM ELEMENT SELECTION (cari elemen HTML yang mau dipakai)
const themeToggleBtn = document.getElementById('themeToggle'); // cari tombol toggle tema
const themeIcon = document.querySelector('.theme-icon'); // cari ikon di dalam tombol
const themeText = document.querySelector('.theme-text'); // cari teks di dalam tombol
const headerTitle = document.getElementById('headerTitle'); // cari judul header
const modeStatus = document.getElementById('modeStatus'); // cari status mode di footer
const body = document.body; // ambil elemen body (seluruh halaman)

// 2. VARIABEL STATE (menyimpan kondisi saat ini)
let isDarkMode = false; // variabel untuk ingat apakah lagi mode gelap atau terang

// 3. EVENT HANDLING - menangani klik tombol toggle
themeToggleBtn.addEventListener('click', function() { // addEventListener = kasih tahu browser kalau tombol diklik jalankan function ini
    console.log('Theme toggle button clicked!'); // catat ke console untuk debug
    
    // toggle state (balik kondisi: kalau true jadi false, kalau false jadi true)
    isDarkMode = !isDarkMode; // tanda ! artinya kebalikan
    
    // panggil function-function untuk update tampilan
    toggleDarkMode(); // ganti class CSS
    updateToggleButton(); // update tampilan tombol
    updateModeStatus(); // update status di footer
    addClickAnimation(); // kasih efek animasi
    
    // simpan pilihan user ke local storage browser
    localStorage.setItem('darkModeEnabled', isDarkMode); // localStorage = penyimpanan di browser
});

// 4. FUNCTION-FUNCTION UNTUK MANIPULASI DOM

// function untuk ganti tema (tambah/hapus class CSS)
function toggleDarkMode() {
    if (isDarkMode) { // kalau mode gelap aktif
        body.classList.add('dark-theme'); // tambah class "dark-theme" ke body
        console.log('Dark mode activated'); // catat ke console
    } else { // kalau mode terang aktif
        body.classList.remove('dark-theme'); // hapus class "dark-theme" dari body
        console.log('Light mode activated'); // catat ke console
    }
}

// function untuk update tampilan tombol toggle
function updateToggleButton() {
    if (isDarkMode) { // kalau mode gelap
        themeIcon.innerHTML = '<i class="fas fa-sun"></i>'; // ganti ikon jadi matahari
        themeText.textContent = 'Light Mode'; // ganti teks jadi "Light Mode"
        themeToggleBtn.style.backgroundColor = '#ffd700'; // warna latar kuning
        themeToggleBtn.style.color = '#333'; // warna teks gelap
    } else { // kalau mode terang
        themeIcon.innerHTML = '<i class="fas fa-moon"></i>'; // ganti ikon jadi bulan
        themeText.textContent = 'Dark Mode'; // ganti teks jadi "Dark Mode"
        themeToggleBtn.style.backgroundColor = '#333745'; // warna latar gelap
        themeToggleBtn.style.color = 'white'; // warna teks putih
    }
}

// function untuk update status mode di footer
function updateModeStatus() {
    // tentukan teks status berdasarkan mode saat ini
    const currentMode = isDarkMode ? 'Dark Mode' : 'Light Mode'; // ternary operator (if singkat)
    modeStatus.textContent = `Mode Saat Ini: ${currentMode}`; // template literal dengan ${}
    
    // ganti warna status sesuai tema
    modeStatus.style.color = isDarkMode ? '#ffd700' : '#4a90e2'; // kuning kalau gelap, biru kalau terang
}

// function untuk kasih efek animasi saat tombol diklik
function addClickAnimation() {
    themeToggleBtn.classList.add('clicked'); // tambah class "clicked" untuk animasi CSS
    
    // hapus class "clicked" setelah 200ms (0.2 detik)
    setTimeout(() => { // setTimeout = jalankan setelah waktu tertentu
        themeToggleBtn.classList.remove('clicked');
    }, 200); // 200 milliseconds
}

// 5. EVENT HANDLING - saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() { // DOMContentLoaded = event saat HTML sudah siap
    console.log('Page loaded, initializing theme...'); // catat bahwa halaman sudah load
    
    // ambil pilihan tema yang tersimpan di browser
    const savedTheme = localStorage.getItem('darkModeEnabled'); // ambil dari local storage
    if (savedTheme === 'true') { // kalau ada dan nilainya 'true' (string)
        isDarkMode = true; // set variabel jadi true
        toggleDarkMode(); // aktifkan dark mode
        updateToggleButton(); // update tampilan tombol
        updateModeStatus(); // update status
    }
    
    // kasih animasi muncul untuk tombol toggle
    themeToggleBtn.style.opacity = '0'; // mulai dari transparan
    themeToggleBtn.style.transform = 'translateY(-20px)'; // mulai dari atas 20px
    
    // setelah 500ms, animasikan masuk
    setTimeout(() => {
        themeToggleBtn.style.transition = 'all 0.3s ease'; // kasih transisi halus
        themeToggleBtn.style.opacity = '1'; // jadi terlihat
        themeToggleBtn.style.transform = 'translateY(0)'; // pindah ke posisi normal
    }, 500); // tunggu 0.5 detik
});

// 6. EVENT HANDLING - shortcut keyboard (fitur bonus)
document.addEventListener('keydown', function(event) { // keydown = event saat tombol keyboard ditekan
    // cek apakah user tekan Ctrl + D
    if (event.ctrlKey && event.key === 'd') { // ctrlKey = apakah Ctrl ditekan, key = tombol apa
        event.preventDefault(); // cegah aksi default browser (bookmark di Chrome)
        console.log('Keyboard shortcut activated!'); // catat ke console
        
        // simulasi klik tombol toggle
        themeToggleBtn.click(); // panggil event click secara programmatic
    }
});

// 7. EVENT HANDLING - double click (fitur bonus)
themeToggleBtn.addEventListener('dblclick', function() { // dblclick = double click/klik dua kali
    // tampilkan notifikasi khusus untuk double click
    showNotification('Double click detected! Theme toggled twice!');
});

// 8. FUNCTION UNTUK BIKIN DAN TAMPILKAN NOTIFIKASI POP-UP
function showNotification(message) {
    // buat elemen div baru untuk notifikasi
    const notification = document.createElement('div'); // createElement = bikin elemen HTML baru
    notification.className = 'notification'; // kasih nama class CSS
    notification.textContent = message; // isi dengan pesan
    
    // atur gaya CSS notifikasi pakai JavaScript
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${isDarkMode ? '#ffd700' : '#4a90e2'};
        color: ${isDarkMode ? '#333' : 'white'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `; // cssText = cara set banyak CSS sekaligus
    
    // tambahkan notifikasi ke halaman
    document.body.appendChild(notification); // appendChild = tambahkan anak ke elemen
    
    // animasi masuk setelah 100ms
    setTimeout(() => {
        notification.style.transform = 'translateX(0)'; // geser ke posisi normal
    }, 100);
    
    // hapus notifikasi setelah 2 detik
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)'; // geser keluar
        setTimeout(() => { // hapus dari DOM setelah animasi selesai
            if (notification.parentNode) { // cek apakah masih punya parent
                document.body.removeChild(notification); // hapus dari body
            }
        }, 300); // tunggu animasi selesai
    }, 2000); // tampil selama 2 detik
}

// 9. AMBIL SEMUA INPUT TEXT UNTUK KASIH EFEK FOCUS
const inputs = document.querySelectorAll('input[type="text"]'); // querySelectorAll = cari semua elemen yang cocok

// catatan: form submit handler dipindahkan ke handleAPI.js untuk integrasi database

// 10. EVENT HANDLING - efek glow saat input difocus
inputs.forEach(input => { // forEach = jalankan function untuk setiap elemen
    // event saat input diklik/difocus
    input.addEventListener('focus', function() { // focus = saat input aktif/diklik
        // kasih efek glow sesuai tema
        if (isDarkMode) {
            this.style.boxShadow = '0 0 10px #ffd700'; // bayangan kuning untuk dark mode
        } else {
            this.style.boxShadow = '0 0 10px #4a90e2'; // bayangan biru untuk light mode
        }
    });
    
    // event saat input kehilangan focus
    input.addEventListener('blur', function() { // blur = saat input tidak aktif lagi
        this.style.boxShadow = 'none'; // hilangkan efek glow
    });
});

console.log('🚀 Dark Mode Toggle dengan DOM Manipulation & Event Handling berhasil dimuat dari script.js!');