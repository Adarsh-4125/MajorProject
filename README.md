#VistaStay is a Vacation Rental and Services Platform through localhosts at that place.

A full-stack web application for booking vacation rentals, built with Node.js,Express,MongoDB, and EJS.
These platform allows users to browse vacation rentals, make bookings, and manage their reservations. 
Allows property owners to manage their listings — including editing and tracking bookings.

## Key Features

###  🏡 Properties Management:
- **CRUD Operations**: Create, read, update, and delete properties.
- **Image Upload**: Support for **multiple** property images
- **Geolocation**: Location-based features with coordinates using mapbox npm package.
- **Browse Properties**: View all available vacation rentals with images, about the space, and pricing.
- **Category Filtering**: View the homes,beaches or mountains places by the category filtering.
- **Search & Filter**: Find Places by location and category.
- **Owner Dashboard**: Property owners can manage their properties(edit,create and delete) and view booking requests.
- **Recommendations**: Based on user recent views of listings/properties we can give the recommendations according to that.

### 👤 User Management:
- **User Authentication**: Secure login and registration using passportjs npm package
- **User Authorization**: User should be login or signup to add new properties/adding review for the property and only owner of particular property can manage their properties.
- **Session Management**: Secure session handling with MongoDB storage

### ⭐ Review System:
- **Rating & Reviews**: Users can rate and review if they are logged in and manage their reviews.

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly experience using bootstrap and CSS3.
- **Interactive Maps**: Users can see the place of thier booking in the map.
- **Image Gallery**: To gain the trust of Users we have added multiple images of the place,
                      so that user believes and book the place.

### Booking System
- **Booking Creation**: Users can create bookings with date selection and guest count
- **Price Calculation**: Automatic calculation based on nights and listing price
- **Owner Notifications**: Property owners are notified of new bookings on thier dashboard.


## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Passport.js**: Authentication middleware
- **Express Session**: Session management
- **Connect Flash**: Flash messages

### Frontend
- **EJS**: Template engine
- **Bootstrap**: CSS framework for responsive design
- **JavaScript**: Client-side interactivity
- **CSS3**: Custom styling

### Additional Tools
- **Method Override**: HTTP method override
- **EJS Mate**: EJS layout support
- **Joi**: Used for server side form validations of property,reviews and booking.
- **BootStrap**: Used for client side form validations.
- **Cloudinary**: Used for Image Storage and passing url of image for rendering multiple images on the page.
- **Mapbox**: Mapbox is used for rendering the location of particular place for user connectivity to the place.


## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd major-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
ATLASDB_URL=your_mongodb_connection_string

# Session Configuration
SECRET=your_session_secret_key

# for image uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# For location-based interconnectivity
MAP_TOKEN=your_mapbox_api_token
```
### 4. Database Setup
Ensure your MongoDB database is running and accessible. The application will automatically create the necessary collections when it starts.

### 5. Start the Application
```bash
nodemon app.js
```

The application will be available at `http://localhost:8080`

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced booking calendar
