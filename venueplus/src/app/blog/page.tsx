'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Calendar, User, ArrowRight, Clock, Eye, Heart, Share2, Tag } from 'lucide-react'
import { Header } from '@/components/header'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const categories = ['All', 'Travel Tips', 'Destinations', 'Culture', 'Food & Drinks', 'Adventure', 'Photography', 'Budget Travel']

  const blogPosts = [
    {
      id: 1,
      slug: "ultimate-guide-solo-trip-india",
      title: "The Ultimate Guide to Planning Your First Solo Trip to India",
      excerpt: "Discover the enchanting beauty of India through this comprehensive guide covering safety tips, must-visit destinations, cultural etiquette, and budget-friendly recommendations for solo travelers.",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Priya Sharma",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Travel Tips",
      tags: ["Solo Travel", "India", "Safety", "Planning"],
      views: 2847,
      likes: 156,
      featured: true
    },
    {
      id: 2,
      slug: "hidden-gems-kerala",
      title: "Hidden Gems of Kerala: 10 Offbeat Destinations You Must Visit",
      excerpt: "Explore Kerala beyond the popular tourist spots. From secret backwater villages to pristine hill stations, discover the untouched beauty of God's Own Country.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Arjun Menon",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 12, 2024",
      readTime: "6 min read",
      category: "Destinations",
      tags: ["Kerala", "Hidden Gems", "Backwaters", "Hills"],
      views: 1923,
      likes: 89,
      featured: false
    },
    {
      id: 3,
      slug: "street-food-chronicles-mumbai",
      title: "Street Food Chronicles: A Culinary Journey Through Mumbai",
      excerpt: "From vada pav to pav bhaji, experience Mumbai's vibrant street food culture through this gastronomic adventure covering the best food streets and local favorites.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Kavya Patel",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      category: "Food & Drinks",
      tags: ["Mumbai", "Street Food", "Local Culture", "Culinary"],
      views: 3156,
      likes: 234,
      featured: true
    },
    {
      id: 4,
      slug: "photography-guide-golden-hour-rajasthan",
      title: "Photography Guide: Capturing the Golden Hour in Rajasthan",
      excerpt: "Master the art of desert photography with tips on timing, equipment, and composition to capture Rajasthan's magnificent palaces and landscapes during golden hour.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Rohit Singh",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Photography",
      tags: ["Photography", "Rajasthan", "Golden Hour", "Landscapes"],
      views: 1456,
      likes: 98,
      featured: false
    },
    {
      id: 5,
      slug: "budget-backpacking-himalayas",
      title: "Budget Backpacking Through the Himalayas: A 15-Day Adventure",
      excerpt: "Complete guide to exploring the majestic Himalayas on a shoestring budget, including accommodation tips, trekking routes, and essential gear recommendations.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Ankit Gupta",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 5, 2024",
      readTime: "12 min read",
      category: "Budget Travel",
      tags: ["Himalayas", "Budget Travel", "Trekking", "Adventure"],
      views: 2341,
      likes: 187,
      featured: false
    },
    {
      id: 6,
      slug: "cultural-immersion-rural-india",
      title: "Cultural Immersion: Living with Local Families in Rural India",
      excerpt: "Experience authentic Indian culture through homestays in rural villages. Learn about local traditions, participate in daily activities, and create meaningful connections.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Meera Krishnan",
      authorImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Dec 3, 2024",
      readTime: "9 min read",
      category: "Culture",
      tags: ["Culture", "Homestay", "Rural India", "Authentic Experience"],
      views: 1789,
      likes: 145,
      featured: false
    },
    {
      id: 7,
      slug: "adventure-sports-destinations-india",
      title: "Adrenaline Rush: Top Adventure Sports Destinations in India",
      excerpt: "From river rafting in Rishikesh to paragliding in Himachal Pradesh, discover India's most thrilling adventure sports destinations and what to expect.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Vikram Sethi",
      authorImage: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Nov 30, 2024",
      readTime: "10 min read",
      category: "Adventure",
      tags: ["Adventure Sports", "Adrenaline", "India", "Outdoor Activities"],
      views: 2654,
      likes: 201,
      featured: true
    },
    {
      id: 8,
      slug: "digital-nomad-guide-hill-stations",
      title: "Digital Nomad Guide: Working Remotely from Indian Hill Stations",
      excerpt: "Best hill stations in India for digital nomads, complete with WiFi availability, cost of living, coworking spaces, and lifestyle tips for remote workers.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      author: "Neha Agarwal",
      authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "Nov 28, 2024",
      readTime: "11 min read",
      category: "Travel Tips",
      tags: ["Digital Nomad", "Remote Work", "Hill Stations", "Lifestyle"],
      views: 1876,
      likes: 134,
      featured: false
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Sky Blue Gradient Background - Same as Home Page */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-sky-300/60 via-sky-200/35 to-transparent w-full pointer-events-none z-10" 
           style={{ height: '50vh' }}>
      </div>
      
      <Header />
      
      {/* Main Content */}
      <main className="pt-4 relative overflow-hidden z-10">
        {/* Hero Section */}
        <section className="relative py-8 -mt-4 z-20">
          <div className="max-w-7xl mx-auto px-8 lg:px-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-normal lg:tracking-tight bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent leading-tight break-words">
              <span className="block">VenuePlus Travel</span>
              <span className="block bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Blog & Stories</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Discover inspiring travel stories, expert tips, and hidden gems from fellow adventurers around the world
            </p>
            
            {/* Search Bar - Same styling as Home Page */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles, destinations, tips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 text-base bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      <section className="py-20 px-6 lg:px-8 xl:px-16 bg-gradient-to-b from-white to-sky-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

        {/* Featured Posts Section */}
        {selectedCategory === 'All' && (
          <section className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8 text-center">Featured Stories</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          likedPosts.includes(post.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 text-sky-700 px-3 py-1 rounded-full font-medium border border-sky-200/50">{post.category}</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={post.authorImage}
                            alt={post.author}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>
            <p className="text-gray-600">{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        likedPosts.includes(post.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3 h-3" fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  {post.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                    <span className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 text-sky-700 px-2 py-1 rounded-full font-medium border border-sky-200/50">{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={post.authorImage}
                          alt={post.author}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{(post.views / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse different categories to discover amazing travel content.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-20 relative bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm p-12 text-center">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-200/20 to-transparent animate-pulse"></div>
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-300/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4">Stay Updated with Our Latest Stories</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get weekly travel inspiration, tips, and destination guides delivered straight to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <button className="group relative bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden flex items-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative">Subscribe</span>
                <ArrowRight className="w-4 h-4 relative" />
              </button>
            </div>
          </div>
        </section>
        </div>
      </section>
      </main>
    </div>
  )
}
