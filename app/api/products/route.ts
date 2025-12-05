import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const onSale = searchParams.get('onSale')
    const isNew = searchParams.get('isNew')

    const filter: any = {}
    if (category) filter.category = category
    if (onSale === 'true') filter.isSale = true
    if (isNew === 'true') filter.isNew = true

    const products = await Product.find(filter).sort({ createdAt: -1 })

    // Transform products to match frontend format
    const transformedProducts = products.map((product) => {
      return {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        price: product.isSale && product.salePrice ? product.salePrice : product.price,
        originalPrice: product.originalPrice || product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: product.images || [],
        description: product.description,
        notes: {
          top: product.notesTop || [],
          middle: product.notesMiddle || [],
          base: product.notesBase || [],
        },
        size: product.size || [],
        inStock: product.inStock,
        isNew: product.isNew,
        isSale: product.isSale,
        badge: product.badge,
      }
    })

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const {
      name,
      category,
      price,
      originalPrice,
      salePrice,
      salePercent,
      rating,
      reviews,
      image,
      images,
      description,
      notes,
      size,
      inStock,
      isNew,
      isSale,
      badge,
    } = body

    const product = await Product.create({
      name,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      salePercent: salePercent ? parseFloat(salePercent) : undefined,
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews || 0,
      image,
      images: images || undefined,
      description,
      notesTop: notes?.top || undefined,
      notesMiddle: notes?.middle || undefined,
      notesBase: notes?.base || undefined,
      size: size || undefined,
      inStock: inStock !== undefined ? inStock : true,
      isNew: isNew || false,
      isSale: isSale || false,
      badge: badge || undefined,
    })

    return NextResponse.json({
      id: product._id.toString(),
      ...product.toObject(),
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

