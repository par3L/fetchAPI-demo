// API HANDLER - MAHASISWA DATABASE INTEGRATION
// frontend dengan backend API

// --- CONFIG API ---
const API_BASE_URL = 'https://aeromarine-miki-nonsynonymously.ngrok-free.dev'; // ini url API
const API_ENDPOINTS = { // endpointnya
    getAllMahasiswa: `${API_BASE_URL}/mahasiswa`,
    createMahasiswa: `${API_BASE_URL}/mahasiswa`,
    deleteMahasiswa: (id) => `${API_BASE_URL}/mahasiswa/${id}`
};

// --- FUNCTIONS ---

// menampilkan loading state
function showLoading(show = true) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const tableBody = document.getElementById('mahasiswaTableBody');
    
    if (show) {
        submitBtn.textContent = 'Menyimpan...';
        submitBtn.disabled = true;
        
        // tampilkan loading di tabel
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <div class="loading">Loading data...</div>
                </td>
            </tr>
        `;
    } else {
        submitBtn.textContent = 'Simpan Data';
        submitBtn.disabled = false;
    }
}

// menampilkan error message
function showError(message) {
    showNotification(`${message}`, 'error');
    console.error('API Error:', message);
}

// menampilkan success message
function showSuccess(message) {
    showNotification(`${message}`, 'success');
}

// menampilkan warning message
function showWarning(message) {
    showNotification(`${message}`, 'warning');
}

// --- API FUNCTIONS ---

// GET - mengambil semua data mahasiswa dari database
async function fetchMahasiswa() {
    try {
        showLoading(true);
        
        const response = await fetch(API_ENDPOINTS.getAllMahasiswa, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mahasiswaData = await response.json();
        console.log('Data mahasiswa berhasil diambil:', mahasiswaData);
        
        // put data ke tabel
        renderMahasiswaTable(mahasiswaData);
        
        return mahasiswaData;
        
    } catch (error) {
        console.error('Error fetching mahasiswa:', error);
        showError('Gagal mengambil data dari server. Pastikan server API berjalan!');
        
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
    } finally {
        showLoading(false);
    }
}

// POST - menambahkan data mahasiswa baru ke database
async function createMahasiswa(mahasiswaData) {
    try {
        
        showLoading(true);
        const response = await fetch(API_ENDPOINTS.createMahasiswa, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(mahasiswaData)
        });

        const result = await response.json();

        if (!response.ok) {
            // handle error cases
            if (response.status === 409) {
                throw new Error('NIM sudah terdaftar! Gunakan NIM yang berbeda.');
            } else if (response.status === 400) {
                throw new Error('Data tidak lengkap! Semua field harus diisi.');
            } else {
                throw new Error(result.message || 'Gagal menyimpan data');
            }
        }

        console.log('Data mahasiswa berhasil dibuat:', result);
        showSuccess(`Data mahasiswa berhasil ditambahkan! ID: ${result.id}`);
        
        // refresh data tabel setelah berhasil menambah
        await fetchMahasiswa();
        
        return result;
        
    } catch (error) {
        console.error('Error creating mahasiswa:', error);
        showError(error.message);
        throw error; // re-throw untuk handling di form
    } finally {
        showLoading(false);
    }
}

// DELETE - menghapus data mahasiswa dari database
async function deleteMahasiswaAPI(id) {
    try {
        const response = await fetch(API_ENDPOINTS.deleteMahasiswa(id), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });

        const result = await response.json();

        if (!response.ok) {
            // handle error cases
            if (response.status === 404) {
                throw new Error('Data mahasiswa tidak ditemukan.');
            } else if (response.status === 400) {
                throw new Error('ID tidak valid.');
            } else {
                throw new Error(result.message || 'Gagal menghapus data');
            }
        }

        console.log('Data mahasiswa berhasil dihapus:', result);
        showSuccess(`Data mahasiswa berhasil dihapus!`);
        
        // refresh data tabel setelah berhasil menghapus
        await fetchMahasiswa();
        
        return result;
        
    } catch (error) {
        console.error('Error deleting mahasiswa:', error);
        showError(error.message);
        throw error;
    }
}

// --- DOM MANIPULATION ---

// render data mahasiswa ke dalam tabel
function renderMahasiswaTable(mahasiswaData) {
    const tableBody = document.getElementById('mahasiswaTableBody');
    
    // jika tidak ada data
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
        return;
    }

    // render setiap data mahasiswa
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
    `).join('');

    // hover effects
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = isDarkMode ? 'rgba(255, 215, 0, 0.1)' : '#eef5ff';
            this.style.transform = 'scale(1.02)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = 'scale(1)';
        });
    });
}

// --- EVENT HANDLERS ---

// handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // ambil data dari form
    const formData = {
        nim: document.getElementById('nim').value.trim(),
        nama: document.getElementById('nama').value.trim(),
        jurusan: document.getElementById('jurusan').value.trim()
    };

    // validasi client-side
    if (!formData.nim || !formData.nama || !formData.jurusan) {
        showError('Semua field harus diisi!');
        return;
    }

    try {
        // kirim ke API
        await createMahasiswa(formData);
        
        // reset form jika berhasil
        document.getElementById('mahasiswaForm').reset();
        
    } catch (error) {
        // error ditangani di createMahasiswa function
        console.log('Form submission failed:', error.message);
    }
}

// placeholder untuk edit (ditambahkan nanti)
function editMahasiswa(id, nim, nama, jurusan) {
    showNotification('Fitur edit sedang dalam pengembangan!', 'info');
    console.log('Edit mahasiswa:', { id, nim, nama, jurusan });
}

// delete mahasiswa dengan konfirmasi
async function deleteMahasiswa(id, nama) {
    // konfirmasi sebelum menghapus
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus data mahasiswa "${nama}"?\n\nTindakan ini tidak dapat dibatalkan!`);
    
    if (!confirmDelete) {
        showWarning('Penghapusan data dibatalkan.');
        return;
    }

    try {
        // tampilkan loading pada button delete
        const deleteBtn = event.target.closest('.delete-btn');
        const originalContent = deleteBtn.innerHTML;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghapus...';
        deleteBtn.disabled = true;

        // panggil route delete
        await deleteMahasiswaAPI(id);
        
    } catch (error) {
        // error ditangani di deleteMahasiswaAPI function
        console.log('Delete failed:', error.message);
        
        // restore button state
        const deleteBtn = document.querySelector(`[onclick*="deleteMahasiswa(${id}"]`);
        if (deleteBtn) {
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Hapus';
            deleteBtn.disabled = false;
        }
    }
}

// --- INISIASI ---

// inisiasi API integration saat DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Handler loaded - connecting to:', API_BASE_URL);
    
    // bind form ke submit event
    const form = document.getElementById('mahasiswaForm');
    if (form) {
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // fetch data
    fetchMahasiswa();
    
    // indikator koneksi API
    showNotification('Menghubungkan ke database...', 'info');
});

// --- API CONNECTION TEST ---

// test koneksi API
async function testAPIConnection() {
    try {
        const response = await fetch(API_ENDPOINTS.getAllMahasiswa, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        if (response.ok) {
            showSuccess('Koneksi ke API berhasil!');
            return true;
        } else {
            throw new Error('API tidak merespons dengan benar');
        }
    } catch (error) {
        showError('Tidak dapat terhubung ke API. Pastikan server berjalan di localhost:3000');
        return false;
    }
}

// export functions untuk testing (opsional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchMahasiswa,
        createMahasiswa,
        deleteMahasiswaAPI,
        testAPIConnection
    };
}

console.log('<i class="fas fa-check-circle"></i> API Handler berhasil dimuat!');