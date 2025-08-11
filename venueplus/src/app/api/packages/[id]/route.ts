import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = params.id

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    // Fetch package from database
    const packageData = await prisma.package.findUnique({
      where: {
        id: packageId,
        isActive: true,
      },
    })

    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Transform database package to frontend format
    const transformedPackage = {
      id: packageData.id,
      name: packageData.name,
      description: packageData.description,
      price: packageData.price,
      originalPrice: packageData.originalPrice,
      duration: packageData.duration,
      destination: packageData.destination,
      provider: packageData.provider,
      rating: packageData.rating,
      reviews: packageData.reviews,
      currency: packageData.currency,
      images: packageData.images,
      highlights: packageData.highlights,
      inclusions: packageData.inclusions,
      exclusions: packageData.exclusions,
      category: packageData.category,
      tags: packageData.tags,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt,
    }

    return NextResponse.json(transformedPackage)

  } catch (error: any) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
