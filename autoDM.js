const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk mengajukan pertanyaan dan mendapatkan input dari user
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Set headless ke true jika ingin menjalankan tanpa GUI
    const page = await browser.newPage();

    // Masukkan URL Instagram
    await page.goto('https://www.instagram.com/accounts/login/');

    // Tunggu sampai elemen username muncul dan isi form login
    await page.waitForSelector('input[name="username"]');
    const username = await askQuestion('Masukkan username Instagram Anda: ');
    const password = await askQuestion('Masukkan password Instagram Anda: ');

    await page.type('input[name="username"]', username, { delay: 100 });
    await page.type('input[name="password"]', password, { delay: 100 });

    // Klik tombol login
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Mengambil nama pengguna penerima dan pesan dari pengguna
    const recipient = await askQuestion('Masukkan username penerima DM: ');
    const message = await askQuestion('Masukkan pesan yang ingin dikirim: ');

    // Setelah login, navigasi ke profil user yang ingin dikirimi DM
    await page.goto(`https://www.instagram.com/${recipient}/`);

    // Klik tombol DM
    await page.click('button[aria-label="Direct"]');
    await page.waitForTimeout(2000); // Tunggu sebentar

    // Ketikkan pesan
    await page.waitForSelector('textarea[aria-label="Message..."]');
    await page.type('textarea[aria-label="Message..."]', message, { delay: 100 });

    // Kirim pesan
    await page.click('button[type="submit"]');
    
    console.log('Pesan berhasil dikirim!');

    // Tutup browser
    await browser.close();
    rl.close();
})();
