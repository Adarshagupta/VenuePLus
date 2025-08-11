import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { geminiTravelAgent, AITravelRequest } from '@/lib/gemini-ai';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      destination,
      duration,
      startDate,
      endDate,
      travelers,
      rooms,
      fromCity,
      selectedCities,
      budget,
      interests,
      travelStyle,
      accommodation,
      transportation
    } = body;

    // Validate required fields
    if (!destination || !duration || !startDate || !travelers || !fromCity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare AI request
    const aiRequest: AITravelRequest = {
      destination,
      duration,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      travelers,
      rooms: rooms || [{ adults: 1, children: 0 }],
      fromCity,
      selectedCities: selectedCities || [destination],
      budget,
      interests: interests || [],
      travelStyle,
      accommodation,
      transportation
    };

    // Generate smart itinerary using Gemini AI
    const smartItinerary = await geminiTravelAgent.generateSmartItinerary(aiRequest);

    // Save the generated itinerary to database
    const savedItinerary = await prisma.trip.create({
      data: {
        name: `AI Trip to ${destination}`,
        destination,
        duration,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days later
        travelers,
        fromCity,
        userId: session.user.id,
        // Store the AI-generated data as JSON
        metadata: {
          smartItinerary,
          generatedBy: 'gemini-ai',
          generatedAt: new Date().toISOString(),
          preferences: {
            budget,
            interests,
            travelStyle,
            accommodation,
            transportation
          }
        }
      }
    });

    // Create trip stops for selected cities
    if (selectedCities && selectedCities.length > 0) {
      const tripStops = selectedCities.map((cityName: string, index: number) => ({
        tripId: savedItinerary.id,
        cityId: null, // We'll need to match with existing cities or create new ones
        orderIndex: index,
        // Add other stop details from AI itinerary
      }));

      // For now, we'll skip creating stops and handle this in a separate process
    }

    return NextResponse.json({
      success: true,
      itinerary: smartItinerary,
      tripId: savedItinerary.id,
      message: 'Smart itinerary generated successfully'
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
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
    const preferences = searchParams.get('preferences');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Use AI agent for intelligent search and recommendations
    const parsedPreferences = preferences ? JSON.parse(preferences) : {};
    const recommendations = await geminiTravelAgent.searchAndRecommend(query, parsedPreferences);

    return NextResponse.json({
      success: true,
      recommendations,
      query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in AI search:', error);
    return NextResponse.json(
      { error: 'Failed to search recommendations' },
      { status: 500 }
    );
  }
}
