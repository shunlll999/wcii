import { WCI_TEMPLATE_CODE } from '@Shared/constants/template/wciTemplate';
import { toPascalCase } from '@Shared/utils/allCapital';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const  { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toString() ?? '';
  const id = searchParams.get('id')?.toString() ?? 0;
  try {
    const fileUrl = new URL(WCI_TEMPLATE_CODE(code)[code], request.url);
    const res = await fetch(fileUrl, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: 'Cannot load preset' }, { status: res.status });
    const text = await res.text();
    const out = text
    .replaceAll('<%componentName%>', toPascalCase(code))
    return NextResponse.json({ code, template: out, id }, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Cannot load preset' }, { status: 404 });
  }
}
