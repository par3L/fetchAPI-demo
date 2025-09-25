// API HANDLER - MAHASISWA DATABASE INTEGRATION
// frontend dengan backend API

// --- CONFIG API ---
const API_BASE_URL = 'https://aeromarine-miki-nonsynonymously.ngrok-free.dev'; // ini url API (alamat server backend)
const API_KEY = 'webProgrammingAPIKEY2025'; // api key untuk akses server (sesuai dengan server backend)
const API_ENDPOINTS = { // kumpulan alamat endpoint untuk berbagai operasi CRUD
    getAllMahasiswa: `${API_BASE_URL}/mahasiswa`, // alamat untuk ambil semua data mahasiswa
    createMahasiswa: `${API_BASE_URL}/mahasiswa`, // alamat untuk bikin data mahasiswa baru
    deleteMahasiswa: (id) => `${API_BASE_URL}/mahasiswa/${id}` // alamat untuk hapus mahasiswa berdasarkan id
};

// --- FUNCTIONS ---

// fungsi untuk menampilkan loading state (sedang memuat)
function showLoading(show = true) {
    const submitBtn = document.querySelector('button[type="submit"]'); // cari tombol submit
    const tableBody = document.getElementById('mahasiswaTableBody'); // cari body tabel
    
    if (show) { // kalau mau tampilkan loading
        submitBtn.textContent = 'Menyimpan...'; // ganti teks tombol
        submitBtn.disabled = true; // nonaktifkan tombol biar ga bisa diklik
        
        // tampilkan loading di tabel
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <div class="loading">Loading data...</div>
                </td>
            </tr>
        `;
    } else { // kalau mau sembunyikan loading
        submitBtn.textContent = 'Simpan Data'; // kembalikan teks tombol normal
        submitBtn.disabled = false; // aktifkan kembali tombol
    }
}

// fungsi untuk menampilkan pesan error (kesalahan)
function showError(message) {
    showNotification(`${message}`, 'error'); // tampilkan notifikasi error merah
    console.error('API Error:', message); // catat error di console browser
}

// fungsi untuk menampilkan pesan sukses (berhasil)
function showSuccess(message) {
    showNotification(`${message}`, 'success'); // tampilkan notifikasi sukses hijau
}

// fungsi untuk menampilkan pesan peringatan
function showWarning(message) {
    showNotification(`${message}`, 'warning'); // tampilkan notifikasi peringatan kuning
}

// --- API FUNCTIONS ---

// GET - fungsi untuk mengambil semua data mahasiswa dari database
async function fetchMahasiswa() { // async = fungsi yang bisa menunggu (asynchronous)
    try { // coba jalankan kode di dalam try
        showLoading(true); // tampilkan loading
        
        // kirim permintaan GET ke server
        const response = await fetch(API_ENDPOINTS.getAllMahasiswa, { // await = tunggu sampai selesai
            method: 'GET', // metode HTTP untuk mengambil data
            headers: { // header untuk memberikan info tambahan ke server
                'Content-Type': 'application/json', // kasih tau server kita kirim data JSON
                'ngrok-skip-browser-warning': 'true', // skip peringatan ngrok
                'x-api-key': API_KEY // tambahkan api key untuk akses server
            }
        });

        // cek apakah response berhasil (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // lempar error jika gagal
        }

        const mahasiswaData = await response.json(); // convert response jadi JSON
        console.log('Data mahasiswa berhasil diambil:', mahasiswaData); // log ke console
        
        // masukkan data ke tabel HTML
        renderMahasiswaTable(mahasiswaData);
        
        return mahasiswaData; // kembalikan data
        
    } catch (error) { // kalau ada error, jalankan kode ini
        console.error('Error fetching mahasiswa:', error); // log error
        showError('Gagal mengambil data dari server. Pastikan server API berjalan!'); // tampilkan pesan error
        
        // tampilkan pesan error di tabel
        const tableBody = document.getElementById('mahasiswaTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #dc3545;">
                    <div class="error-message">
                        <br>
                        <strong>Tidak dapat terhubung ke server</strong><br>
                        <small>Pastikan server API sedang berjalan</small>
                    </div>
                </td>
            </tr>
        `;
    } finally { // kode ini selalu dijalankan, error atau tidak
        showLoading(false); // sembunyikan loading
    }
}

