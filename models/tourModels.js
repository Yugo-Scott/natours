const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validator
      unique: true,
      trim: true, //remove all the white space in the beginning and the end of the string
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], //validator  
      minlength: [10, 'A tour name must have more or equal than 10 characters'], //validator
    },
    slug: String, //slug is a string that is used in the url instead of the id
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'], //validator
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'], //validator
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'], //validator
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult', //validator
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0, //because the beginning of the tour, no one has rated it yet
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'], //validator
    },
    priceDiscount:{ 
      type: Number, 
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW document creation
          return val < this.price; //100 < 200
        },
        message: 'Discount price ({VALUE}) should be below regular price', //({VALUE}) is the value that the user inputted
      }
      //custom validator
    },
    summary: {
      type: String,
      trim: true, //remove all the white space in the beginning and the end of the string
      required: [true, 'A tour must have a description'], //validator
    },
    description: {
      type: String,
      trim: true, //remove all the white space in the beginning and the end of the string
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'], //validator
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //when we have a field that we don't want to show up in the output, we can set the select property to false
    },
    startDates: [Date],//array of dates diffrent dates for the same tour
    secretTour: {
      type: Boolean,
      default: false,
    },
  }, 
  {
    toJSON: { virtuals: true }, //when data is outputted as JSON, we want the virtual properties to be included
    toObject: { virtuals: true }, //when data is outputted as an object, we want the virtual properties to be included
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// document middleware
tourSchema.pre('save', function (next) { //document middleware runs before .save() and .create() not for .insertMany()  
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function (doc, next) { //doc is the document that is just saved to the database
  console.log(doc);
  next();
});

// query middleware
tourSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ secretTour: { $ne: true } }); //this.find({ secretTour: { $ne: true } }) means find all the documents that secretTour is not equal to true
  this.start = Date.now();
  next();
});

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
  //this points to the current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //this.pipeline() is an array of all the aggregation stages that are going to be executed
  console.log(this.pipeline());
  next();
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
