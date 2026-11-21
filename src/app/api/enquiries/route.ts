import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

// GET all enquiries for Admin (bypasses RLS)
export async function GET() {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiries: data || [] });
  } catch (err) {
    console.error('Unexpected error fetching enquiries:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new enquiry from user (bypasses RLS)
export async function POST(request: Request) {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      enquiry_type,
      name,
      phone,
      email,
      interest,
      pickup_location,
      drop_location,
      move_date,
      household_size,
      message,
      property_id,
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          enquiry_type: enquiry_type || 'general',
          name,
          phone,
          email: email || null,
          interest: interest || null,
          pickup_location: pickup_location || null,
          drop_location: drop_location || null,
          move_date: move_date || null,
          household_size: household_size || null,
          message: message || '',
          property_id: property_id || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting enquiry:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiry: data });
  } catch (err) {
    console.error('Unexpected error inserting enquiry:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH enquiry status (bypasses RLS)
export async function PATCH(request: Request) {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Enquiry ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating enquiry status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err) {
    console.error('Unexpected error updating enquiry:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE enquiry (bypasses RLS)
export async function DELETE(request: Request) {
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service client not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deleting enquiry:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (err) {
    console.error('Unexpected error deleting enquiry:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
