import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  offerPrice: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Fruits', 'Vegetables', 'Organic', 'Seasonal Bundles'],
    required: true
  },
  imageUrls: {
    type: [String],
    required: true
  },
  inStock: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'kg'
  },
  nutritionInfo: {
    type: String
  },
  origin: {
    type: String
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isSeasonal: {
    type: Boolean,
    default: false
  },
  variants: [{
    size: String,
    weight: Number,
    price: Number,
    offerPrice: Number,
    inStock: Number
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; 