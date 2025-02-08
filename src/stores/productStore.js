import { create } from 'zustand'
import { toast } from 'react-toastify'

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    projectFetchTimes: {}, // Track when each project's products were last fetched

    // Fetch products for multiple projects at once
    fetchAllProducts: async (projectIds) => {
        if (!projectIds || projectIds.length === 0) return;

        set({ isLoading: true });
        console.log('Fetching products for projects:', projectIds);

        try {
            const responses = await Promise.all(
                projectIds.map(projectId =>
                    fetch(`/api/projects/${projectId}/products`, {
                        credentials: 'include'
                    })
                        .then(async res => {
                            if (!res.ok) {
                                const errorText = await res.text();
                                throw new Error(`Failed to fetch products for project ${projectId}: ${errorText}`);
                            }
                            return res.json().then(products => products.map(p => ({ ...p, project_id: projectId })));
                        })
                )
            );

            const newProducts = responses.flat();
            console.log('Fetched products:', newProducts);

            set({
                products: newProducts,
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error('Error in fetchAllProducts:', error);
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Fetch products for a single project
    fetchProducts: async (projectId) => {
        set({ isLoading: true });

        try {
            const response = await fetch(`/api/projects/${projectId}/products`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();

            set({
                products: data,
                isLoading: false,
                error: null
            });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error('Failed to fetch products');
            return [];
        }
    },

    // Fetch a single product
    fetchProduct: async (projectId, productId) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`/api/projects/${projectId}/products/${productId}`, {
                credentials: 'include'
            })
            if (!response.ok) throw new Error('Failed to fetch product')
            const data = await response.json()
            set({ currentProduct: data, isLoading: false })
        } catch (error) {
            set({ error: error.message, isLoading: false })
            toast.error('Failed to fetch product')
        }
    },

    // Create a new product
    createProduct: async (projectId, productData) => {
        set({ isLoading: true })
        try {
            console.log('Making API request to create product:', {
                url: `/api/projects/${projectId}/products`,
                method: 'POST',
                projectId,
                productData
            });

            const response = await fetch(`/api/projects/${projectId}/products`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            console.log('API response status:', response.status);
            const responseText = await response.text();
            console.log('API response text:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Failed to create product')
            }

            const data = JSON.parse(responseText);
            console.log('Parsed response data:', data);

            set(state => ({
                products: [...state.products, data],
                currentProduct: data,
                isLoading: false
            }))
            toast.success('Product created successfully')
            return data
        } catch (error) {
            console.error('Error in createProduct:', error);
            set({ error: error.message, isLoading: false })
            toast.error(error.message || 'Failed to create product')
            throw error
        }
    },

    // Update a product
    updateProduct: async (projectId, productId, productData) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`/api/projects/${projectId}/products/${productId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to update product')
            }
            const data = await response.json()
            set(state => ({
                currentProduct: data,
                isLoading: false
            }))
            toast.success('Product updated successfully')
            return data
        } catch (error) {
            set({ error: error.message, isLoading: false })
            toast.error('Failed to update product')
            throw error
        }
    },

    // Delete a product
    deleteProduct: async (projectId, productId) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`/api/projects/${projectId}/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to delete product')
            }
            set(state => ({
                currentProduct: null,
                isLoading: false
            }))
            toast.success('Product deleted successfully')
        } catch (error) {
            set({ error: error.message, isLoading: false })
            toast.error('Failed to delete product')
        }
    },

    // Clear current product
    clearCurrentProduct: () => set({ currentProduct: null }),

    // Clear products for a specific project
    clearProjectProducts: (projectId) => {
        set(state => ({
            products: state.products.filter(p => p.project_id !== projectId)
        }));
    },

    // Clear all products
    clearProducts: () => {
        set({ products: [], currentProduct: null });
    },

    // Clear cache for a specific project
    clearProjectCache: (projectId) => {
        set(state => ({
            projectFetchTimes: {
                ...state.projectFetchTimes,
                [projectId]: null
            }
        }));
    },
}))

export default useProductStore 
