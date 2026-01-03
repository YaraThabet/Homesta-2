import React from 'react';
import { Plus } from 'lucide-react';

const Collections = () => {
  const collections = [
    {
      name: 'My Rooms',
      savedCount: 6,
      images: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop',
      ]
    },
    {
      name: 'Kitchen',
      savedCount: 4,
      images: [
        'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop',
      ]
    },
    {
      name: 'Bathroom',
      savedCount: 1,
      images: [
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop',
      ],
      isSingle: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Collections</h1>
            <p className="text-muted-foreground">Explore and save your favorite destinations here.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
            <Plus className="w-4 h-4" />
            Create a list
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {collections.map((collection, index) => (
            <div key={index} className="cursor-pointer group">
              {/* Image Grid */}
              {collection.isSingle ? (
                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={collection.images[0]} 
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {collection.images.map((image, imgIndex) => (
                    <div 
                      key={imgIndex} 
                      className="aspect-square rounded-xl overflow-hidden"
                    >
                      <img 
                        src={image} 
                        alt={`${collection.name} ${imgIndex + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Collection Info */}
              <h3 className="font-semibold text-foreground text-lg">{collection.name}</h3>
              <p className="text-sm text-muted-foreground">{collection.savedCount} Saved</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
