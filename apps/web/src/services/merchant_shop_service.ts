import axios from "axios";
import baseUrl from "./api_service";
import type {
    MerchantProfile,
    Shop,
    Product,
    ShopProductListing,
    NearbyShopResult,
    CustomerSavedLocation,
    BusinessType,
    StockAvailability,
    VideoPost
} from "../../types";

const getAuthConfig = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const MerchantShopService = {
    // ─────────────────────────────────────────
    // MERCHANTS
    // ─────────────────────────────────────────
    async createMerchantProfile(
        data: {
            business_name: string;
            business_description: string;
            business_type: BusinessType;
        },
        token: string
    ): Promise<{ success: boolean; data: MerchantProfile; message?: string }> {
        const response = await axios.post(`${baseUrl}/api/v1/merchants`, data, getAuthConfig(token));
        return response.data;
    },

    async getMerchantProfile(merchantId: number): Promise<{ success: boolean; data: MerchantProfile }> {
        const response = await axios.get(`${baseUrl}/api/v1/merchants/${merchantId}`);
        return response.data;
    },

    async updateMerchantProfile(
        merchantId: number,
        data: Partial<MerchantProfile>,
        token: string
    ): Promise<{ success: boolean; data: MerchantProfile }> {
        const response = await axios.patch(`${baseUrl}/api/v1/merchants/${merchantId}`, data, getAuthConfig(token));
        return response.data;
    },

    async getMerchantShops(merchantId: number): Promise<{ success: boolean; data: Shop[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/merchants/${merchantId}/shops`);
        return response.data;
    },

    async getMerchantVideos(merchantId: number): Promise<{ success: boolean; data: VideoPost[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/merchants/${merchantId}/videos`);
        return response.data;
    },

    // ─────────────────────────────────────────
    // SHOPS
    // ─────────────────────────────────────────
    async createShop(
        shopData: {
            merchant_id: number;
            name: string;
            description?: string;
            phone?: string;
            address: string;
            city: string;
            state?: string;
            pincode?: string;
            country: string;
            latitude: number;
            longitude: number;
        },
        token: string
    ): Promise<{ success: boolean; data: Shop; message?: string }> {
        const response = await axios.post(`${baseUrl}/api/v1/shops`, shopData, getAuthConfig(token));
        return response.data;
    },

    async getShopDetails(shopId: number): Promise<{ success: boolean; data: Shop }> {
        const response = await axios.get(`${baseUrl}/api/v1/shops/${shopId}`);
        return response.data;
    },

    async updateShopDetails(
        shopId: number,
        data: Partial<Shop>,
        token: string
    ): Promise<{ success: boolean; data: Shop }> {
        const response = await axios.patch(`${baseUrl}/api/v1/shops/${shopId}`, data, getAuthConfig(token));
        return response.data;
    },

    async getShopProducts(shopId: number): Promise<{ success: boolean; data: ShopProductListing[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/shops/${shopId}/products`);
        return response.data;
    },

    async getShopVideos(shopId: number): Promise<{ success: boolean; data: VideoPost[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/shops/${shopId}/videos`);
        return response.data;
    },

    async addProductToShop(
        shopId: number,
        data: {
            product_id: number;
            price: number;
            currency?: string;
            availability: StockAvailability;
        },
        token: string
    ): Promise<{ success: boolean; data: ShopProductListing }> {
        const response = await axios.post(`${baseUrl}/api/v1/shops/${shopId}/products`, data, getAuthConfig(token));
        return response.data;
    },

    async updateShopProductListing(
        listingId: number,
        data: {
            price?: number;
            availability?: StockAvailability;
            status?: 'ACTIVE' | 'INACTIVE';
        },
        token: string
    ): Promise<{ success: boolean; data: ShopProductListing }> {
        const response = await axios.patch(`${baseUrl}/api/v1/shop-products/${listingId}`, data, getAuthConfig(token));
        return response.data;
    },

    async getNearbyShops(params: {
        latitude: number;
        longitude: number;
        radius?: number; // meters e.g. 5000
    }): Promise<{ success: boolean; data: NearbyShopResult[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/shops/nearby`, { params });
        return response.data;
    },

    // ─────────────────────────────────────────
    // CENTRAL PRODUCTS & SEARCH
    // ─────────────────────────────────────────
    async searchProducts(query: string): Promise<{ success: boolean; data: Product[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/search/products`, {
            params: { q: query },
        });
        return response.data;
    },

    async createProduct(
        product: {
            name: string;
            brand?: string;
            description?: string;
            specifications?: Record<string, any>;
            category?: string;
        },
        token: string
    ): Promise<{ success: boolean; data: Product }> {
        const response = await axios.post(`${baseUrl}/api/v1/products`, product, getAuthConfig(token));
        return response.data;
    },

    async getProductDetails(productId: number): Promise<{ success: boolean; data: Product }> {
        const response = await axios.get(`${baseUrl}/api/v1/products/${productId}`);
        return response.data;
    },

    async getShopsSellingProduct(productId: number): Promise<{ success: boolean; data: (ShopProductListing & { shop: Shop })[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/products/${productId}/shops`);
        return response.data;
    },

    async searchNearbyProductShops(params: {
        latitude: number;
        longitude: number;
        product_id: number;
        radius?: number; // in meters, e.g. 5000
    }): Promise<{ success: boolean; data: NearbyShopResult[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/search/nearby`, { params });
        return response.data;
    },

    async discoverShops(params?: {
        city?: string;
        keyword?: string;
    }): Promise<{ success: boolean; data: Shop[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/discover/shops`, { params });
        return response.data;
    },

    // ─────────────────────────────────────────
    // CUSTOMER SAVED LOCATIONS
    // ─────────────────────────────────────────
    async getSavedLocations(token: string): Promise<{ success: boolean; data: CustomerSavedLocation[] }> {
        const response = await axios.get(`${baseUrl}/api/v1/locations/saved`, getAuthConfig(token));
        return response.data;
    },

    async saveLocation(
        data: {
            label: string;
            address: string;
            city: string;
            pincode?: string;
            latitude: number;
            longitude: number;
        },
        token: string
    ): Promise<{ success: boolean; data: CustomerSavedLocation }> {
        const response = await axios.post(`${baseUrl}/api/v1/locations/saved`, data, getAuthConfig(token));
        return response.data;
    },

    async deleteSavedLocation(id: number, token: string): Promise<{ success: boolean }> {
        const response = await axios.delete(`${baseUrl}/api/v1/locations/saved/${id}`, getAuthConfig(token));
        return response.data;
    },

    // ─────────────────────────────────────────
    // VIDEO RICH DETAILS & RELATIONS
    // ─────────────────────────────────────────
    async getVideoRichDetails(videoId: number): Promise<any> {
        const response = await axios.get(`${baseUrl}/v1/videos/${videoId}`);
        return response.data;
    },

    async getRelatedShopsForVideo(videoId: number): Promise<{ success: boolean; data: NearbyShopResult[] }> {
        const response = await axios.get(`${baseUrl}/v1/videos/${videoId}/related-shops`);
        return response.data;
    },

    async getRelatedProductsForVideo(videoId: number): Promise<{ success: boolean; data: Product[] }> {
        const response = await axios.get(`${baseUrl}/v1/videos/${videoId}/related-products`);
        return response.data;
    },
};
export default MerchantShopService;
