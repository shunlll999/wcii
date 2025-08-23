import { PRESETS_MOCK, PRESETS_MOCK_EXTRA, PRESETS_MOCK_FORM } from "@Shared/constants";
import { PresetResponseType } from "@Shared/types";

export async function GET(request: Request) {
  const  { searchParams } = new URL(request.url);
  const type = searchParams.get('type')?.toString() ?? '';
  const navigations: PresetResponseType = { data: {
    basic: { seq: 1, data: PRESETS_MOCK },
    form: { seq: 2, data: PRESETS_MOCK_FORM },
    extra: { seq: 3, data: PRESETS_MOCK_EXTRA },
  }, type };
  return new Response(JSON.stringify(navigations), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;
  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
