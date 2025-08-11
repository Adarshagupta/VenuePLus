import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { smartBookingAgent, BookingRequest } from '@/lib/booking-agent';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      preferences
    } = body;

    // Validate required fields
    if (!type || !destination || !startDate || !travelers) {
      return NextResponse.json(
        { error: 'Missing required fields: type, destination, startDate, travelers' },
        { status: 400 }
      );
    }

    const bookingRequest: BookingRequest = {
      type,
      destination,
      startDate,
      endDate,
      travelers: parseInt(travelers),
      budget,
      preferences: preferences || {}
    };

    // Get smart booking options using AI
    const bookingResults = await smartBookingAgent.findBestBookingOptions(bookingRequest);

    return NextResponse.json({
      success: true,
      results: bookingResults,
      searchId: `search_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in smart booking search:', error);
    return NextResponse.json(
      { error: 'Failed to search booking options' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const destination = searchParams.get('destination');
    const type = searchParams.get('type');

    if (!query && !destination) {
      return NextResponse.json(
        { error: 'Either query or destination parameter is required' },
        { status: 400 }
      );
    }

    // Quick search functionality
    const quickResults = await smartBookingAgent.findBestBookingOptions({
      type: (type as any) || 'package',
      destination: destination || query || '',
      startDate: new Date().toISOString(),
      travelers: 2,
      budget: 'mid-range'
    });

    return NextResponse.json({
      success: true,
      results: quickResults,
      query: query || destination,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in quick booking search:', error);
    return NextResponse.json(
      { error: 'Failed to perform quick search' },
      { status: 500 }
    );
  }
}
