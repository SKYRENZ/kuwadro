import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const cloudName = 'dglu7ft3w';
    const apiKey = '728196134471892';
    const apiSecret = '_9eMuhJ0-62qK1d6VchvhDTWmeA';

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = 'kuwadro';
    
    // Sort parameters alphabetically and sign them
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    // Prepare FormData for the Cloudinary API request
    const formData = new FormData();
    formData.append('file', image);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Cloudinary API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Cloudinary upload failed' }, { status: response.status });
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
