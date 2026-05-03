import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://mark-cart-waac.vercel.app']

// Stripe webhook needs raw body — must be before express.json()
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// Connect DB and Cloudinary on each request (with caching)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        await connectCloudinary();
        next();
    } catch (error) {
        console.error('Connection error:', error.message);
        res.status(500).json({ success: false, message: 'Server connection error' });
    }
});

app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Only listen when not running as serverless function
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, ()=>{
        console.log(`Server is running on http://localhost:${port}`)
    })
}

export default app;