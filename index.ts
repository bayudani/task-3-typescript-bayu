import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Fungsi untuk menulis log
async function writeLog(message: string): Promise<void> {
    const now = new Date();
    const logFileName = `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMonth() + 1}_${now.getDate()}_${now.getFullYear()}.log`;
    await fs.appendFile(logFileName, `${message}\n`);
}

// Fungsi enkripsi
async function encryptFile(filePath: string, password: string): Promise<void> {
    try {
        await writeLog(`Mulai mengenkripsi file ${filePath}`);

        // Baca file
        const text = await fs.readFile(filePath, 'utf8');
        
        // Proses enkripsi
        const algorithm = 'aes-192-cbc';
        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Gabungkan IV dengan hasil enkripsi
        const result = iv.toString('hex') + ':' + encrypted;
        
        // Tulis ke file baru
        const encryptedFilePath = filePath.replace('.txt', '_encrypted.txt');
        await fs.writeFile(encryptedFilePath, result);

        await writeLog(`Berhasil mengenkripsi file ${filePath}`);
        console.log(`File '${path.basename(filePath)}' berhasil dienkripsi menjadi '${path.basename(encryptedFilePath)}'`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await writeLog(`Error ketika mengenkripsi file: ${errorMessage}`);
        throw error;
    }
}

// Fungsi dekripsi
async function decryptFile(filePath: string, password: string): Promise<void> {
    try {
        await writeLog(`Mulai mendekripsi file ${filePath}`);

        // Baca file terenkripsi
        const encryptedText = await fs.readFile(filePath, 'utf8');
        
        // Proses dekripsi
        const algorithm = 'aes-192-cbc';
        const key = crypto.scryptSync(password, 'salt', 24);

        const parts = encryptedText.split(':');
        const iv = Buffer.from(parts.shift()!, 'hex');
        const encrypted = parts.join(':');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // Tulis hasil dekripsi ke file baru
        const decryptedFilePath = filePath.replace('_encrypted.txt', '.txt');
        await fs.writeFile(decryptedFilePath, decrypted);

        await writeLog(`Berhasil mendekripsi file ${filePath}`);
        console.log(`File '${path.basename(filePath)}' berhasil didekripsi menjadi '${path.basename(decryptedFilePath)}'`);
    } catch (error) {
        const errorMessage = 'Password yang dimasukkan salah';
        await writeLog(`Error ketika mendekripsi file: ${errorMessage}`);
        throw new Error(errorMessage);
    }
}

// Main function
async function main() {
    const [,, command, filePath, password] = process.argv;
    
    if (!command || !filePath || !password) {
        console.error('Usage: ts-node index.ts <encrypt|decrypt> <filePath> <password>');
        process.exit(1);
    }

    try {
        if (command === 'encrypt') {
            await encryptFile(filePath, password);
        } else if (command === 'decrypt') {
            await decryptFile(filePath, password);
        } else {
            console.error('Invalid command. Use "encrypt" or "decrypt"');
            process.exit(1);
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'An unknown error occurred');
        process.exit(1);
    }
}

main();