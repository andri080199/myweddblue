import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const banksPath = path.join(process.cwd(), 'public/images/banks');
    const files = await readdir(banksPath);
    const logos = files
      .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
      .map(file => ({
        name: file.replace(/\.(png|jpg|jpeg)$/, ''),
        path: `/images/banks/${file}`,
        fileName: file
      }));

    return NextResponse.json(logos);
  } catch (error) {
    console.error('Error reading bank logos:', error);
    return NextResponse.json({ error: 'Failed to read bank logos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bankName = formData.get('bankName') as string;

    if (!file || !bankName) {
      return NextResponse.json({ error: 'File dan nama bank diperlukan' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File harus berupa gambar' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename: bankname.extension
    const extension = file.name.split('.').pop();
    const fileName = `${bankName.toLowerCase()}.${extension}`;
    const filePath = path.join(process.cwd(), 'public/images/banks', fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      message: 'Logo bank berhasil diupload',
      fileName,
      path: `/images/banks/${fileName}`
    });
  } catch (error) {
    console.error('Error uploading bank logo:', error);
    return NextResponse.json({ error: 'Gagal upload logo bank' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: 'Nama file diperlukan' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public/images/banks', fileName);

    await unlink(filePath);

    return NextResponse.json({
      message: 'Logo berhasil dihapus',
      fileName
    });
  } catch (error) {
    console.error('Error deleting bank logo:', error);
    return NextResponse.json({ error: 'Gagal menghapus logo' }, { status: 500 });
  }
}