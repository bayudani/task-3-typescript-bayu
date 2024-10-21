# Task 3 NodeJS, Async Function, ES Module, Error Handling

## Deskripsi tugas
membuat aplikasi NodeJS yang melakukan enkripsi dan
dekripsi file menggunakan modul Crypto dengan TypeScript. Aplikasi ini
juga harus menangani proses file system dan path file secara
asynchronous, dengan error handling yang baik.

## Fitur
1. Enkripsi File: Menerima path file dan menghasilkan file terenkripsi
dengan password.
2. Dekripsi File: Menerima file terenkripsi dan menghasilkan file asli.
3. Logging: Semua aktivitas dicatat ke file log.

## Perintah untuk mengeksekusi
- **Encrypt file**
   ```sh
   ts-node index.ts encrypt ./test.txt myPassword

- **Decrpyt file**
   ```sh
   ts-node index.ts decrypt ./test_encrypted.txt myPassword

- **Encrypt file menggunakan password yang tidak valid**
   ```sh
   ts-node index.ts decrypt ./test_encrypted.txt wrongPassword