// POST - fungsi untuk menambahkan data mahasiswa baru ke database
async function createMahasiswa(mahasiswaData) {
    try {
        
        showLoading(true); // tampilkan loading
        // kirim permintaan POST ke server dengan data mahasiswa
        const response = await fetch(API_ENDPOINTS.createMahasiswa, {
            method: 'POST', // metode POST untuk mengirim data baru
            headers: {
                'Content-Type': 'application/json', // format data yang dikirim
                'ngrok-skip-browser-warning': 'true',
                'x-api-key': API_KEY // skip peringatan ngrok, saia pake yang free (hobbyist)  
            },
            body: JSON.stringify(mahasiswaData) // convert data jadi string JSON untuk dikirim
        });

        const result = await response.json(); // convert response jadi JSON

        // cek berbagai kemungkinan error dari server
        if (!response.ok) {
            // handle error cases
            if (response.status === 409) { // status 409 = conflict (data sudah ada)
                throw new Error('NIM sudah terdaftar! Gunakan NIM yang berbeda.');
            } else if (response.status === 400) { // status 400 = bad request (data tidak valid)
                throw new Error('Data tidak lengkap! Semua field harus diisi.');
            } else {
                throw new Error(result.message || 'Gagal menyimpan data'); // error lainnya
            }
        }

        console.log('Data mahasiswa berhasil dibuat:', result); // log sukses
        showSuccess(`Data mahasiswa berhasil ditambahkan! ID: ${result.id}`); // tampilkan pesan sukses
        
        // refresh data tabel setelah berhasil menambah
        await fetchMahasiswa(); // ambil ulang data terbaru dari server
        
        return result; // kembalikan hasil
        
    } catch (error) { // tangani error
        console.error('Error creating mahasiswa:', error);
        showError(error.message); // tampilkan pesan error
        throw error; // re-throw untuk handling di form (lempar error lagi ke pemanggil)
    } finally {
        showLoading(false); // sembunyikan loading
    }
}// DELETE - fungsi untuk menghapus data mahasiswa dari database
async function deleteMahasiswaAPI(id) {
    try {
        // kirim permintaan DELETE ke server
        const response = await fetch(API_ENDPOINTS.deleteMahasiswa(id), { // panggil function dengan parameter id
            method: 'DELETE', // metode DELETE untuk hapus data
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'x-api-key': API_KEY // tambahkan api key untuk akses server
            }
        });

        const result = await response.json();

        // cek berbagai kemungkinan error
        if (!response.ok) {
            // handle error cases
            if (response.status === 404) { // status 404 = not found (data tidak ditemukan)
                throw new Error('Data mahasiswa tidak ditemukan.');
            } else if (response.status === 400) { // status 400 = bad request (id tidak valid)
                throw new Error('ID tidak valid.');
            } else {
                throw new Error(result.message || 'Gagal menghapus data');
            }
        }

        console.log('Data mahasiswa berhasil dihapus:', result);
        showSuccess(`Data mahasiswa berhasil dihapus!`);
        
        // refresh data tabel setelah berhasil menghapus
        await fetchMahasiswa(); // ambil ulang data terbaru
        
        return result;
        
    } catch (error) {
        console.error('Error deleting mahasiswa:', error);
        showError(error.message);
        throw error; // lempar error ke pemanggil
    }
}

// --- DOM MANIPULATION ---

