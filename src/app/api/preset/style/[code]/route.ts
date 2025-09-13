import { WCI_TEMPLATE_STYLE_CODE } from '@Shared/constants/template/wciTemplate';
import { NextRequest, NextResponse } from 'next/server';

type ParamsRequest = {
  params: Promise<{ code: string }>;
};

export async function GET(request: NextRequest, { params }: ParamsRequest) {
  const { code } = await params;
  try {
    const fileUrl = new URL(WCI_TEMPLATE_STYLE_CODE(code)[code], request.url);
    const res = await fetch(fileUrl, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: 'Cannot load preset' }, { status: res.status });
    const text = await res.text();
    return NextResponse.json({ css: text }, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Cannot load preset' }, { status: 404 });
  }
}
