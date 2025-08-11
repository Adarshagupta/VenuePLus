import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const destination = searchParams.get('destination')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive',
      }
    }

    if (category) {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Fetch packages
    const packages = await prisma.package.findMany({
      where,
      orderBy: {
        rating: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const total = await prisma.package.count({ where })

    // Transform packages
    const transformedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      duration: pkg.duration,
      destination: pkg.destination,
      provider: pkg.provider,
      rating: pkg.rating,
      reviews: pkg.reviews,
      currency: pkg.currency,
      images: pkg.images,
      highlights: pkg.highlights,
      inclusions: pkg.inclusions,
      exclusions: pkg.exclusions,
      category: pkg.category,
      tags: pkg.tags,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }))

    return NextResponse.json({
      packages: transformedPackages,
      pagination: {
        total,
        limit,
        offset,
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
      },
    })

  } catch (error: any) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