// fungsi untuk menampilkan data mahasiswa ke dalam tabel HTML
function renderMahasiswaTable(mahasiswaData) {
    const tableBody = document.getElementById('mahasiswaTableBody'); // cari elemen tbody
    
    // cek jika tidak ada data atau array kosong
    if (!mahasiswaData || mahasiswaData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    <div class="empty-state">
                        <br>
                        <strong>Belum ada data mahasiswa</strong><br>
                        <small>Tambahkan data mahasiswa pertama Anda!</small>
                    </div>
                </td>
            </tr>
        `;
        return; // keluar dari function
    }

    // buat HTML untuk setiap data mahasiswa menggunakan map
    tableBody.innerHTML = mahasiswaData.map(mahasiswa => `
        <tr data-id="${mahasiswa.id}" class="table-row">
            <td>${mahasiswa.nim}</td>
            <td>${mahasiswa.nama}</td>
            <td>${mahasiswa.jurusan}</td>
            <td>
                <button class="action-btn edit-btn" style="background-color: #28a745;" 
                        onclick="editMahasiswa(${mahasiswa.id}, '${mahasiswa.nim}', '${mahasiswa.nama}', '${mahasiswa.jurusan}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" style="background-color: #dc3545;" 
                        onclick="deleteMahasiswa(${mahasiswa.id}, '${mahasiswa.nama}')">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
    `).join(''); // join('') untuk gabungkan array jadi string

    // tambahkan efek hover ke setiap baris tabel
    const rows = document.querySelectorAll('.table-row'); // cari semua baris
    rows.forEach(row => { // untuk setiap baris
        // event saat mouse masuk ke baris
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = isDarkMode ? 'rgba(255, 215, 0, 0.1)' : '#eef5ff'; // ganti warna sesuai tema
            this.style.transform = 'scale(1.02)'; // perbesar sedikit
        });
        
        // event saat mouse keluar dari baris
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = ''; // kembalikan warna asli
            this.style.transform = 'scale(1)'; // kembalikan ukuran normal
        });
    });
}

// --- EVENT HANDLERS ---

// fungsi untuk menangani submit form (saat tombol simpan diklik)
async function handleFormSubmit(event) {
    event.preventDefault(); // mencegah form reload halaman (behavior default)
    
    // ambil data dari form input
    const formData = {
        nim: document.getElementById('nim').value.trim(), // trim() = hapus spasi di awal/akhir
        nama: document.getElementById('nama').value.trim(),
        jurusan: document.getElementById('jurusan').value.trim()
    };

    // validasi client-side (cek di frontend sebelum kirim ke server)
    if (!formData.nim || !formData.nama || !formData.jurusan) {
        showError('Semua field harus diisi!');
        return; // keluar dari function jika ada field kosong
    }

    try {
        // kirim data ke API
        await createMahasiswa(formData);
        
        // reset form jika berhasil (kosongkan semua input)
        document.getElementById('mahasiswaForm').reset();
        
    } catch (error) {
        // error sudah ditangani di createMahasiswa function
        console.log('Form submission failed:', error.message);
    }
}

// placeholder untuk fitur edit (belum diimplementasi)
function editMahasiswa(id, nim, nama, jurusan) {
    showNotification('Fitur edit sedang dalam pengembangan!', 'info'); // tampilkan pesan info
    console.log('Edit mahasiswa:', { id, nim, nama, jurusan }); // log data yang akan diedit
}

// --- INISIASI ---

// inisiasi API integration saat DOM sudah loaded (halaman sudah siap)
document.addEventListener('DOMContentLoaded', function() { // DOMContentLoaded = event saat HTML sudah dimuat
    console.log('API Handler loaded - connecting to:', API_BASE_URL); // log info koneksi
    
    // bind form ke submit event (hubungkan form dengan function handleFormSubmit)
    const form = document.getElementById('mahasiswaForm'); // cari form
    if (form) { // jika form ditemukan
        form.removeEventListener('submit', handleFormSubmit); // hapus event listener lama (jika ada)
        form.addEventListener('submit', handleFormSubmit); // tambah event listener baru
    }
    
    // ambil data mahasiswa saat pertama kali load
    fetchMahasiswa();
    
    // tampilkan indikator bahwa sedang mencoba koneksi
    showNotification('Menghubungkan ke database...', 'info');
});

// --- API CONNECTION TEST ---

// fungsi untuk test koneksi ke API server
async function testAPIConnection() {
    try {
        // kirim permintaan sederhana ke server untuk test koneksi
        const response = await fetch(API_ENDPOINTS.getAllMahasiswa, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // skip peringatan ngrok
                'x-api-key': API_KEY // tambahkan api key untuk akses server
            }
        });
        if (response.ok) { // jika response berhasil (status 200-299)
            showSuccess('Koneksi ke API berhasil!');
            return true; // kembalikan true jika berhasil
        } else {
            throw new Error('API tidak merespons dengan benar');
        }
    } catch (error) {
        showError('Tidak dapat terhubung ke API. Pastikan server berjalan di localhost:3000');
        return false; // kembalikan false jika gagal
    }
}

// export functions untuk testing (opsional, untuk environment Node.js)
if (typeof module !== 'undefined' && module.exports) { // cek jika sedang di environment Node.js
    module.exports = { // export function supaya bisa diimport di file lain
        fetchMahasiswa,
        createMahasiswa,
        deleteMahasiswaAPI,
        testAPIConnection
    };
}

console.log('API Handler berhasil dimuat!'); // log bahwa file sudah loaded