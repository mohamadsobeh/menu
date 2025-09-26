// @ts-ignore: Import type may not be found in some environments
import type { Offer } from "../../shared/types";
// 🔄 Mapper: يحول الـ API response (camelCase) إلى الشكل المتوقع بالـ frontend (snake_case)
export function mapOffer(apiOffer: any): Offer {
    return {
        id: apiOffer.id,
        title: apiOffer.title,
        description: apiOffer.description,
        image_url: apiOffer.imageUrl || apiOffer.image_url, // fallback
        price_syp: Number(apiOffer.priceSyp ?? apiOffer.price_syp ?? 0),
        price_usd: Number(apiOffer.priceUsd ?? apiOffer.price_usd ?? 0),
        is_recommended: apiOffer.isRecommended ?? apiOffer.is_recommended ?? false,
        restaurantId: apiOffer.restaurantId,
        createdAt: apiOffer.createdAt,
        updatedAt: apiOffer.updatedAt,

        // 🔗 إذا في products جوا offer
        products: apiOffer.products?.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            images: p.images,
            price_syp: Number(p.priceSyp ?? p.price_syp ?? 0),
            price_usd: Number(p.priceUsd ?? p.price_usd ?? 0),
            isFav: p.isFav ?? p.is_fav ?? false,
            categoryId: p.categoryId,
            restaurantId: p.restaurantId,
        })),
    } as Offer;
}

// 🔄 Mapper للـ array
export function mapOffers(apiOffers: any[]): Offer[] {
    return apiOffers.map(mapOffer);
}

// 🔄 Mapper للـ Product
export function mapProduct(apiProduct: any): any {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        calories: apiProduct.calories,
        description: apiProduct.description,
        isAvailable: apiProduct.isAvailable,
        ingredients: apiProduct.ingredients || [],
        images: apiProduct.images || [],
        priceSyp: String(apiProduct.priceSyp ?? apiProduct.price_syp ?? 0),
        priceUsd: apiProduct.priceUsd ? String(apiProduct.priceUsd) : null,
        isFav: apiProduct.isFav ?? apiProduct.is_fav ?? false,
        categoryId: apiProduct.categoryId,
        restaurantId: apiProduct.restaurantId,
        createdById: apiProduct.createdById,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.updatedAt,
    };
}

// 🔄 Mapper للـ products array
export function mapProducts(apiProducts: any[]): any[] {
    return apiProducts.map(mapProduct);
}