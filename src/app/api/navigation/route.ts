import { PRESETS_MOCK } from "@Shared/constants";
import { PresetResponseType } from "@Shared/types";

export async function GET(request: Request) {
  const  { searchParams } = new URL(request.url);
  const type = searchParams.get('type')?.toString() ?? '';
  const navigations: PresetResponseType = { data: PRESETS_MOCK, type };
  return new Response(JSON.stringify(navigations), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
