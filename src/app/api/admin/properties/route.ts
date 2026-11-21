import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// GET all properties for Admin (bypasses RLS)
export async function GET() {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin properties:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, properties: data || [] });
  } catch (err) {
    console.error('Unexpected error fetching admin properties:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a property by id or property_code (bypasses RLS)
export async function DELETE(request: Request) {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    let query = supabase.from('properties').delete();
    if (isUuid(id)) {
      query = query.eq('id', id);
    } else {
      query = query.eq('property_code', id);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (err) {
    console.error('Unexpected error deleting property:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH update property status or details (bypasses RLS)
export async function PATCH(request: Request) {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const payload = updates || (status ? { status, updated_at: new Date().toISOString() } : {});

    let query = supabase.from('properties').update(payload);
    if (isUuid(id)) {
      query = query.eq('id', id);
    } else {
      query = query.eq('property_code', id);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err) {
    console.error('Unexpected error updating property:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
